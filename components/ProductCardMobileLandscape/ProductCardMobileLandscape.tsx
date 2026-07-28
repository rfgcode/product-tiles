"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardMobileLandscape.module.css";
import {
  BadgeCheckIcon,
  ChevronIcon,
  CircleInfoIcon,
  ListCheckIcon,
  PlugCircleCheckIcon,
  SquareSlidersIcon,
  XmarkIcon,
} from "../icons";

const ACCORDION_SECTIONS = [
  "Instrument Options",
  "Services",
  "Product Specifications",
  "Equipment Standard",
  "Accessories",
];

// Placeholder rows shown inside whichever accordion section is open — real
// per-section content isn't modeled yet, so every section reuses the same
// sample "Installed Options" list from the Figma spec.
const SAMPLE_OPTION_ROWS = [
  { code: "526", label: "Frequency Range, 2 Hz to 26.5 GHz" },
  { code: "526", label: "Frequency Range, 2 Hz to 26.5 GHz" },
  { code: "526", label: "Frequency Range, 2 Hz to 26.5 GHz" },
];

export default function ProductCardMobileLandscape({
  showPremiumBadge = false,
}: {
  showPremiumBadge?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderPanel, setRenderPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [renderQuickView, setRenderQuickView] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const accordionContentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevOpenSectionRef = useRef<string | null>(null);

  // the card lifts with a drop shadow while the details panel is open
  useEffect(() => {
    gsap.to(shadowRef.current, {
      opacity: isExpanded ? 1 : 0,
      duration: 0.28,
      ease: "power2.out",
    });
  }, [isExpanded]);

  // mount immediately on open; on close, animate out first, then unmount
  useEffect(() => {
    if (isExpanded) {
      setRenderPanel(true);
      return;
    }
    if (renderPanel && panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setRenderPanel(false),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.34, ease: "back.out(1.6)" }
      );
    }
  }, [renderPanel, isExpanded]);

  // tapping anywhere outside the panel collapses it
  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isExpanded]);

  // quick view modal: mount immediately on open; on close, animate out
  // first, then unmount — same pattern as the inline details panel above
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

  // only one section open at a time: opening one slides the previously
  // open section shut so the sheet stays compact.
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
      <div ref={shadowRef} className={styles.shadowLayer} />

      <div className={styles.cardClip}>
        <div className={styles.topRow}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <div className={styles.imageInner}>
                <img
                  src="/images/product-default-opt.jpg"
                  alt="UXA Signal Analyzer, front view"
                />
                <div className={styles.imageOverlay} />
                {showPremiumBadge && (
                  <img
                    className={styles.premiumBadge}
                    src="/images/keysight-premium-used-badge.svg"
                    alt="Keysight Premium Used"
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              className={styles.quickViewButton}
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
          <button
            type="button"
            className={styles.featureBarButton}
            onClick={() => setIsExpanded(true)}
            aria-expanded={isExpanded}
          >
            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                <ListCheckIcon size={16} />
              </span>
              <span className={styles.featureLabel}>Refurbished</span>
            </div>
            <span className={styles.chevron}>
              <ChevronIcon size={12} />
            </span>
          </button>
        </div>

        {renderPanel && (
          <div
            ref={panelRef}
            className={styles.panel}
            onClick={() => setIsExpanded(false)}
          >
            <button
              type="button"
              className={styles.panelClose}
              onClick={() => setIsExpanded(false)}
              aria-label="Collapse details"
            >
              <ChevronIcon size={12} style={{ transform: "rotate(180deg)" }} />
            </button>

            <div className={styles.panelRow}>
              <span className={styles.panelIcon}>
                <ListCheckIcon size={16} />
              </span>
              <p className={styles.panelLabel}>Refurbished, like-new</p>
            </div>
            <div className={styles.panelRow}>
              <span className={styles.panelIcon}>
                <BadgeCheckIcon size={16} />
              </span>
              <p className={styles.panelLabel}>Like-new warranty</p>
            </div>
            <div className={styles.panelRow}>
              <span className={styles.panelIcon}>
                <PlugCircleCheckIcon size={18} />
              </span>
              <p className={styles.panelLabel}>Accessories included</p>
            </div>
            <div className={styles.panelRow}>
              <span className={styles.panelIcon}>
                <SquareSlidersIcon size={16} />
              </span>
              <p className={styles.panelLabel}>Customizable</p>
            </div>
          </div>
        )}
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
                src="/images/product-default-opt.jpg"
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
