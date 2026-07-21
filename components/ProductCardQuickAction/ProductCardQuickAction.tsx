"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ProductCardQuickAction.module.css";
import {
  BadgeCheckIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  CartCirclePlusIcon,
  ChevronIcon,
  ListCheckIcon,
  PlugCircleCheckIcon,
  SquareSlidersIcon,
} from "../icons";

// Four distinct product photos (front, front panel, rear, side) — one real
// photo per slide. No per-image scale here: the shared hover zoom on
// .imageZoomWrap (below) is the only zoom, so it matches the other cards
// exactly instead of compounding into a much larger zoom.
const GALLERY_IMAGES = [
  { src: "/images/gallery/gallery-front.jpg", alt: "UXA Signal Analyzer, front view" },
  { src: "/images/gallery/gallery-front-panel.jpg", alt: "UXA Signal Analyzer, front panel" },
  { src: "/images/gallery/gallery-back.jpg", alt: "UXA Signal Analyzer, rear view" },
  { src: "/images/gallery/gallery-side.jpg", alt: "UXA Signal Analyzer, side view" },
];

export default function ProductCardQuickAction() {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [renderPopover, setRenderPopover] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const shadowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkIconRef = useRef<HTMLSpanElement>(null);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const showChrome = isHovered || isExpanded;

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
    // safety net: fast cursor movement can leave the button's own
    // mouseenter/mouseleave pair out of sync, so force the pill and the
    // cart button hidden the moment the cursor is confirmed off the card
    // entirely — without this, a quick pass across the tile can leave the
    // cart button's own fade-out tween stranded mid-flight (or overwritten
    // by a stale one) and it sticks around alongside the other, correctly
    // reset hover elements
    if (!isHovered) {
      gsap.killTweensOf(pillRef.current);
      gsap.set(pillRef.current, { opacity: 0 });
      gsap.killTweensOf(cartBtnRef.current);
      gsap.set(cartBtnRef.current, { opacity: 0, pointerEvents: "none" });
    }
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
      if (!inside) {
        setIsHovered(false);
        setIsImageHovered(false);
        setActiveImage(0);
      }
    };
    const handleWindowLeave = () => {
      setIsHovered(false);
      setIsImageHovered(false);
      setActiveImage(0);
    };
    document.addEventListener("mousemove", checkCursor);
    document.addEventListener("mouseleave", handleWindowLeave);
    return () => {
      document.removeEventListener("mousemove", checkCursor);
      document.removeEventListener("mouseleave", handleWindowLeave);
    };
  }, [isHovered]);

  // default hover state for the whole card: a slight, smooth zoom on the
  // product image. Hovering the image itself layers gallery scrubbing on top.
  useEffect(() => {
    gsap.to(zoomWrapRef.current, {
      scale: isHovered ? 1.06 : 1,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isHovered]);

  // gallery scrub: cursor position over the image maps to a quadrant (25%
  // each) which picks the visible slide
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    const index = Math.min(
      GALLERY_IMAGES.length - 1,
      Math.max(0, Math.floor(fraction * GALLERY_IMAGES.length))
    );
    setActiveImage(index);
  };

  // leaving the image (but staying on the card) resets to the first slide
  // and hides the dots; the zoom itself only resets when the mouse leaves
  // the card entirely
  const handleImageMouseLeave = () => {
    setActiveImage(0);
    setIsImageHovered(false);
  };

  // instant switch between slides — no crossfade, which flickered as the
  // cursor crossed quadrant boundaries
  useEffect(() => {
    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      gsap.set(img, { opacity: i === activeImage ? 1 : 0 });
    });
  }, [activeImage]);

  // bookmark + add-to-cart reveal (fade only, no growing) — same pattern as
  // the quote card's icon reveal
  useEffect(() => {
    // a bookmarked item stays visible even once the mouse leaves
    const bookmarkVisible = showChrome || isBookmarked;
    gsap.to(bookmarkBtnRef.current, {
      opacity: bookmarkVisible ? 1 : 0,
      duration: bookmarkVisible ? 0.28 : 0.16,
      ease: "power2.out",
      pointerEvents: bookmarkVisible ? "auto" : "none",
    });
    gsap.to(cartBtnRef.current, {
      opacity: showChrome ? 1 : 0,
      duration: showChrome ? 0.28 : 0.16,
      ease: "power2.out",
      pointerEvents: showChrome ? "auto" : "none",
    });
  }, [showChrome, isBookmarked]);

  // bottom bar hover pill (disabled once expanded, popover takes over)
  const handleBottomEnter = () => {
    if (isExpanded) return;
    gsap.to(pillRef.current, { opacity: 1, duration: 0.22, ease: "power2.out" });
  };
  const handleBottomLeave = () => {
    if (isExpanded) return;
    gsap.to(pillRef.current, { opacity: 0, duration: 0.18, ease: "power2.in" });
  };

  // expand / collapse popover: the underlying chevron and hover pill are
  // immediately covered by the popover overlay, so neither is worth animating
  useEffect(() => {
    if (isExpanded) {
      setRenderPopover(true);
      return;
    }

    if (renderPopover && popoverRef.current) {
      gsap.to(popoverRef.current, {
        opacity: 0,
        y: 10,
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setRenderPopover(false),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && popoverRef.current) {
      gsap.fromTo(
        popoverRef.current,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: "back.out(1.6)" }
      );
    }
  }, [renderPopover, isExpanded]);

  // collapse popover on any click, anywhere, plus escape
  useEffect(() => {
    if (!isExpanded) return;
    const onDocClick = () => setIsExpanded(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isExpanded]);

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
    <div
      ref={cardRef}
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsImageHovered(false);
        setActiveImage(0);
      }}
    >
      <div ref={shadowRef} className={styles.shadowLayer} />

      <div className={styles.cardClip}>
        <div className={styles.imageWrap}>
          <div className={styles.imageInner}>
            <div
              ref={zoomWrapRef}
              className={styles.imageZoomWrap}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
            >
              {GALLERY_IMAGES.map((image, i) => (
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
              <div className={styles.imageOverlay} />
            </div>
            <div
              className={`${styles.galleryDots} ${
                isImageHovered ? styles.galleryDotsVisible : ""
              }`}
            >
              {GALLERY_IMAGES.map((image, i) => (
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
            ref={cartBtnRef}
            type="button"
            className={styles.cartButton}
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
          <button
            type="button"
            className={styles.featureBarButton}
            onMouseEnter={handleBottomEnter}
            onMouseLeave={handleBottomLeave}
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
          >
            <div ref={pillRef} className={styles.featurePill} />
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>
                  <ListCheckIcon size={16} />
                </span>
                <span className={styles.featureLabel}>Refurbished</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>
                  <BadgeCheckIcon size={16} />
                </span>
                <span className={styles.featureLabel}>3Y Warranty</span>
              </div>
            </div>
            <span className={styles.chevron}>
              <ChevronIcon size={12} />
            </span>
          </button>

          {renderPopover && (
            <div
              ref={popoverRef}
              className={styles.popover}
              onMouseLeave={() => setIsExpanded(false)}
            >
              <div className={styles.popoverList}>
                <div className={styles.popoverRow}>
                  <span className={styles.popoverIcon}>
                    <ListCheckIcon size={16} />
                  </span>
                  <p className={styles.popoverLabel}>Refurbished, like-new</p>
                </div>
                <div className={styles.popoverRow}>
                  <span className={styles.popoverIcon}>
                    <BadgeCheckIcon size={16} />
                  </span>
                  <p className={styles.popoverLabel}>Like-new warranty</p>
                </div>
                <div className={styles.popoverRow}>
                  <span className={styles.popoverIcon}>
                    <PlugCircleCheckIcon size={18} />
                  </span>
                  <p className={styles.popoverLabel}>Accessories included</p>
                </div>
                <div className={styles.popoverRow}>
                  <span className={styles.popoverIcon}>
                    <SquareSlidersIcon size={16} />
                  </span>
                  <p className={styles.popoverLabel}>Customizable</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.popoverChevron}
                onClick={() => setIsExpanded(false)}
                aria-label="Close (also closes on click or mouse-out)"
              >
                <ChevronIcon size={12} style={{ transform: "rotate(180deg)" }} />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        ref={bookmarkBtnRef}
        type="button"
        className={`${styles.iconButton} ${styles.iconButtonBookmark}`}
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
