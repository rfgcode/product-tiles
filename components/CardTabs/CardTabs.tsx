"use client";

import styles from "./CardTabs.module.css";

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
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={`${styles.tab} ${tab.id === activeId ? styles.tabActive : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
