"use client";

import styles from "./ProductCardMobilePortrait.module.css";

// Content mirrors the Desktop Basic tile (see ProductCardStatic) — same
// photos and the same condition/warranty copy, cycled the same way.
const FRONT_IMAGE = "/images/product-refurbished-front-opt.jpg";
const FRONT_IMAGE_ALT = "UXA Signal Analyzer, front view";
const SECONDARY_IMAGE = "/images/gallery/gallery-front.jpg";
const SECONDARY_IMAGE_ALT = "Infiniium V-Series Oscilloscope, front view";

const VARIANTS = [
  {
    image: FRONT_IMAGE,
    alt: FRONT_IMAGE_ALT,
    condition: "Refurbished, like-new",
    warranty: "3y warranty",
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: "Used & Calibrated",
    warranty: "90d warranty",
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: "Used & Tested",
    warranty: "90d warranty",
  },
];

export default function ProductCardMobilePortrait({
  variant = 0,
}: {
  variant?: number;
}) {
  const content = VARIANTS[variant % VARIANTS.length];

  return (
    <div className={styles.card}>
      <div className={styles.cardClip}>
        <div className={styles.imageWrap}>
          <div className={styles.imageInner}>
            <img src={content.image} alt={content.alt} />
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

          <ul className={styles.summaryList}>
            <li className={styles.summaryItem}>{content.condition}</li>
            <li className={styles.summaryItem}>{content.warranty}</li>
          </ul>
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
  );
}
