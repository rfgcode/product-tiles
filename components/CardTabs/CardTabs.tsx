"use client";

import styles from "./CardTabs.module.css";
import { ChevronIcon } from "../icons";

export type TabDef = {
  id: string;
  label: string;
};

export default function CardTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: TabDef[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className={styles.selectWrap}>
      <select
        className={styles.select}
        value={activeId}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select card variant"
      >
        {tabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.label}
          </option>
        ))}
      </select>
      <span className={styles.chevron}>
        <ChevronIcon size={12} />
      </span>
    </div>
  );
}
