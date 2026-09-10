"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardMobileCompareCheck.module.css";
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

// Version 3's "Mobile Compare Check Mark" tile: a fork of "Mobile Compare &
// Save" (see ProductCardMobileCompareSave) with Compare swapped for the
// same plain checkbox used by the desktop "Desktop Compare Check Mark" tile
// (see ProductCardCompareCheck) — no numbered pill/badge, just a checked/
// unchecked red-filled box, in the same inline spot above the price that
// tile uses for its Compare button. Save is unchanged (floating icon button
// over the image). Compare selection is still lifted to the page
// (app/page.tsx), so the bottom toast reports the same running total as
// every other compare tile. V1 and V2 (the app version) are untouched.
export default function ProductCardMobileCompareCheck({
  variant = 0,
  isComparing = false,
  onToggleCompare,
}: {
  variant?: number;
  isComparing?: boolean;
  onToggleCompare?: () => void;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const bookmarkIconRef = useRef<HTMLSpanElement>(null);
  const content = VARIANTS[variant % VARIANTS.length];

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
    <div className={styles.card} onClick={goToProductDetail}>
      <div className={styles.cardClip}>
        <div className={styles.topRow}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <div className={styles.imageInner}>
                <img src={content.image} alt={content.alt} />
                <div className={styles.imageOverlay} />
              </div>
            </div>

            <button
              type="button"
              className={styles.bookmarkButton}
              onClick={toggleSave}
              aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
              aria-pressed={isSaved}
            >
              <span ref={bookmarkIconRef} style={{ display: "flex" }}>
                {isSaved ? <BookmarkIcon size={16} /> : <BookmarkOutlineIcon size={16} />}
              </span>
            </button>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.infoBlock}>
              <div className={styles.nameBlock}>
                <p className={styles.modelNumber}>N9040B-526</p>
                <p className={styles.description}>
                  UXA Signal Analyzer Multi-touch / 2 Hz to 26.5 GHz
                </p>
              </div>

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
              <span className={styles.fromLabel}>From</span>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>USD 66,634</span>
                <span className={styles.discount}>&minus;50%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.featureBar}>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                <content.condition.icon size={16} />
              </span>
              <span className={styles.featureLabel}>
                {content.condition.label}
              </span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                <content.warranty.icon size={16} />
              </span>
              <span className={styles.featureLabel}>
                {content.warranty.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
