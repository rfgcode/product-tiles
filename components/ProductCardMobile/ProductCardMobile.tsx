"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardMobile.module.css";
import { BookmarkIcon, BookmarkOutlineIcon, ListCheckIcon } from "../icons";

export default function ProductCardMobile() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkIconRef = useRef<HTMLSpanElement>(null);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next);
    gsap.to(bookmarkBtnRef.current, {
      backgroundColor: next ? "#e90029" : "#ffffff",
      color: next ? "#ffffff" : "#373a36",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.fromTo(
      bookmarkIconRef.current,
      { scale: 0.6, rotate: -8 },
      { scale: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" }
    );
  };

  return (
    <div className={styles.card}>
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
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <ListCheckIcon size={16} />
            </span>
            <span className={styles.featureLabel}>Refurbished</span>
          </div>
        </div>
      </div>

      <button
        ref={bookmarkBtnRef}
        type="button"
        className={styles.iconButton}
        onClick={toggleBookmark}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={isBookmarked}
      >
        <span ref={bookmarkIconRef} style={{ display: "flex" }}>
          {isBookmarked ? <BookmarkIcon size={16} /> : <BookmarkOutlineIcon size={16} />}
        </span>
      </button>
    </div>
  );
}
