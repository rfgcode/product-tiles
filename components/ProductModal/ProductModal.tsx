"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./ProductModal.module.css";
import {
  GearIcon,
  InfoIcon,
  ListCheckIcon,
  PenToSquareIcon,
  PlugIcon,
  SlidersSimpleIcon,
  XmarkIcon,
} from "../icons";

const installedOptions = [
  { code: "526", desc: "Frequency Range, 2 Hz to 26.5 GHz" },
  { code: "526", desc: "Frequency Range, 2 Hz to 26.5 GHz" },
  { code: "526", desc: "Frequency Range, 2 Hz to 26.5 GHz" },
  { code: "526", desc: "Frequency Range, 2 Hz to 26.5 GHz" },
];

export default function ProductModal({ onClose }: { onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(backdropRef.current, { opacity: 1, duration: 0.25, ease: "power2.out" });
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" });
    gsap.to(panelRef.current, {
      opacity: 0,
      y: 16,
      scale: 0.97,
      duration: 0.22,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div ref={panelRef} className={styles.panel}>
        <button className={styles.closeButton} onClick={close} aria-label="Close">
          <XmarkIcon size={16} />
        </button>

        <div className={styles.header}>
          <img
            className={styles.headerImage}
            src="/images/product-modal.png"
            alt="Keysight MSOX2024A"
          />
          <div className={styles.headerText}>
            <div className={styles.title}>
              <h2>Keysight MSOX2024A</h2>
              <p>Mixed Signal Oscilloscope / 200 MHz / 4 Analog + 8 Digital Channels</p>
              <p className={styles.price}>$2,797.50</p>
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.buttonPrimary}>
                Request quote
              </button>
              <button type="button" className={styles.buttonSecondary}>
                Details
              </button>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.topics}>
            <div className={`${styles.topic} ${styles.topicActive}`}>
              <span className={styles.topicIcon}>
                <SlidersSimpleIcon size={16} />
              </span>
              Instrument Options
            </div>
            <div className={styles.topic}>
              <span className={styles.topicIcon}>
                <GearIcon size={18} />
              </span>
              Services
            </div>
            <div className={styles.topic}>
              <span className={styles.topicIcon}>
                <PenToSquareIcon size={16} />
              </span>
              Product Specifications
            </div>
            <div className={styles.topic}>
              <span className={styles.topicIcon}>
                <PlugIcon size={16} />
              </span>
              Accessories
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.sectionHeading}>
              <span className="icon">
                <ListCheckIcon size={18} />
              </span>
              <p>Installed Options</p>
            </div>
            <div className={styles.separator} />
            <div className={styles.optionsList}>
              {installedOptions.map((opt, i) => (
                <div className={styles.optionRow} key={i}>
                  <span className={styles.optionCode}>{opt.code}</span>
                  <span className={styles.optionDesc}>{opt.desc}</span>
                </div>
              ))}
            </div>

            <div className={styles.addableRow}>
              <span className={styles.topicIcon}>
                <ListCheckIcon size={18} />
              </span>
              <p>Addable Options</p>
            </div>
            <div className={styles.separator} style={{ marginTop: 16 }} />
            <div className={styles.noteRow}>
              <InfoIcon size={14} />
              <p>Adding options may impact shipping times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
