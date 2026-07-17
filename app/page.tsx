"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import ProductCardGallery from "../components/ProductCardGallery/ProductCardGallery";
import ProductCardQuote from "../components/ProductCardQuote/ProductCardQuote";
import ProductCardMobile from "../components/ProductCardMobile/ProductCardMobile";
import ProductCardMobileExpand from "../components/ProductCardMobileExpand/ProductCardMobileExpand";
import ProductCardMobileGallery from "../components/ProductCardMobileGallery/ProductCardMobileGallery";
import ProductModal from "../components/ProductModal/ProductModal";
import CardTabs, { TabDef } from "../components/CardTabs/CardTabs";

// Add a new entry here (and a matching case in the render switch below) to
// grow past today's variants — the dropdown itself needs no changes.
const TABS: TabDef[] = [
  { id: "default", label: "Basic" },
  { id: "gallery", label: "Gallery" },
  { id: "quote", label: "Quote CTA" },
  { id: "mobile", label: "Mobile" },
  { id: "mobile-expand", label: "Mobile Expand" },
  { id: "mobile-gallery", label: "Mobile Gallery" },
];

// mobile variants show a 2x2 grid (4 instances, 10px gap); desktop variants
// show a 3x2 grid (6 instances, a slightly larger gap) to make it easier to
// judge the tiles side by side
const MOBILE_TABS = new Set(["mobile", "mobile-expand", "mobile-gallery"]);

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const openDetails = () => setModalOpen(true);

  const renderCard = (key: number) => {
    switch (activeTab) {
      case "default":
        return <ProductCard key={key} onOpenDetails={openDetails} />;
      case "gallery":
        return <ProductCardGallery key={key} onOpenDetails={openDetails} />;
      case "quote":
        return <ProductCardQuote key={key} onOpenDetails={openDetails} />;
      case "mobile":
        return <ProductCardMobile key={key} />;
      case "mobile-expand":
        return <ProductCardMobileExpand key={key} />;
      case "mobile-gallery":
        return <ProductCardMobileGallery key={key} />;
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
