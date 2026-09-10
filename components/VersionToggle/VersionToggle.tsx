"use client";

import styles from "./VersionToggle.module.css";
import { ChevronIcon } from "../icons";

export type VersionId = "v1" | "v2" | "v3";

const VERSIONS: { id: VersionId; label: string }[] = [
  { id: "v1", label: "Version 1" },
  { id: "v2", label: "Version 2" },
  { id: "v3", label: "Version 3" },
];

export default function VersionToggle({
  activeId,
  onChange,
}: {
  activeId: VersionId;
  onChange: (id: VersionId) => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={activeId}
          onChange={(e) => onChange(e.target.value as VersionId)}
          aria-label="Select revision"
        >
          {VERSIONS.map((version) => (
            <option key={version.id} value={version.id}>
              {version.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>
          <ChevronIcon size={12} />
        </span>
      </div>
    </div>
  );
}
