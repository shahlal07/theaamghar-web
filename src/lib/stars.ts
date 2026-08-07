// Generates star-rating markup, ported from ../Theaamghar/js/products.js
// starsHTML(). Output is fully self-generated (no interpolated external
// strings), so rendering it via dangerouslySetInnerHTML is safe.
export function starsHTML(rating: number): string {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html +=
      i <= Math.round(rating)
        ? '<span class="star">★</span>'
        : '<span class="star" style="opacity:0.25">★</span>';
  }
  return html;
}
