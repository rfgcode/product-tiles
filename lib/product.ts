// Every tile variant links out to the same real Keysight PDP so browsing the
// prototype feels like using the live site rather than a static mockup.
export const PRODUCT_DETAIL_URL =
  "https://www.keysight.com/used/ww/ww/spectrum-signal-analyzers/n9040b-508-p08-101178";

export function goToProductDetail() {
  window.location.href = PRODUCT_DETAIL_URL;
}
