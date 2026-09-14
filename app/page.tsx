"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ProductCard from "../components/ProductCard/ProductCard";
import ProductCardStatic from "../components/ProductCardStatic/ProductCardStatic";
import ProductCardCompareSave from "../components/ProductCardCompareSave/ProductCardCompareSave";
import ProductCardCompareCheck from "../components/ProductCardCompareCheck/ProductCardCompareCheck";
import ProductCardCompareSaveCta from "../components/ProductCardCompareSaveCta/ProductCardCompareSaveCta";
import ProductCardGallery from "../components/ProductCardGallery/ProductCardGallery";
import ProductCardGalleryClick from "../components/ProductCardGalleryClick/ProductCardGalleryClick";
import ProductCardQuote from "../components/ProductCardQuote/ProductCardQuote";
import ProductCardQuickAction from "../components/ProductCardQuickAction/ProductCardQuickAction";
import ProductCardMobile from "../components/ProductCardMobile/ProductCardMobile";
import ProductCardMobileExpand from "../components/ProductCardMobileExpand/ProductCardMobileExpand";
import ProductCardMobileGallery from "../components/ProductCardMobileGallery/ProductCardMobileGallery";
import ProductCardMobileGallerySwipe from "../components/ProductCardMobileGallerySwipe/ProductCardMobileGallerySwipe";
import ProductCardMobileQuickView from "../components/ProductCardMobileQuickView/ProductCardMobileQuickView";
import ProductCardMobileLandscape from "../components/ProductCardMobileLandscape/ProductCardMobileLandscape";
import ProductCardMobileBasic from "../components/ProductCardMobileBasic/ProductCardMobileBasic";
import ProductCardMobileCompareSave from "../components/ProductCardMobileCompareSave/ProductCardMobileCompareSave";
import ProductCardMobileCompareCheck from "../components/ProductCardMobileCompareCheck/ProductCardMobileCompareCheck";
import ProductCardMobileQuickActions from "../components/ProductCardMobileQuickActions/ProductCardMobileQuickActions";
import ProductCardMobileCompareSaveCta from "../components/ProductCardMobileCompareSaveCta/ProductCardMobileCompareSaveCta";
import ProductCardMobileBasicGallery from "../components/ProductCardMobileBasicGallery/ProductCardMobileBasicGallery";
import ProductCardMobilePortrait from "../components/ProductCardMobilePortrait/ProductCardMobilePortrait";
import ProductModal from "../components/ProductModal/ProductModal";
import CardTabs, { TabDef } from "../components/CardTabs/CardTabs";
import VersionToggle, {
  VersionId,
} from "../components/VersionToggle/VersionToggle";
import CompareToast from "../components/CompareToast/CompareToast";
import { COMPARE_URL } from "../lib/product";

// Add a new entry here (and a matching case in the render switch below) to
// grow past today's variants — the dropdown itself needs no changes.
const VERSION_1_TABS: TabDef[] = [
  { id: "default", label: "Desktop Basic" },
  { id: "gallery", label: "Desktop Gallery" },
  { id: "quote", label: "Desktop Quote" },
  { id: "quick-action", label: "Desktop Quick Action" },
  { id: "mobile", label: "Mobile Basic" },
  { id: "mobile-expand", label: "Mobile Expand" },
  { id: "mobile-gallery", label: "Mobile Gallery" },
  { id: "mobile-gallery-swipe", label: "Mobile Gallery Swipe" },
  { id: "mobile-quick-view", label: "Mobile Quick View" },
  { id: "mobile-landscape", label: "Mobile Landscape" },
];

// Version 2 is being rebuilt from scratch — only Desktop Basic is live for
// now. Add entries back here as each new design lands.
const VERSION_2_TABS: TabDef[] = [
  { id: "default", label: "Desktop Basic" },
  { id: "gallery", label: "Desktop Gallery" },
  { id: "mobile-basic", label: "Mobile Basic" },
  { id: "mobile-basic-gallery", label: "Mobile Gallery" },
  { id: "mobile-portrait", label: "Mobile Portrait" },
];

