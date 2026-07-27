"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import ProductCardGallery from "../components/ProductCardGallery/ProductCardGallery";
import ProductCardQuote from "../components/ProductCardQuote/ProductCardQuote";
import ProductCardQuickAction from "../components/ProductCardQuickAction/ProductCardQuickAction";
import ProductCardMobile from "../components/ProductCardMobile/ProductCardMobile";
import ProductCardMobileExpand from "../components/ProductCardMobileExpand/ProductCardMobileExpand";
import ProductCardMobileGallery from "../components/ProductCardMobileGallery/ProductCardMobileGallery";
import ProductCardMobileGallerySwipe from "../components/ProductCardMobileGallerySwipe/ProductCardMobileGallerySwipe";
import ProductCardMobileQuickView from "../components/ProductCardMobileQuickView/ProductCardMobileQuickView";
import ProductModal from "../components/ProductModal/ProductModal";
import CardTabs, { TabDef } from "../components/CardTabs/CardTabs";

// Add a new entry here (and a matching case in the render switch below) to
// grow past today's variants — the dropdown itself needs no changes.
const TABS: TabDef[] = [
  { id: "default", label: "Desktop Basic" },
  { id: "gallery", label: "Desktop Gallery" },
  { id: "quote", label: "Desktop Quote" },
  { id: "quick-action", label: "Desktop Quick Action" },
  { id: "mobile", label: "Mobile Basic" },
  { id: "mobile-expand", label: "Mobile Expand" },
  { id: "mobile-gallery", label: "Mobile Gallery" },
  { id: "mobile-gallery-swipe", label: "Mobile Gallery Swipe" },
  { id: "mobile-quick-view", label: "Mobile Quick View" },
];

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

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const openDetails = () => setModalOpen(true);

  const renderCard = (key: number) => {
    // every other tile (half of the grid) carries the Keysight Premium
    // Used seal over the product photo, per the Figma spec
    const showPremiumBadge = key % 2 === 1;

    switch (activeTab) {
      case "default":
        return <ProductCard key={key} showPremiumBadge={showPremiumBadge} />;
      case "gallery":
        return (
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
      default:
        return null;
    }
  };

  const isMobile = MOBILE_TABS.has(activeTab);
  const columns = isMobile ? 2 : 3;
  const rows = 2;
  const gap = isMobile ? 10 : 16;

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
      <CardTabs tabs={TABS} activeId={activeTab} onChange={setActiveTab} />

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
