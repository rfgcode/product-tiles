"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardCompareSave.module.css";
import { goToProductDetail } from "../../lib/product";
import {
  BadgeCheckIcon,
  CircleCheckIcon,
  CompareIcon,
  CompareRemoveIcon,
  ListCheckIcon,
  SaveFilledIcon,
  SaveIcon,
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

// Version 3's "Desktop Compare & Save" tile: originally a fork of the
// now-retired "Desktop Simplified" tile, this swaps the hover info/cart
// buttons for a static action bar above the price — Compare (multi-select
// toward a future compare page, not built here) and Save (bookmark toggle).
// V1 and V2 are untouched.
//
// Compare selection is lifted up to the page (see app/page.tsx): several
// tiles need to agree on selection order (to number themselves 1, 2, 3…) and
// on the total count (to drive the "Compare X models" toast), so a single
// tile can't own that state itself.
export default function ProductCardCompareSave({
  variant = 0,
  isComparing = false,
  compareNumber,
  onToggleCompare,
}: {
  variant?: number;
  isComparing?: boolean;
  compareNumber?: number;
  onToggleCompare?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const shadowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const saveIconRef = useRef<HTMLSpanElement>(null);

  const content = VARIANTS[variant % VARIANTS.length];

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
    setIsSaved((prev) => !prev);
    gsap.fromTo(
      saveIconRef.current,
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

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={isComparing ? styles.compareButtonActive : styles.actionButton}
            onClick={toggleCompare}
            aria-label={
              isComparing ? "Remove from compare" : "Add to compare"
            }
            aria-pressed={isComparing}
          >
            {isComparing ? (
              <span className={styles.compareBadge}>
                <span className={styles.compareBadgeNumber}>
                  {compareNumber}
                </span>
                <span className={styles.compareBadgeRemove} aria-hidden="true">
                  <CompareRemoveIcon size={11} />
                </span>
              </span>
            ) : (
              <span className={styles.actionIcon}>
                <CompareIcon size={12} />
              </span>
            )}
            Compare
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${
              isSaved ? styles.actionButtonActive : ""
            }`}
            onClick={toggleSave}
            aria-label={isSaved ? "Remove from saved" : "Save"}
            aria-pressed={isSaved}
          >
            <span ref={saveIconRef} className={styles.actionIcon}>
              {isSaved ? <SaveFilledIcon size={12} /> : <SaveIcon size={12} />}
            </span>
            {isSaved ? "Saved" : "Save"}
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
    </div>
  );
}
