"use client";

import styles from "./ProductCardMobileQuickActions.module.css";
import { goToProductDetail } from "../../lib/product";
import {
  BadgeCheckIcon,
  CircleCheckIcon,
  ListCheckIcon,
  WavePulseIcon,
} from "../icons";
import QuickActionButtons, {
  QuickActionPlacement,
} from "../QuickActionButtons/QuickActionButtons";

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

// Version 4's "Mobile V1" tile: the mobile adaptation of the desktop V4
// tiles, per the Figma mobile frame — a fork of V3's "Mobile Compare Check
// Mark" landscape layout (photo left, name/price right, feature bar below)
// with that tile's inline Compare checkbox and its own Save button
// replaced by the shared Save + Compare floating buttons stacked top-left
// over the photo (see QuickActionButtons). Since this is a touch surface
// there's nothing to hover: the buttons are simply always visible, and at
// the slightly smaller 32px "mobile" size so more of the photo shows. Tap
// behaviour and animations are identical to the desktop tiles. Compare
// selection is still lifted to the page (app/page.tsx), so the bottom toast
// reports the same running total. V3's own mobile tile is untouched.
//
// "Mobile V2" is the same tile with a wider photo: a ~55/45 split (Figma:
// 200 of 361px to the photo) instead of half-and-half, and the buttons
// dropped to the 28px "compact" size so they still leave the photo room.
export type MobileQuickActionsLayout = "split-half" | "split-wide";

export default function ProductCardMobileQuickActions({
  variant = 0,
  isComparing = false,
  compareNumber,
  onToggleCompare,
  layout = "split-half",
  placement = "stack-top-left",
}: {
  variant?: number;
  isComparing?: boolean;
  compareNumber?: number;
  onToggleCompare?: () => void;
  layout?: MobileQuickActionsLayout;
  // the same four placements as the desktop tiles — V4's Mobile V1–V4 pair
  // them with the layouts: top corners + stack top-left on the even split,
  // stack bottom-left + bottom corners on the wide photo
  placement?: QuickActionPlacement;
}) {
  const content = VARIANTS[variant % VARIANTS.length];
  const wide = layout === "split-wide";

  return (
    <div className={styles.card} onClick={goToProductDetail}>
      <div className={styles.cardClip}>
        <div className={styles.topRow}>
          <div
            className={`${styles.imageCol} ${wide ? styles.imageColWide : ""}`}
          >
            <div className={styles.imageWrap}>
              <div className={styles.imageInner}>
                <img src={content.image} alt={content.alt} />
                <div className={styles.imageOverlay} />
              </div>
            </div>

            <QuickActionButtons
              revealOnHover={false}
              size={wide ? "compact" : "mobile"}
              placement={placement}
              isComparing={isComparing}
              compareNumber={compareNumber}
              onToggleCompare={onToggleCompare}
            />
          </div>

          <div
            className={`${styles.infoCol} ${wide ? styles.infoColWide : ""}`}
          >
            <div className={styles.infoBlock}>
              <div className={styles.nameBlock}>
                <p className={styles.modelNumber}>N9040B-526</p>
                <p className={styles.description}>
                  UXA Signal Analyzer Multi-touch / 2 Hz to 26.5 GHz
                </p>
              </div>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.fromLabel}>From</span>
              <div className={styles.priceRow}>
                {/* Mobile V2 doubles as the long-price stress test */}
                <span className={styles.currentPrice}>
                  {wide ? "KRW 204,175,000" : "USD 66,634"}
                </span>
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
