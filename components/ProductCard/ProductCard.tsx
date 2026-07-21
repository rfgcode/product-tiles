"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCard.module.css";

export default function ProductCard() {
  const [isHovered, setIsHovered] = useState(false);

  const shadowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageFrontRef = useRef<HTMLImageElement>(null);
  const imageBackRef = useRef<HTMLImageElement>(null);

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

  // instant swap, no crossfade
  useEffect(() => {
    gsap.set(imageFrontRef.current, { opacity: isHovered ? 0 : 1 });
    gsap.set(imageBackRef.current, { opacity: isHovered ? 1 : 0 });
  }, [isHovered]);

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
            <img
              ref={imageFrontRef}
              src="/images/product-default-opt.jpg"
              alt="UXA Signal Analyzer, front view"
            />
            <img
              ref={imageBackRef}
              className={styles.imageBack}
              src="/images/product-hover-opt.jpg"
              alt="UXA Signal Analyzer, rear view"
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
          <div className={styles.options}>
            <ul>
              <li>14 GHz specified</li>
              <li>13 GHz typical</li>
              <li>Dynamic Range: 3.3 V peak-to-peak</li>
            </ul>
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

        <div className={styles.featureBar}>
          <div className={styles.features}>
            <span className={styles.feature}>Refurbished</span>
            <span className={styles.feature}>3Y Warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
