"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardCompareCheck.module.css";
import { goToProductDetail } from "../../lib/product";
import {
  BadgeCheckIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  CheckIcon,
  CircleCheckIcon,
  ListCheckIcon,
  WavePulseIcon,
} from "../icons";

// Product photos mirrored from the V1 tiles — well-composed, generously
// padded shots rather than tightly-cropped marketing photography, which
// read as oversized at this tile size.
const FRONT_IMAGE = "/images/product-refurbished-front-opt.jpg";
const FRONT_IMAGE_ALT = "UXA Signal Analyzer, front view";
const SECONDARY_IMAGE = "/images/gallery/gallery-front.jpg";
const SECONDARY_IMAGE_ALT = "Infiniium V-Series Oscilloscope, front view";

const VARIANTS = [
  {
    image: FRONT_IMAGE,
    alt: FRONT_IMAGE_ALT,
    condition: { icon: ListCheckIcon, label: "Refurbished, like-new" },
    warranty: { icon: BadgeCheckIcon, label: "3y warranty" },
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: { icon: WavePulseIcon, label: "Used & Calibrated" },
    warranty: { icon: BadgeCheckIcon, label: "90d warranty" },
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: { icon: CircleCheckIcon, label: "Used & Tested" },
    warranty: { icon: BadgeCheckIcon, label: "90d warranty" },
  },
];

// Version 3's "Desktop Compare Check Mark" tile: another fork off
// "Desktop Simplified", per the Figma spec — Compare becomes a plain
// checkbox + label (no numbered pill/badge; the toast at the bottom of the
// page still reports the running total), and Save moves to a floating icon
// button top-right, modeled on V1's "Desktop Quick Action" bookmark but with
// its own visibility split: the white circular backing only shows on hover
// (see bookmarkCircleRef), while the bookmark glyph itself also stays
// visible with no circle behind it once saved, even after the mouse leaves
// (see bookmarkIconRef) — plus the red fill + pop animation on toggle. V1
// and V2 are untouched.
export default function ProductCardCompareCheck({
  variant = 0,
  isComparing = false,
  onToggleCompare,
}: {
  variant?: number;
  isComparing?: boolean;
  onToggleCompare?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const shadowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkCircleRef = useRef<HTMLSpanElement>(null);
  const bookmarkIconRef = useRef<HTMLSpanElement>(null);

  const content = VARIANTS[variant % VARIANTS.length];
  const showBookmark = isHovered || isSaved;

  // card outline + drop shadow: strictly tied to real cursor hover, nothing else
  useEffect(() => {
    gsap.to(cardRef.current, {
      borderColor: isHovered ? "#e9eaed" : "rgba(233,234,237,0)",
      duration: 0.28,
      ease: "power2.out",
    });
    gsap.to(shadowRef.current, {
      opacity: isHovered ? 1 : 0,
      duration: 0.28,
      ease: "power2.out",
    });
  }, [isHovered]);

  // very subtle image zoom on hover
  useEffect(() => {
    gsap.to(zoomWrapRef.current, {
      scale: isHovered ? 1.03 : 1,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isHovered]);

  // the white circular backing only ever shows on hover — unlike the icon
  // itself, it never lingers once saved
  useEffect(() => {
    gsap.to(bookmarkCircleRef.current, {
      opacity: isHovered ? 1 : 0,
      duration: isHovered ? 0.28 : 0.16,
      ease: "power2.out",
    });
  }, [isHovered]);

  // bookmark icon fade — a saved item stays visible (just the icon, no
  // circle) even once the mouse leaves, same pattern as
  // ProductCardQuickAction
  useEffect(() => {
    gsap.to(bookmarkIconRef.current, {
      opacity: showBookmark ? 1 : 0,
      duration: showBookmark ? 0.28 : 0.16,
      ease: "power2.out",
    });
    gsap.set(bookmarkBtnRef.current, {
      pointerEvents: showBookmark ? "auto" : "none",
    });
  }, [showBookmark]);

  // safety net: a fast cursor exit (or leaving the window/tab) can skip the
  // card's own mouseleave — this double-checks real cursor position on every
  // document-wide mousemove while hovered, so the state can never get stuck
  useEffect(() => {
    if (!isHovered) return;
    const checkCursor = (e: MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) setIsHovered(false);
    };
    const handleWindowLeave = () => setIsHovered(false);
    document.addEventListener("mousemove", checkCursor);
    document.addEventListener("mouseleave", handleWindowLeave);
    return () => {
      document.removeEventListener("mousemove", checkCursor);
      document.removeEventListener("mouseleave", handleWindowLeave);
    };
  }, [isHovered]);

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
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={goToProductDetail}
    >
      <div ref={shadowRef} className={styles.shadowLayer} />

      <div className={styles.cardClip}>
        <div className={styles.imageWrap}>
          <div className={styles.imageInner}>
            <div ref={zoomWrapRef} className={styles.imageZoomWrap}>
              <img src={content.image} alt={content.alt} />
            </div>
            <div className={styles.imageOverlay} />
          </div>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.nameBlock}>
            <p className={styles.modelNumber}>N9040B-526</p>
            <p className={styles.description}>
              UXA Signal Analyzer Multi-touch / 2 Hz to 26.5 GHz
            </p>
          </div>

          <div className={styles.summaryBlock}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryIcon}>
                <content.condition.icon size={16} />
              </span>
              <span className={styles.summaryLabel}>
                {content.condition.label}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryIcon}>
                <content.warranty.icon size={16} />
              </span>
              <span className={styles.summaryLabel}>
                {content.warranty.label}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.compareRow}>
          <button
            type="button"
            className={styles.compareButton}
            onClick={toggleCompare}
            aria-label={isComparing ? "Remove from compare" : "Add to compare"}
            aria-pressed={isComparing}
          >
            <span
              className={`${styles.checkbox} ${
                isComparing ? styles.checkboxChecked : ""
              }`}
            >
              {isComparing && <CheckIcon size={10} />}
            </span>
            Compare
          </button>
        </div>

        <div className={styles.priceBlock}>
          <div className={styles.promoBadge}>
            <span>from</span>
          </div>
          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>USD 66,634</span>
            <span className={styles.discount}>&minus;50%</span>
          </div>
        </div>
      </div>

      <button
        ref={bookmarkBtnRef}
        type="button"
        className={styles.bookmarkButton}
        onClick={toggleSave}
        aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isSaved}
      >
        <span ref={bookmarkCircleRef} className={styles.bookmarkCircle} />
        <span ref={bookmarkIconRef} className={styles.bookmarkIconWrap}>
          {isSaved ? <BookmarkIcon size={16} /> : <BookmarkOutlineIcon size={16} />}
        </span>
      </button>
    </div>
  );
}
