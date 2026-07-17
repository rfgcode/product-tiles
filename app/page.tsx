"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import ProductCardGallery from "../components/ProductCardGallery/ProductCardGallery";
import ProductCardQuote from "../components/ProductCardQuote/ProductCardQuote";
import ProductCardMobile from "../components/ProductCardMobile/ProductCardMobile";
import ProductCardMobileExpand from "../components/ProductCardMobileExpand/ProductCardMobileExpand";
import ProductModal from "../components/ProductModal/ProductModal";
import CardTabs, { TabDef } from "../components/CardTabs/CardTabs";

// Add a new entry here (and a matching case in the render switch below) to
// grow past today's 5 variants — the tab bar itself needs no changes.
const TABS: TabDef[] = [
  { id: "default", label: "Basic" },
  { id: "gallery", label: "Gallery" },
  { id: "quote", label: "Quote CTA" },
  { id: "mobile", label: "Mobile" },
  { id: "mobile-expand", label: "Mobile Expand" },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const openDetails = () => setModalOpen(true);

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
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          flex: 1,
          width: "100%",
        }}
      >
        {activeTab === "default" && <ProductCard onOpenDetails={openDetails} />}
        {activeTab === "gallery" && <ProductCardGallery onOpenDetails={openDetails} />}
        {activeTab === "quote" && <ProductCardQuote onOpenDetails={openDetails} />}
        {activeTab === "mobile" && <ProductCardMobile />}
        {activeTab === "mobile-expand" && <ProductCardMobileExpand />}
      </div>

      {modalOpen && <ProductModal onClose={() => setModalOpen(false)} />}
    </main>
  );
}