// Version 3 started as a clone of Version 2's tabs + tiles, giving it its
// own space to diverge from without disturbing V2. Desktop Gallery, Mobile
// Gallery, and Mobile Portrait were dropped, and (since removed) "Desktop
// Simplified" / "Mobile Simplified" tiles were duplicated out into the
// compare/save family below before being retired themselves:
// "Desktop Compare & Save" (a static Compare + Save action bar above the
// price — see ProductCardCompareSave), "Desktop Compare Check Mark"
// (Compare becomes a plain checkbox, Save moves to a floating top-right
// icon button like V1's Desktop Quick Action — see ProductCardCompareCheck),
// "Desktop Compare & Save + CTA" (identical Compare/Save, plus a full-width
// "Request quote" button below the price — see ProductCardCompareSaveCta;
// this tab renders only 3 tiles, one row, instead of the tripled grid the
// other tabs use — see the SINGLE_ROW_TABS check below), "Mobile Compare &
// Save" (Compare inline above the price, Save floating over the image —
// see ProductCardMobileCompareSave; an earlier "V1" layout with Compare in
// its own bordered row and this tab labeled "V2" was retired), "Mobile
// Compare Check Mark" (same layout with Compare swapped for the desktop
// check-mark tile's plain checkbox — see ProductCardMobileCompareCheck),
// and "Mobile Compare & Save + CTA" (same Compare, Save dropped entirely,
// and the app-version "Mobile Basic" feature bar reused with its Add to
// Cart pill relabeled "Request quote" — see
// ProductCardMobileCompareSaveCta). V1 and V2 (the app version, not these
// tiles' own retired V1/V2) keep their original Desktop Basic / Desktop
// Gallery / Mobile Basic / Mobile Gallery / Mobile Portrait tiles and
// labels.
const VERSION_3_TABS: TabDef[] = [
  { id: "compare-save", label: "Desktop Compare & Save" },
  { id: "compare-check", label: "Desktop Compare Check Mark" },
  { id: "compare-save-cta", label: "Desktop Compare & Save + CTA" },
  { id: "mobile-compare-save", label: "Mobile Compare & Save" },
  { id: "mobile-compare-check", label: "Mobile Compare Check Mark" },
  { id: "mobile-compare-save-cta", label: "Mobile Compare & Save + CTA" },
];

// Version 4 reuses V3's "Desktop Compare Check Mark" and "Mobile Compare
// Check Mark" tiles verbatim (same ids, so the render switch above needs no
// new cases) — just the two of them, relabeled as this version's only tabs.
const VERSION_4_TABS: TabDef[] = [
  { id: "compare-check", label: "Desktop V1" },
  // the same tile with its two floating buttons stacked bottom-left instead
  // (see ProductCardCompareCheck's placement prop)
  { id: "compare-check-stack-bottom", label: "Desktop V2" },
  // V1's corners, moved down to the bottom corners of the photo
  { id: "compare-check-corners-bottom", label: "Desktop V3" },
  // the mobile adaptation (see ProductCardMobileQuickActions): the same two
  // floating buttons over the photo of V3's mobile landscape layout, in the
  // same three placements as Desktop V1–V3 — V1 on the even split, V2/V3
  // with the photo widened to a ~55/45 split and the buttons dropped a
  // size to suit
  { id: "mobile-corners", label: "Mobile V1" },
  { id: "mobile-wide-stack-bottom", label: "Mobile V2" },
  { id: "mobile-wide-corners-bottom", label: "Mobile V3" },
];

const TABS_BY_VERSION: Record<VersionId, TabDef[]> = {
  v1: VERSION_1_TABS,
  v2: VERSION_2_TABS,
  v3: VERSION_3_TABS,
  v4: VERSION_4_TABS,
};

