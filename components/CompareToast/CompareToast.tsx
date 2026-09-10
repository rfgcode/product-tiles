"use client";

import styles from "./CompareToast.module.css";
import { ChevronIcon } from "../icons";

// Bottom toast for V3's "Desktop Compare & Save" tile — appears once at
// least two tiles are selected for compare, and links out to the real
// Keysight compare page (this prototype doesn't build the compare page or
// modal itself, only the interaction bar that would launch it).
//
// Always mounted (rather than conditionally rendered) so `visible` can drive
// a slide/fade transition in both directions instead of popping in and out.
export default function CompareToast({
  visible,
  count,
  href,
}: {
  visible: boolean;
  count: number;
  href: string;
}) {
  return (
    <a
      href={href}
      className={`${styles.toast} ${visible ? styles.toastVisible : ""}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className={styles.message}>Compare {count} models</span>
      <span className={styles.arrow}>
        <ChevronIcon size={10} />
      </span>
    </a>
  );
}
