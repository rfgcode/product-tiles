"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardCompareCheck.module.css";
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

export type { QuickActionPlacement } from "../QuickActionButtons/QuickActionButtons";

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

// Version 4's desktop tile (formerly V3's "Desktop Compare Check Mark",
// whose checkbox + "Compare" row above the price is gone): the photo, name,
// condition/warranty and price, with the shared Save + Compare floating
// buttons over the photo (see QuickActionButtons for everything they do).
// One tile, four placements — Desktop V1 (top corners), V2 (stacked
// top-left), V3 (stacked bottom-left), V4 (bottom corners). This component
// owns only the card itself: its hover state (border, shadow, the subtle
// photo zoom) and handing that hover to the buttons, which reveal on it.
// V1, V2, and V3 (the app versions) are untouched.
export default function ProductCardCompareCheck({
  variant = 0,
  isComparing = false,
  compareNumber,
  onToggleCompare,
  placement = "corners",
}: {
  variant?: number;
  isComparing?: boolean;
  compareNumber?: number;
  onToggleCompare?: () => void;
  placement?: QuickActionPlacement;
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

      <QuickActionButtons
        isHovered={isHovered}
        placement={placement}
        isComparing={isComparing}
        compareNumber={compareNumber}
        onToggleCompare={onToggleCompare}
      />
    </div>
  );
}
