"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./QuickActionButtons.module.css";
import {
  BookmarkIcon,
  BookmarkOutlineIcon,
  CompareIcon,
  CompareRemoveIcon,
} from "../icons";

// where the two floating buttons sit over the photo, per the Figma
// placements — "corners" (V4's Desktop V1: Compare top-left, Save
// top-right), "corners-bottom" (Desktop V4: the same, dropped to the bottom
// corners), "stack-top-left" (Desktop V2 and Mobile V1: Save over Compare,
// top-left) and "stack-bottom-left" (Desktop V3: Save over Compare,
// bottom-left). Same buttons, same animations; the stacks differ from the
// corners in one way: Save is anchored left like Compare, so its "Saved"
// pill grows to the right instead (see .bookmarkContentClipLeft).
export type QuickActionPlacement =
  | "corners"
  | "corners-bottom"
  | "stack-top-left"
  | "stack-bottom-left";

// the desktop tiles use 36px circles; the mobile tiles shrink everything to
// leave more of the photo showing — 32px circles on Mobile V1, 28px
// ("compact") on Mobile V2's wider photo
export type QuickActionSize = "desktop" | "mobile" | "compact";

// pill widths are fixed rather than measured, since their content ("Saved"
// + an icon; a badge + "Compare") never changes. Desktop: the "Saved" pill
// clears paddingLeft(12) + "Saved"(~39px) + gap(8) + icon(~11px) +
// paddingRight(12); the "N Compare" pill paddingLeft(11) + badge(18) +
// gap(9) + "Compare"(~58px) + paddingRight(9). Mobile uses the Figma pill's
// raw 32px metrics (see .sizeMobile in the CSS) with the same labels.
const METRICS = {
  desktop: {
    button: 36,
    savedPill: 84,
    comparePill: 105,
    bookmarkIcon: 16,
    compareIcon: 13,
    removeIcon: 18,
  },
  mobile: {
    button: 32,
    savedPill: 80,
    comparePill: 104,
    bookmarkIcon: 15,
    compareIcon: 12,
    removeIcon: 17,
  },
  // "Saved": 9 + ~39 + 8 + ~10.5 + 9; "N Compare": 10 + 14 + 7 + ~58 + 9
  compact: {
    button: 28,
    savedPill: 76,
    comparePill: 98,
    bookmarkIcon: 14,
    compareIcon: 11,
    removeIcon: 15,
  },
} as const;

// how long the "Saved" pill stays up before it collapses back into the
// circle (see the pillTimeoutRef-driven timeout in toggleSave)
const SAVED_PILL_DURATION = 1600;

