"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardMobileExpand.module.css";
import {
  BadgeCheckIcon,
  ChevronIcon,
  ListCheckIcon,
  PlugCircleCheckIcon,
  SquareSlidersIcon,
} from "../icons";

export default function ProductCardMobileExpand() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderPanel, setRenderPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.card}>
      <div ref={shadowRef} className={styles.shadowLayer} />

      <div className={styles.cardClip}>
        <div className={styles.imageWrap}>
          <div className={styles.imageInner}>
            <img
              src="/images/product-default-opt.jpg"
              alt="UXA Signal Analyzer, front view"
            />
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
        </div>

        <div className={styles.priceBlock}>
          <span className={styles.fromLabel}>From</span>
          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>USD 66,634</span>
            <span className={styles.discount}>&minus;50%</span>
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
          <div ref={panelRef} className={styles.panel}>
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
    </div>
  );
}
