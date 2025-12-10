export const img2svg = async (imgEl) => {
  const src = imgEl.getAttribute('src');
  if (!src || !src.endsWith('.svg')) {
    return console.warn(`Element does not have a valid .svg src`);
  }

  try {
    const res = await fetch(src);
    const svgText = await res.text();

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl = svgDoc.documentElement;
    // Copy over any attributes from the <img> (like class, id, etc.)
    svgEl.classList.add(...imgEl.classList);
    if (imgEl.id) svgEl.id = imgEl.id;

    imgEl.replaceWith(svgEl);

    return svgEl;
  } catch (err) {
    console.error('Error loading SVG:', err);
    return null;
  }
};
