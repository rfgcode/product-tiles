"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardGalleryClick.module.css";
import { goToProductDetail } from "../../lib/product";
import {
  BadgeCheckIcon,
  CartCirclePlusIcon,
  CircleCheckIcon,
  InfoIcon,
  ListCheckIcon,
  WavePulseIcon,
} from "../icons";

// Refurbished gets its own dedicated front/rear photo pair; the other
// conditions keep the original V1 Desktop Basic hover-swap pair. The swap
// is click-driven here and toggles back and forth indefinitely instead of
// being tied to hover.
const REFURBISHED_GALLERY_IMAGES = [
  { src: "/images/product-refurbished-front-opt.jpg", alt: "UXA Signal Analyzer, front view" },
  { src: "/images/product-refurbished-rear-opt.jpg", alt: "UXA Signal Analyzer, rear view" },
];

const DEFAULT_GALLERY_IMAGES = [
  { src: "/images/product-default-opt.jpg", alt: "UXA Signal Analyzer, front view" },
  { src: "/images/product-hover-opt.jpg", alt: "UXA Signal Analyzer, rear view" },
];

// Condition/warranty content mirrored from ProductCardStatic (Desktop
// Basic) so the two tiles match exactly outside of the image behavior.
const VARIANTS = [
  {
    condition: { icon: ListCheckIcon, label: "Refurbished, like-new" },
    warranty: { icon: BadgeCheckIcon, label: "3y warranty" },
    images: REFURBISHED_GALLERY_IMAGES,
  },
  {
    condition: { icon: WavePulseIcon, label: "Used & Calibrated" },
    warranty: { icon: BadgeCheckIcon, label: "90d warranty" },
    images: DEFAULT_GALLERY_IMAGES,
  },
  {
    condition: { icon: CircleCheckIcon, label: "Used & Tested" },
    warranty: { icon: BadgeCheckIcon, label: "90d warranty" },
    images: DEFAULT_GALLERY_IMAGES,
  },
];

export default function ProductCardGalleryClick({
  variant = 0,
  onOpenDetails,
}: {
  variant?: number;
  onOpenDetails: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const shadowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const content = VARIANTS[variant % VARIANTS.length];
  const galleryImages = content.images;

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

  // instant switch between the two slides — no crossfade
  useEffect(() => {
    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      gsap.set(img, { opacity: i === activeImage ? 1 : 0 });
    });
  }, [activeImage]);

  // clicking the image toggles between the two photos, looping forever;
  // it never bubbles up to the card-level "open details" click
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % galleryImages.length);
  };

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
      onClick={goToProductDetail}
    >
      <div ref={shadowRef} className={styles.shadowLayer} />

      <div className={styles.cardClip}>
        <div className={styles.imageWrap}>
          <div className={styles.imageInner} onClick={handleImageClick}>
            <div ref={zoomWrapRef} className={styles.imageZoomWrap}>
              {galleryImages.map((image, i) => (
                <img
                  key={image.src}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className={`${styles.galleryImage} ${
                    i === 0 ? styles.galleryImageActive : ""
                  }`}
                  src={image.src}
                  alt={image.alt}
                />
              ))}
            </div>
            <div className={styles.imageOverlay} />
            <div
              className={`${styles.galleryDots} ${
                isHovered ? styles.galleryDotsVisible : ""
              }`}
            >
              {galleryImages.map((image, i) => (
                <span
                  key={image.src}
                  className={`${styles.galleryDot} ${
                    i === activeImage ? styles.galleryDotActive : ""
                  }`}
                />
              ))}
            </div>
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