// mobile variants show a 2x2 grid (4 instances, 10px gap); desktop variants
// show a 3x2 grid (6 instances, a slightly larger gap) to make it easier to
// judge the tiles side by side
const MOBILE_TABS = new Set([
  "mobile",
  "mobile-expand",
  "mobile-gallery",
  "mobile-gallery-swipe",
  "mobile-quick-view",
  "mobile-portrait",
]);

// the landscape tail variant is as wide as two portrait tiles plus their
// gap, so it stacks four to a page in a single column instead of the 2x2
// grid the other mobile variants use
const STACKED_TABS = new Set([
  "mobile-landscape",
  "mobile-basic",
  "mobile-basic-gallery",
  "mobile-compare-save",
  "mobile-compare-check",
  "mobile-compare-save-cta",
  "mobile-corners",
  "mobile-wide-stack-bottom",
  "mobile-wide-corners-bottom",
]);

// every V3 tab (desktop or mobile) with a Compare/Save action — drives the
// bottom-of-page toast in the same way regardless of which tile renders it
const COMPARE_TABS = new Set([
  "compare-save",
  "compare-check",
  "compare-check-stack-bottom",
  "compare-check-corners-bottom",
  "compare-save-cta",
  "mobile-compare-save",
  "mobile-compare-check",
  "mobile-compare-save-cta",
  "mobile-corners",
  "mobile-wide-stack-bottom",
  "mobile-wide-corners-bottom",
]);

