"use client";

import styles from "./VersionToggle.module.css";

export type VersionId = "v1" | "v2";

const VERSIONS: { id: VersionId; label: string }[] = [
  { id: "v1", label: "Version 1" },
  { id: "v2", label: "Version 2" },
];

export default function VersionToggle({
  activeId,
  onChange,
}: {
  activeId: VersionId;
  onChange: (id: VersionId) => void;
}) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="Select revision">
      {VERSIONS.map((version) => (
        <button
          key={version.id}
          type="button"
          role="tab"
          aria-selected={activeId === version.id}
          className={
            activeId === version.id ? styles.optionActive : styles.option
          }
          onClick={() => onChange(version.id)}
        >
          {version.label}
        </button>
      ))}
    </div>
  );
}
