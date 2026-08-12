"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardStatic.module.css";
import {
  BadgeCheckIcon,
  CartCirclePlusIcon,
  CircleCheckIcon,
  InfoIcon,
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
    warranty: { icon: BadgeCheckIcon, label: "Like-new warranty" },
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: { icon: WavePulseIcon, label: "Used & Calibrated" },
    warranty: { icon: BadgeCheckIcon, label: "Like-new warranty" },
  },
  {
    image: SECONDARY_IMAGE,
    alt: SECONDARY_IMAGE_ALT,
    condition: { icon: CircleCheckIcon, label: "Used & Tested" },
    warranty: { icon: BadgeCheckIcon, label: "Like-new warranty" },
  },
];

export default function ProductCardStatic({
  variant = 0,
  onOpenDetails,
}: {
  variant?: number;
  onOpenDetails: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const shadowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);

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

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetails();
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          <button
            type="button"
            className={`${styles.infoButton} ${
              isHovered ? styles.overlayButtonVisible : ""
            }`}
            onClick={handleInfoClick}
            aria-label="Product details"
          >
            <InfoIcon size={16} />
          </button>
          <button
            type="button"
            className={`${styles.cartButton} ${
              isHovered ? styles.overlayButtonVisible : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            aria-label="Add to cart"
          >
            <CartCirclePlusIcon size={25} />
          </button>
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