// reads ?version=v1|v2|v3|v4&tab=<id> off the URL so a link can deep-link
// straight to a specific version + tile variant; anything missing or malformed
// (a tab that doesn't exist under that version, say) falls back to v4 / its
// first tab.
// Tiles link out to a real external product page, and the tab picker writes
// its selection into the URL on every change (see handleTabChange /
// handleVersionChange below) — so if the user leaves via a tile and then hits
// the browser Back button, this is what restores the exact variant they were
// looking at instead of resetting to the default tab.
function readStateFromUrl(): { version: VersionId; tab: string } {
  if (typeof window === "undefined") {
    return { version: "v4", tab: VERSION_4_TABS[0].id };
  }
  const params = new URLSearchParams(window.location.search);
  const versionParam = params.get("version");
  const version: VersionId =
    versionParam === "v1" || versionParam === "v2" || versionParam === "v3"
      ? versionParam
      : "v4";
  const versionTabs = TABS_BY_VERSION[version];
  const tabParam = params.get("tab");
  const tab = versionTabs.some((t) => t.id === tabParam)
    ? (tabParam as string)
    : versionTabs[0].id;
  return { version, tab };
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [version, setVersion] = useState<VersionId>("v4");
  const [activeTab, setActiveTab] = useState(VERSION_4_TABS[0].id);
  // V3's "Desktop Compare & Save" tile only — which tile ids are selected
  // for compare, in selection order (so each tile can number itself 1, 2,
  // 3… and the toast below can report a total count)
  const [compareSelection, setCompareSelection] = useState<number[]>([]);

  const tabs = TABS_BY_VERSION[version];
  // Version 3 currently shares Version 2's tile set and layout rules (it
  // started as a clone) — anywhere V2-specific behavior is gated, V3 opts
  // in too.
  const usesV2Style = version !== "v1";

  const openDetails = () => setModalOpen(true);

  // adopt whatever version + tab the URL points to once the page has
  // mounted (both on first load and if the user navigates back/forward)
  useEffect(() => {
    const applyFromUrl = () => {
      const fromUrl = readStateFromUrl();
      setVersion(fromUrl.version);
      setActiveTab(fromUrl.tab);
      setCompareSelection([]);
    };
    applyFromUrl();
    window.addEventListener("popstate", applyFromUrl);
    return () => window.removeEventListener("popstate", applyFromUrl);
  }, []);

  const updateUrl = (nextVersion: VersionId, nextTab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("version", nextVersion);
    url.searchParams.set("tab", nextTab);
    window.history.replaceState(null, "", url);
  };

  const handleVersionChange = (nextVersion: VersionId) => {
    const nextTab = TABS_BY_VERSION[nextVersion][0].id;
    setVersion(nextVersion);
    setActiveTab(nextTab);
    setCompareSelection([]);
    updateUrl(nextVersion, nextTab);
  };

  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab);
    setCompareSelection([]);
    updateUrl(version, nextTab);
  };

  const toggleCompareSelection = (id: number) => {
    setCompareSelection((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    );
  };

  // `key` is the React list key (always unique across the grid); `contentKey`
  // drives which variant/badge a tile shows and repeats every `patternLength`
  // slots, so tripling the grid (see `rows` below) replays the same visual
  // order 3x instead of continuing the cycle past the block boundary
  const renderCard = (key: number, contentKey: number = key) => {
    // every other tile (half of the grid) carries the Keysight Premium
    // Used seal over the product photo, per the Figma spec
    const showPremiumBadge = contentKey % 2 === 1;

    switch (activeTab) {
      case "default":
        // Version 2's static tile scatters 3 content variants (photo,
        // condition, warranty) cyclically across the grid instead of
        // repeating one card, per the Figma "Desktop Default" spec. It
        // never shows the Premium Used seal (see ProductCardStatic). V3 no
        // longer has a "default" tab of its own (its "Desktop Simplified"
        // tile was retired), so this only ever renders for V1/V2.
        return usesV2Style ? (
          <ProductCardStatic
            key={key}
            variant={contentKey % 3}
            onOpenDetails={openDetails}
          />
        ) : (
          <ProductCard key={key} showPremiumBadge={showPremiumBadge} />
        );
      case "compare-save":
        // V3-only: a duplicate of "Desktop Simplified" with a static
        // Compare + Save action bar above the price (see
        // ProductCardCompareSave). `key` doubles as this tile's compare id —
        // it's already unique and stable across re-renders of this grid.
        return (
          <ProductCardCompareSave
            key={key}
            variant={contentKey % 3}
            isComparing={compareSelection.includes(key)}
            compareNumber={compareSelection.indexOf(key) + 1}
            onToggleCompare={() => toggleCompareSelection(key)}
          />
        );
      case "compare-check":
      case "compare-check-stack-bottom":
      case "compare-check-corners-bottom":
        // Also V4's "Desktop V1" / "V2" / "V3": one tile, three placements
        // of its floating Compare (numbered pill) and Save buttons — top
        // corners, stacked bottom-left, bottom corners (see
        // ProductCardCompareCheck).
        // Shares the same lifted compareSelection state as "compare-save"
        // above; the toast at the bottom of the page doesn't change.
        return (
          <ProductCardCompareCheck
            key={key}
            variant={contentKey % 3}
            isComparing={compareSelection.includes(key)}
            compareNumber={compareSelection.indexOf(key) + 1}
            onToggleCompare={() => toggleCompareSelection(key)}
            placement={
              activeTab === "compare-check-stack-bottom"
                ? "stack-bottom-left"
                : activeTab === "compare-check-corners-bottom"
                  ? "corners-bottom"
                  : "corners"
            }
          />
        );
      case "compare-save-cta":
        // V3-only: a duplicate of "Desktop Compare & Save" with an added
        // "Request quote" CTA below the price (see
        // ProductCardCompareSaveCta). Same lifted compareSelection state,
        // same toast — only the tile itself and the grid (3 tiles, one row)
        // differ.
        return (
          <ProductCardCompareSaveCta
            key={key}
            variant={contentKey % 3}
            isComparing={compareSelection.includes(key)}
            compareNumber={compareSelection.indexOf(key) + 1}
            onToggleCompare={() => toggleCompareSelection(key)}
          />
        );
      case "gallery":
        // likewise, V2's click-to-toggle gallery tile scatters the same 3
        // content variants as Desktop Basic and never shows the seal
        return usesV2Style ? (
          <ProductCardGalleryClick
            key={key}
            variant={contentKey % 3}
            onOpenDetails={openDetails}
          />
        ) : (
          <ProductCardGallery key={key} showPremiumBadge={showPremiumBadge} />
        );
      case "quote":
        return (
          <ProductCardQuote
            key={key}
            onOpenDetails={openDetails}
            showPremiumBadge={showPremiumBadge}
          />
        );
      case "quick-action":
        return (
          <ProductCardQuickAction
            key={key}
            showPremiumBadge={showPremiumBadge}
          />
        );
      case "mobile":
        return (
          <ProductCardMobile key={key} showPremiumBadge={showPremiumBadge} />
        );
      case "mobile-expand":
        return (
          <ProductCardMobileExpand
            key={key}
            showPremiumBadge={showPremiumBadge}
          />
        );
      case "mobile-gallery":
        return (
          <ProductCardMobileGallery
            key={key}
            showPremiumBadge={showPremiumBadge}
          />
        );
      case "mobile-gallery-swipe":
        return (
          <ProductCardMobileGallerySwipe
            key={key}
            showPremiumBadge={showPremiumBadge}
          />
        );
      case "mobile-quick-view":
        return (
          <ProductCardMobileQuickView
            key={key}
            showPremiumBadge={showPremiumBadge}
          />
        );
      case "mobile-landscape":
        return (
          <ProductCardMobileLandscape
            key={key}
            showPremiumBadge={showPremiumBadge}
          />
        );
      case "mobile-basic":
        // V3 no longer has a "mobile-basic" tab of its own (its "Mobile
        // Simplified" tile was retired), so this only ever renders for
        // V1/V2.
        return <ProductCardMobileBasic key={key} variant={contentKey % 3} />;
      case "mobile-compare-save":
        // V3-only: Compare inline above the price, Save as a floating icon
        // button over the image (see ProductCardMobileCompareSave). Same
        // lifted compareSelection state and toast as the desktop compare
        // tiles.
        return (
          <ProductCardMobileCompareSave
            key={key}
            variant={contentKey % 3}
            isComparing={compareSelection.includes(key)}
            compareNumber={compareSelection.indexOf(key) + 1}
            onToggleCompare={() => toggleCompareSelection(key)}
          />
        );
      case "mobile-corners":
      case "mobile-wide-stack-bottom":
      case "mobile-wide-corners-bottom":
        // V4's "Mobile V1"–"V3": the shared Save + Compare floating buttons
        // over the photo of the mobile landscape layout, in the same three
        // placements as Desktop V1–V3 — V1 on the even split, V2/V3 with
        // the photo widened (see ProductCardMobileQuickActions). Same lifted
        // compareSelection state and toast as the desktop V4 tiles.
        return (
          <ProductCardMobileQuickActions
            key={key}
            variant={contentKey % 3}
            isComparing={compareSelection.includes(key)}
            compareNumber={compareSelection.indexOf(key) + 1}
            onToggleCompare={() => toggleCompareSelection(key)}
            layout={
              activeTab === "mobile-wide-stack-bottom" ||
              activeTab === "mobile-wide-corners-bottom"
                ? "split-wide"
                : "split-half"
            }
            placement={
              activeTab === "mobile-corners"
                ? "corners"
                : activeTab === "mobile-wide-stack-bottom"
                  ? "stack-bottom-left"
                  : "corners-bottom"
            }
          />
        );
      case "mobile-compare-check":
        // V3-only: "Mobile Compare & Save"'s layout with Compare swapped
        // for the desktop check-mark tile's plain checkbox — no numbered
        // badge (see
        // ProductCardMobileCompareCheck). Same lifted compareSelection
        // state and toast as the other compare tiles.
        return (
          <ProductCardMobileCompareCheck
            key={key}
            variant={contentKey % 3}
            isComparing={compareSelection.includes(key)}
            onToggleCompare={() => toggleCompareSelection(key)}
          />
        );
      case "mobile-compare-save-cta":
        // V3-only: mobile equivalent of "Desktop Compare & Save + CTA" —
        // "Mobile Compare & Save"'s Compare (same lifted compareSelection
        // state), no Save, and a "Request quote" pill in the feature bar
        // (see ProductCardMobileCompareSaveCta).
        return (
          <ProductCardMobileCompareSaveCta
            key={key}
            variant={contentKey % 3}
            isComparing={compareSelection.includes(key)}
            compareNumber={compareSelection.indexOf(key) + 1}
            onToggleCompare={() => toggleCompareSelection(key)}
          />
        );
      case "mobile-basic-gallery":
        return (
          <ProductCardMobileBasicGallery key={key} variant={contentKey % 3} />
        );
      case "mobile-portrait":
        return (
          <ProductCardMobilePortrait key={key} variant={contentKey % 3} />
        );
      default:
        return null;
    }
  };

  // Version 2's static and gallery tiles both scatter 3 content variants
  // across a wider 4x2 grid (8 slots) with a tighter 10px gap, per the
  // Figma spec
  const isV2Static =
    usesV2Style &&
    (activeTab === "default" ||
      activeTab === "gallery" ||
      activeTab === "compare-save" ||
      activeTab === "compare-check" ||
      activeTab === "compare-check-stack-bottom" ||
      activeTab === "compare-check-corners-bottom");

  const isMobile = MOBILE_TABS.has(activeTab);
  const isStacked = STACKED_TABS.has(activeTab);
  // V3-only: "Desktop Compare & Save + CTA" always shows exactly 3 tiles in
  // a single row, skipping both the 4-column treatment and the 3x vertical
  // repeat every other desktop tab gets below
  const isSingleRow = activeTab === "compare-save-cta";
  const columns = isStacked ? 1 : isV2Static ? 4 : isMobile ? 2 : 3;
  const baseRows = isStacked ? 4 : isSingleRow ? 1 : 2;
  // every Version 2 (and V3, which shares its layout) tab repeats its grid
  // 3x vertically — same tile count, same cyclical variant order, just
  // stacked again twice more underneath
  const rows = isSingleRow ? 1 : usesV2Style ? baseRows * 3 : baseRows;
  const patternLength = columns * baseRows;
  const gap = isMobile || isStacked || isV2Static ? 10 : 16;

  // only Version 2's 4-column desktop grid gets responsive breakpoints (see
  // page.module.css), wrapping down to 3 then 2 columns as the viewport
  // narrows. Version 1 stays exactly as it was — fixed column counts at
  // every width — per request.
  const isDesktopGrid = isV2Static;
  const gridClassName = isDesktopGrid
    ? `${styles.grid} ${styles.gridDesktop4}`
    : styles.grid;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "56px 32px 80px",
        background: "var(--color-extra-light-gray)",
      }}
    >
      <VersionToggle activeId={version} onChange={handleVersionChange} />

      <CardTabs tabs={tabs} activeId={activeTab} onChange={handleTabChange} />

      <div
        className={gridClassName}
        style={{
          gridTemplateColumns: isDesktopGrid
            ? undefined
            : `repeat(${columns}, auto)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: columns * rows }, (_, i) =>
          renderCard(i, i % patternLength)
        )}
      </div>

      {modalOpen && <ProductModal onClose={() => setModalOpen(false)} />}

      <CompareToast
        visible={
          (version === "v3" || version === "v4") &&
          COMPARE_TABS.has(activeTab) &&
          compareSelection.length >= 2
        }
        count={compareSelection.length}
        href={COMPARE_URL}
      />
    </main>
  );
}
