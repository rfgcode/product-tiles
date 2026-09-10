// Every tile variant links out to the same real Keysight PDP so browsing the
// prototype feels like using the live site rather than a static mockup.
export const PRODUCT_DETAIL_URL =
  "https://www.keysight.com/used/ww/ww/spectrum-signal-analyzers/n9040b-508-p08-101178";

export function goToProductDetail() {
  window.location.href = PRODUCT_DETAIL_URL;
}

// V3's "Desktop Compare & Save" tile links its compare toast to the real
// Keysight compare page, same spirit as PRODUCT_DETAIL_URL above.
export const COMPARE_URL =
  "https://www.keysight.com/used/nz/en/equipment/pages/compare/b747f6";