// The two floating quick-action buttons that sit over a product tile's
// photo — Save (bookmark) and Compare — shared by the desktop and mobile
// tiles so they animate identically everywhere. They're absolutely
// positioned, so the parent must be `position: relative` and is what the
// placement's top/left/right values are measured against.
//
// Reveal: with revealOnHover (desktop) the white circle + icon of each
// button fade in while the tile is hovered and out again on hover-out, and
// stay on for good once Save is saved / while Compare is selected. Without
// it (mobile — a touch surface has nothing to hover) they're simply always
// on.
//
// Save: tapping grows the circle into a "Saved" pill, which holds for
// SAVED_PILL_DURATION before shrinking back down into the circle, landing
// on the red-filled glyph. The icon is one persistent element pinned to
// the button's fixed edge the whole time (see .bookmarkContentClip) — only
// the width animates; the label is revealed/hidden purely by that width
// clipping it, never by fading, so there's no half-transparent ghost.
//
// Compare: tapping grows the circle into a red pill carrying the tile's
// position in the selection order (1, 2, 3…) next to the word "Compare" —
// V3's ProductCardCompareSave badge pattern. Hovering the selected pill
// (desktop only) swaps the number for an "×". Deselecting is a small
// choreographed shrink so nothing snaps (see the timeline below).
export default function QuickActionButtons({
  isHovered = false,
  revealOnHover = true,
  size = "desktop",
  placement = "corners",
  isComparing = false,
  compareNumber,
  onToggleCompare,
}: {
  isHovered?: boolean;
  revealOnHover?: boolean;
  size?: QuickActionSize;
  placement?: QuickActionPlacement;
  isComparing?: boolean;
  compareNumber?: number;
  onToggleCompare?: () => void;
}) {
  const m = METRICS[size];
  // "corners-bottom" keeps Save right-anchored, so it is not "stacked left"
  // and its pill keeps growing leftwards
  const stackedLeft =
    placement === "stack-top-left" || placement === "stack-bottom-left";
  // hover only means anything where there is a hover
  const revealed = revealOnHover ? isHovered : true;

  const [isSaved, setIsSaved] = useState(false);
  const [showSavedPill, setShowSavedPill] = useState(false);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkCircleRef = useRef<HTMLSpanElement>(null);
  const bookmarkIconRef = useRef<HTMLSpanElement>(null);
  const bookmarkClipRef = useRef<HTMLSpanElement>(null);
  const savedLabelRef = useRef<HTMLSpanElement>(null);
  const pillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compareBtnRef = useRef<HTMLButtonElement>(null);
  const compareCircleRef = useRef<HTMLSpanElement>(null);
  const compareIconRef = useRef<HTMLSpanElement>(null);
  const compareClipRef = useRef<HTMLSpanElement>(null);
  // true from deselect until the pill has finished shrinking back into the
  // circle, so the red fill (and the badge + label, still sliding away)
  // outlive isComparing by the length of the tween
  const [pillShrinking, setPillShrinking] = useState(false);
  const wasComparingRef = useRef(isComparing);
  const shrinkTlRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  // the number keeps rendering while the pill shrinks, after the page has
  // already dropped this tile from the selection (compareNumber is 0 by then)
  const lastNumberRef = useRef(compareNumber);
  if (isComparing) lastNumberRef.current = compareNumber;

  const showCompare = revealed || isComparing;
  // true from the very render that deselects (wasComparingRef only flips in
  // the effect below, so this also covers the frame React paints before that
  // effect has set pillShrinking) until the shrink timeline lands
  const compareShrinking =
    !isComparing && (pillShrinking || wasComparingRef.current);

  // the bookmark's white circle and its glyph move together: revealed while
  // the tile is hovered (if hover applies) and hidden again on hover-out, on
  // for good once saved, and on for the full width of the "Saved" pill,
  // whose background the circle doubles as (inset:0 on a wide button paints
  // a rounded rect, not just a circle)
  useEffect(() => {
    const show = revealed || isSaved || showSavedPill;
    const tween = {
      opacity: show ? 1 : 0,
      duration: show ? 0.28 : 0.16,
      ease: "power2.out",
      // a state flip within 0.28s of the last one would otherwise leave two
      // opacity tweens running — and the older, longer one writes last.
      // "auto" only kills the opacity part, so toggleSave's colour + pop
      // tweens on the icon are left alone.
      overwrite: "auto" as const,
    };
    gsap.to(bookmarkCircleRef.current, tween);
    gsap.to(bookmarkIconRef.current, tween);
    gsap.set(bookmarkBtnRef.current, {
      pointerEvents: show ? "auto" : "none",
    });
  }, [revealed, isSaved, showSavedPill]);

  // "Saved" pill: purely a width tween — growing the button reveals the
  // "Saved" label (which sits behind .bookmarkContentClip's overflow:
  // hidden) from behind the icon it's pinned next to. The label is only
  // `visibility: hidden` while the button is fully collapsed (the clip can't
  // quite hide its tail on its own) — flipped visible before the grow
  // starts and hidden again once the shrink lands, so it's binary, never
  // faded. overwrite: true kills any still-running width tween on the
  // button the instant this one is created — including its onComplete — so a
  // re-save mid-collapse can't have the old shrink land late and re-hide the
  // label under the new grow.
  // The wrapper only clips (overflow: hidden) while the label is actually
  // on screen — from just before the grow to just after the shrink lands.
  // At rest the label is visibility: hidden anyway, so there's nothing to
  // clip, and leaving no overflow clip in the button avoids the hairline
  // seams Chrome can paint along a clip edge that sits on a fractional
  // pixel.
  useEffect(() => {
    if (showSavedPill) {
      gsap.set(bookmarkClipRef.current, { overflow: "hidden" });
      gsap.set(savedLabelRef.current, { visibility: "visible" });
    }
    gsap.to(bookmarkBtnRef.current, {
      width: showSavedPill ? m.savedPill : m.button,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => {
        if (!showSavedPill) {
          gsap.set(savedLabelRef.current, { visibility: "hidden" });
          gsap.set(bookmarkClipRef.current, { overflow: "visible" });
        }
      },
    });
  }, [showSavedPill, m]);

  // clears the "Saved" pill's auto-collapse timer if the tile unmounts mid-hold
  useEffect(() => {
    return () => {
      if (pillTimeoutRef.current) clearTimeout(pillTimeoutRef.current);
    };
  }, []);

  // compare button: same reveal for its white circle as the bookmark (never
  // shows just because the tile is selected — the selected pill replaces
  // it outright)
  useEffect(() => {
    gsap.to(compareCircleRef.current, {
      opacity: revealed ? 1 : 0,
      duration: revealed ? 0.28 : 0.16,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [revealed]);

  // default compare icon fade, mirroring the bookmark icon's own fade — moot
  // once selected since the active pill hides it via CSS, but keeps the
  // in/out timing consistent between the two floating buttons
  useEffect(() => {
    gsap.to(compareIconRef.current, {
      opacity: showCompare ? 1 : 0,
      duration: showCompare ? 0.28 : 0.16,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.set(compareBtnRef.current, {
      pointerEvents: showCompare ? "auto" : "none",
    });
  }, [showCompare]);

  // selected pill: the same width tween as the "Saved" pill, mirrored —
  // this button is anchored left, so growing it reveals the badge + "Compare"
  // label (inside .compareContentClip's overflow: hidden) out to the right.
  //
  // Deselecting is a small choreographed timeline rather than a bare width
  // tween, so nothing snaps: the badge + label fade out as the width starts
  // collapsing, the fill cross-fades red → white (or → clear if the pointer
  // has left) under them, and the plain icon fades back in as the circle
  // lands. Only once it's all landed does .compareButtonShrinking come off
  // (see pillShrinking) and the inline fill get cleared. A re-select
  // mid-collapse kills the timeline outright — so its onComplete can't fire
  // late and hide the badge under the new grow.
  useEffect(() => {
    const wasComparing = wasComparingRef.current;
    wasComparingRef.current = isComparing;
    const btn = compareBtnRef.current;
    const clip = compareClipRef.current;

    if (isComparing) {
      shrinkTlRef.current?.kill();
      shrinkTlRef.current = null;
      setPillShrinking(false);
      // clip only while the badge + label are on screen (see the "Saved"
      // pill effect above for why the clip is off at rest)
      gsap.set(clip, { visibility: "visible", opacity: 1, overflow: "hidden" });
      gsap.set(btn, { clearProps: "backgroundColor" });
      gsap.to(btn, {
        width: m.comparePill,
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: true,
      });
      return;
    }

    if (!wasComparing) return;

    setPillShrinking(true);
    const settleVisible = revealed;
    const icon = compareIconRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(clip, { visibility: "hidden", overflow: "visible" });
        // the icon is display:none for the whole shrink (see
        // .compareButtonShrinking), so it can only fade in once the class
        // comes off — start it at 0 now, so the re-render reveals it
        // invisible, then bring it up over the white circle that's landed
        gsap.set(icon, { opacity: 0 });
        gsap.to(icon, {
          opacity: settleVisible ? 1 : 0,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
        shrinkTlRef.current = null;
        setPillShrinking(false);
      },
    });
    shrinkTlRef.current = tl;
    tl.to(
      btn,
      { width: m.button, duration: 0.3, ease: "power2.inOut", overwrite: true },
      0
    )
      .to(clip, { opacity: 0, duration: 0.12, ease: "power1.out" }, 0)
      .to(
        btn,
        {
          backgroundColor: settleVisible ? "#ffffff" : "rgba(255,255,255,0)",
          duration: 0.2,
          ease: "power2.out",
        },
        0.1
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `revealed` is
    // only sampled at the moment of deselect, on purpose
  }, [isComparing, m]);

  // the shrink leaves its final fill (white or clear) inline on the button
  // so the class swap is seamless; clear it only after that class is gone —
  // an inline white left behind would keep the circle "on" once the hover
  // ends
  useEffect(() => {
    if (!isComparing && !pillShrinking) {
      gsap.set(compareBtnRef.current, { clearProps: "backgroundColor" });
    }
  }, [isComparing, pillShrinking]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare?.();
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    gsap.to(bookmarkIconRef.current, {
      color: next ? "#e90029" : "#373a36",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.fromTo(
      bookmarkIconRef.current,
      { scale: 0.6, rotate: -8 },
      { scale: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" }
    );

    if (pillTimeoutRef.current) {
      clearTimeout(pillTimeoutRef.current);
      pillTimeoutRef.current = null;
    }

    if (next) {
      setShowSavedPill(true);
      pillTimeoutRef.current = setTimeout(() => {
        setShowSavedPill(false);
        pillTimeoutRef.current = null;
      }, SAVED_PILL_DURATION);
    } else {
      setShowSavedPill(false);
    }
  };

  // .touch switches every hover-only style off — a touch surface has no hover
  const sizeClass = `${
    size === "mobile"
      ? styles.sizeMobile
      : size === "compact"
        ? styles.sizeCompact
        : ""
  } ${revealOnHover ? "" : styles.touch}`;

  return (
    <>
      <button
        ref={bookmarkBtnRef}
        type="button"
        className={`${styles.bookmarkButton} ${sizeClass} ${
          placement === "stack-top-left"
            ? styles.bookmarkButtonStackTop
            : placement === "stack-bottom-left"
              ? styles.bookmarkButtonStackBottom
              : placement === "corners-bottom"
                ? styles.bookmarkButtonCornersBottom
                : ""
        }`}
        onClick={toggleSave}
        aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isSaved}
      >
        <span ref={bookmarkCircleRef} className={styles.bookmarkCircle} />
        <span
          ref={bookmarkClipRef}
          className={`${styles.bookmarkContentClip} ${
            stackedLeft ? styles.bookmarkContentClipLeft : ""
          }`}
        >
          <span
            ref={savedLabelRef}
            className={styles.savedPillLabel}
            aria-hidden="true"
          >
            Saved
          </span>
          <span ref={bookmarkIconRef} className={styles.bookmarkIconWrap}>
            {isSaved ? (
              <BookmarkIcon size={m.bookmarkIcon} />
            ) : (
              <BookmarkOutlineIcon size={m.bookmarkIcon} />
            )}
          </span>
        </span>
      </button>

      <button
        ref={compareBtnRef}
        type="button"
        className={`${styles.compareButton} ${sizeClass} ${
          placement === "stack-top-left"
            ? styles.compareButtonStackTop
            : placement === "stack-bottom-left" ||
                placement === "corners-bottom"
              ? styles.compareButtonBottom
              : ""
        } ${
          isComparing
            ? styles.compareButtonActive
            : compareShrinking
              ? styles.compareButtonShrinking
              : ""
        }`}
        onClick={toggleCompare}
        aria-label={isComparing ? "Remove from compare" : "Add to compare"}
        aria-pressed={isComparing}
      >
        <span ref={compareCircleRef} className={styles.compareCircle} />
        <span ref={compareIconRef} className={styles.compareIconWrap}>
          <CompareIcon size={m.compareIcon} />
        </span>
        <span ref={compareClipRef} className={styles.compareContentClip}>
          <span className={styles.compareBadge}>
            <span className={styles.compareBadgeNumber}>
              {lastNumberRef.current}
            </span>
            <span className={styles.compareBadgeRemove} aria-hidden="true">
              {/* the glyph only fills the middle ~half of this icon's box, so
                  18 here renders a ~9px "×" — the same visual height as the
                  12px number's capitals it swaps in for */}
              <CompareRemoveIcon size={m.removeIcon} />
            </span>
          </span>
          <span className={styles.compareActiveLabel} aria-hidden="true">
            Compare
          </span>
        </span>
      </button>
    </>
  );
}
