"use client";

import styles from "./ProductCardMobileCompareSaveCta.module.css";
import { goToProductDetail } from "../../lib/product";
import {
  BadgeCheckIcon,
  CircleCheckIcon,
  CompareIcon,
  ListCheckIcon,
  WavePulseIcon,
} from "../icons";

const FRONT_IMAGE = "/images/product-refurbished-front-opt.jpg";
const FRONT_IMAGE_ALT = "UXA Signal Analyzer, front view";
const SECONDARY_IMAGE = "/images/gallery/gallery-front.jpg";
const SECONDARY_IMAGE_ALT = "Infiniium V-Series Oscilloscope, front view";

// Short labels, same as ProductCardMobileBasic uses
// — this feature bar has a pill button competing for the same row, so it
// can't afford the full desktop-style "Refurbished, like-new" text V2 uses.
const VARIANTS = [
  {
    image: FRONT_IMAGE,
    alt: FRONT_IMAGE_ALT,
    condition: { icon: ListCheckIcon, label: "Refurbished" },
    warranty: "3y warranty",
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: { icon: WavePulseIcon, label: "Calibrated" },
    warranty: "90d warranty",
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: { icon: CircleCheckIcon, label: "Tested" },
    warranty: "90d warranty",
  },
];

// Version 3's "Mobile Compare & Save + CTA" tile: the mobile equivalent of
// the desktop "Desktop Compare & Save + CTA" tab — Compare is kept exactly
// as "Mobile Compare & Save" has it (see ProductCardMobileCompareSave),
// inline above the price with the same lifted compareSelection state,
// numbered red pill, and no tile-growth on toggle. Save is dropped entirely
// (no floating bookmark over the image). The feature bar reuses the
// app-version V2's "Mobile Basic" layout — condition/
// warranty on the left, a red pill button on the right (see
// ProductCardMobileBasic's .cartButton) — except the button reads "Request
// quote" instead of "Add to Cart" and, like the rest of this prototype's
// CTAs, doesn't build the actual quote flow. No :hover rules — this is a
// touch surface. V1 and V2 (the app version) are untouched.
export default function ProductCardMobileCompareSaveCta({
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
  const content = VARIANTS[variant % VARIANTS.length];

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare?.();
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
                className={isComparing ? styles.compareButtonActive : styles.actionButton}
                onClick={toggleCompare}
                aria-label={isComparing ? "Remove from compare" : "Add to compare"}
                aria-pressed={isComparing}
              >
                {isComparing ? (
                  <span className={styles.compareBadge}>{compareNumber}</span>
                ) : (
                  <span className={styles.actionIcon}>
                    <CompareIcon size={12} />
                  </span>
                )}
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
                <BadgeCheckIcon size={16} />
              </span>
              <span className={styles.featureLabel}>{content.warranty}</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.ctaButton}
            onClick={(e) => e.stopPropagation()}
          >
            Request quote
          </button>
        </div>
      </div>
    </div>
  );
}
