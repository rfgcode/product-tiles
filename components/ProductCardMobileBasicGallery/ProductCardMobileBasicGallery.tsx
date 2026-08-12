"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardMobileBasicGallery.module.css";
import {
  BadgeCheckIcon,
  ChevronIcon,
  CircleCheckIcon,
  CircleInfoIcon,
  ListCheckIcon,
  WavePulseIcon,
  XmarkIcon,
} from "../icons";

// Refurbished gets its own dedicated front/rear photo pair; the other
// conditions keep the original Desktop Gallery click-to-toggle pair.
const REFURBISHED_GALLERY_IMAGES = [
  { src: "/images/product-refurbished-front-opt.jpg", alt: "UXA Signal Analyzer, front view" },
  { src: "/images/product-refurbished-rear-opt.jpg", alt: "UXA Signal Analyzer, rear view" },
];

const DEFAULT_GALLERY_IMAGES = [
  { src: "/images/product-default-opt.jpg", alt: "UXA Signal Analyzer, front view" },
  { src: "/images/product-hover-opt.jpg", alt: "UXA Signal Analyzer, rear view" },
];

// Condition alternates the same way as the other Basic/Gallery tiles (see
// ProductCardStatic); warranty stays constant, matching that pattern.
const VARIANTS = [
  {
    condition: { icon: ListCheckIcon, label: "Refurbished" },
    images: REFURBISHED_GALLERY_IMAGES,
  },
  {
    condition: { icon: WavePulseIcon, label: "Calibrated" },
    images: DEFAULT_GALLERY_IMAGES,
  },
  {
    condition: { icon: CircleCheckIcon, label: "Tested" },
    images: DEFAULT_GALLERY_IMAGES,
  },
];

// Same quick-view sheet as the V1 mobile variants (ProductCardMobileQuickView,
// ProductCardMobileLandscape) — the info button opens this instead of the
// shared desktop ProductModal.
const ACCORDION_SECTIONS = [
  "Instrument Options",
  "Services",
  "Product Specifications",
  "Equipment Standard",
  "Accessories",
];

const SAMPLE_OPTION_ROWS = [
  { code: "526", label: "Frequency Range, 2 Hz to 26.5 GHz" },
  { code: "526", label: "Frequency Range, 2 Hz to 26.5 GHz" },
  { code: "526", label: "Frequency Range, 2 Hz to 26.5 GHz" },
];

export default function ProductCardMobileBasicGallery({
  variant = 0,
}: {
  variant?: number;
}) {
  const [activeImage, setActiveImage] = useState(0);

  const content = VARIANTS[variant % VARIANTS.length];
  const galleryImages = content.images;

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [renderQuickView, setRenderQuickView] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const accordionContentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevOpenSectionRef = useRef<string | null>(null);

  // tapping the image advances to the next photo, looping forever; it
  // never bubbles up to the info/cart affordances
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % galleryImages.length);
  };

  // quick view modal: mount immediately on open; on close, animate out
  // first, then unmount
  useEffect(() => {
    if (isQuickViewOpen) {
      setRenderQuickView(true);
      return;
    }
    if (renderQuickView && overlayRef.current && sheetRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" });
      gsap.to(sheetRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => setRenderQuickView(false),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuickViewOpen]);

  useEffect(() => {
    if (isQuickViewOpen && renderQuickView && overlayRef.current && sheetRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(
        sheetRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.34, ease: "back.out(1.6)" }
      );
    }
  }, [renderQuickView, isQuickViewOpen]);

  // Escape closes the quick view modal, same as the desktop product modal
  useEffect(() => {
    if (!isQuickViewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsQuickViewOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isQuickViewOpen]);

  // only one accordion section open at a time: opening one slides the
  // previously open section shut so the sheet stays compact
  useEffect(() => {
    const prev = prevOpenSectionRef.current;
    if (prev && prev !== openSection) {
      const prevEl = accordionContentRefs.current[prev];
      if (prevEl) {
        gsap.to(prevEl, { height: 0, duration: 0.28, ease: "power2.inOut" });
      }
    }
    if (openSection) {
      const el = accordionContentRefs.current[openSection];
      if (el) {
        const targetHeight = el.scrollHeight;
        gsap.fromTo(
          el,
          { height: 0 },
          {
            height: targetHeight,
            duration: 0.28,
            ease: "power2.inOut",
            onComplete: () => gsap.set(el, { height: "auto" }),
          }
        );
      }
    }
    prevOpenSectionRef.current = openSection;
  }, [openSection]);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardClip}>
        <div className={styles.topRow}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <div className={styles.imageInner} onClick={handleImageClick}>
                {galleryImages.map((image, i) => (
                  <img
                    key={image.src}
                    className={`${styles.galleryImage} ${
                      i === activeImage ? styles.galleryImageActive : ""
                    }`}
                    src={image.src}
                    alt={image.alt}
                  />
                ))}
                <div className={styles.imageOverlay} />
                <div className={styles.galleryDots}>
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
            </div>
            <button
              type="button"
              className={styles.infoButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              aria-label="View product details"
            >
              <CircleInfoIcon size={16} />
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
              <span className={styles.featureLabel}>90d warranty</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.cartButton}
            onClick={(e) => e.stopPropagation()}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {renderQuickView && (
        <div
          ref={overlayRef}
          className={styles.quickViewOverlay}
          onClick={() => setIsQuickViewOpen(false)}
        >
          <div
            ref={sheetRef}
            className={styles.quickViewSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.quickViewCloseButton}
              onClick={() => setIsQuickViewOpen(false)}
              aria-label="Close quick view"
            >
              <XmarkIcon size={14} />
            </button>

            <div className={styles.quickViewSummary}>
              <img
                className={styles.quickViewThumb}
                src={galleryImages[activeImage].src}
                alt="N9040B-526"
              />
              <div className={styles.quickViewSummaryInfo}>
                <p className={styles.quickViewModel}>N9040B-526</p>
                <p className={styles.quickViewPrice}>USD 66,634</p>
                <div className={styles.quickViewActions}>
                  <button type="button" className={styles.quickViewQuoteButton}>
                    Request quote
                  </button>
                  <button type="button" className={styles.quickViewDetailsButton}>
                    Details
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.quickViewAccordionList}>
              {ACCORDION_SECTIONS.map((section) => {
                const isOpen = openSection === section;
                return (
                  <div key={section} className={styles.quickViewAccordion}>
                    <button
                      type="button"
                      className={styles.quickViewAccordionHeader}
                      onClick={() => toggleSection(section)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.quickViewAccordionTitle}>
                        {section}
                      </span>
                      <ChevronIcon
                        size={14}
                        style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
                      />
                    </button>
                    <div
                      ref={(el) => {
                        accordionContentRefs.current[section] = el;
                      }}
                      className={styles.quickViewAccordionContent}
                      style={{ height: 0 }}
                    >
                      <div className={styles.quickViewAccordionContentInner}>
                        <div className={styles.quickViewAccordionContentHeader}>
                          <ListCheckIcon size={16} />
                          <span>Installed Options</span>
                        </div>
                        {SAMPLE_OPTION_ROWS.map((row, i) => (
                          <div key={i} className={styles.quickViewOptionRow}>
                            <span className={styles.quickViewOptionCode}>
                              {row.code}
                            </span>
                            <span className={styles.quickViewOptionLabel}>
                              {row.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
