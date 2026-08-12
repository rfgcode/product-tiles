"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import ProductCardStatic from "../components/ProductCardStatic/ProductCardStatic";
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
import ProductCardMobileBasicGallery from "../components/ProductCardMobileBasicGallery/ProductCardMobileBasicGallery";
import ProductModal from "../components/ProductModal/ProductModal";
import CardTabs, { TabDef } from "../components/CardTabs/CardTabs";
import VersionToggle, {
  VersionId,
} from "../components/VersionToggle/VersionToggle";

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
];

const TABS_BY_VERSION: Record<VersionId, TabDef[]> = {
  v1: VERSION_1_TABS,
  v2: VERSION_2_TABS,
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
]);

// the landscape tail variant is as wide as two portrait tiles plus their
// gap, so it stacks four to a page in a single column instead of the 2x2
// grid the other mobile variants use
const STACKED_TABS = new Set([
  "mobile-landscape",
  "mobile-basic",
  "mobile-basic-gallery",
]);

// reads ?version=v1|v2 off the URL so a link can deep-link straight to a
// specific version; anything else (missing, malformed) falls back to v2
function readVersionFromUrl(): VersionId {
  if (typeof window === "undefined") return "v2";
  return new URLSearchParams(window.location.search).get("version") === "v1"
    ? "v1"
    : "v2";
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [version, setVersion] = useState<VersionId>("v2");
  const [activeTab, setActiveTab] = useState(VERSION_2_TABS[0].id);

  const tabs = TABS_BY_VERSION[version];

  const openDetails = () => setModalOpen(true);

  // adopt whatever version the URL points to once the page has mounted
  // (both on first load and if the user navigates back/forward)
  useEffect(() => {
    const applyFromUrl = () => {
      const fromUrl = readVersionFromUrl();
      setVersion(fromUrl);
      setActiveTab(TABS_BY_VERSION[fromUrl][0].id);
    };
    applyFromUrl();
    window.addEventListener("popstate", applyFromUrl);
    return () => window.removeEventListener("popstate", applyFromUrl);
  }, []);

  const handleVersionChange = (nextVersion: VersionId) => {
    setVersion(nextVersion);
    setActiveTab(TABS_BY_VERSION[nextVersion][0].id);

    const url = new URL(window.location.href);
    url.searchParams.set("version", nextVersion);
    window.history.replaceState(null, "", url);
  };

  const renderCard = (key: number) => {
    // every other tile (half of the grid) carries the Keysight Premium
    // Used seal over the product photo, per the Figma spec
    const showPremiumBadge = key % 2 === 1;

    switch (activeTab) {
      case "default":
        // Version 2's static tile scatters 3 content variants (photo,
        // condition, warranty) cyclically across the grid instead of
        // repeating one card, per the Figma "Desktop Default" spec. It
        // never shows the Premium Used seal (see ProductCardStatic).
        return version === "v2" ? (
          <ProductCardStatic
            key={key}
            variant={key % 3}
            onOpenDetails={openDetails}
          />
        ) : (
          <ProductCard key={key} showPremiumBadge={showPremiumBadge} />
        );
      case "gallery":
        // likewise, V2's click-to-toggle gallery tile scatters the same 3
        // content variants as Desktop Basic and never shows the seal
        return version === "v2" ? (
          <ProductCardGalleryClick
            key={key}
            variant={key % 3}
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
        return <ProductCardMobileBasic key={key} variant={key % 3} />;
      case "mobile-basic-gallery":
        return <ProductCardMobileBasicGallery key={key} variant={key % 3} />;
      default:
        return null;
    }
  };

  // Version 2's static and gallery tiles both scatter 3 content variants
  // across a wider 4x2 grid (8 slots) with a tighter 10px gap, per the
  // Figma spec
  const isV2Static =
    version === "v2" && (activeTab === "default" || activeTab === "gallery");

  const isMobile = MOBILE_TABS.has(activeTab);
  const isStacked = STACKED_TABS.has(activeTab);
  const columns = isStacked ? 1 : isV2Static ? 4 : isMobile ? 2 : 3;
  const rows = isStacked ? 4 : 2;
  const gap = isMobile || isStacked || isV2Static ? 10 : 16;

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

      <CardTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, auto)`,
          gap: `${gap}px`,
          justifyContent: "center",
          alignItems: "start",
          alignContent: "start",
          flex: 1,
          width: "100%",
        }}
      >
        {Array.from({ length: columns * rows }, (_, i) => renderCard(i))}
      </div>

      {modalOpen && <ProductModal onClose={() => setModalOpen(false)} />}
    </main>
  );
}
