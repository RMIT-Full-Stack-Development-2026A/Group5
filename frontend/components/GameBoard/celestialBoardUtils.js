/* ============================================================
   CELESTIAL TIC-TAC-TOE — COMPONENT CODE (v2 — fixed)
   Four self-contained pieces you can drop into any project.
   ============================================================ */

/* ----------------------------------------------------------
   1. BACKGROUND — Night Sky Canvas
   Call drawBackground(canvas) where canvas is a <canvas> element.
   The canvas should be: position:absolute; inset:0; width:100%; height:100%
   Set canvas.width / canvas.height to the container's pixel size first.
   ---------------------------------------------------------- */

const STAR_POSITIONS = Array.from({ length: 90 }, () => [
  Math.random() * 100,       // x (%)
  Math.random() * 100,       // y (%)
  Math.random() * 1.4 + 0.4 // radius
]);

const CONSTELLATION_PATHS = [
  [[8,12],[20,18],[30,12],[38,22],[50,17],[62,24]],
  [[5,55],[15,45],[22,58],[18,70],[28,65]],
  [[68,48],[78,40],[88,52],[82,65],[72,62],[68,48]],
  [[40,75],[55,70],[66,80],[75,72]],
  [[12,30],[24,22],[20,14]],
  [[80,20],[90,28],[85,15]],
];

export function drawBackground(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Deep navy fill
  ctx.fillStyle = '#060a22';
  ctx.fillRect(0, 0, W, H);

  // Scattered star dots
  STAR_POSITIONS.forEach(([px, py, r]) => {
    ctx.beginPath();
    ctx.arc(px / 100 * W, py / 100 * H, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,220,255,${0.3 + Math.random() * 0.5})`;
    ctx.fill();
  });

  // Constellation lines + vertex dots
  CONSTELLATION_PATHS.forEach(points => {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(150,185,255,0.18)';
    ctx.lineWidth = 0.7;
    ctx.setLineDash([3, 6]);
    points.forEach(([px, py], i) => {
      i === 0
        ? ctx.moveTo(px / 100 * W, py / 100 * H)
        : ctx.lineTo(px / 100 * W, py / 100 * H);
    });
    ctx.stroke();

    points.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px / 100 * W, py / 100 * H, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(170,205,255,0.5)';
      ctx.fill();
    });

    ctx.setLineDash([]);
  });
}

/* Usage:
   const canvas = document.getElementById('myCanvas');
   canvas.width  = container.offsetWidth;
   canvas.height = container.offsetHeight;
   drawBackground(canvas);
*/


/* ----------------------------------------------------------
   2. CONSTELLATION WIN LINE — SVG overlay  (FIXED v2)
   Draws an animated star-to-star constellation line across the
   3 winning cells, like the Orion-style reference image.

   Parameters:
     svgEl         — <svg> element, position:absolute over board,
                     pointer-events:none, z-index above cells
     containerEl   — the parent container the SVG overlays
                     (used to size the SVG coordinate space)
     line          — array of 3 cell indices, e.g. [0, 4, 8]
     getCellCenter — function(idx) => { x, y } in page pixels
   ---------------------------------------------------------- */

export function drawConstellationWinLine(svgEl, containerEl, line, getCellCenter) {
  svgEl.setAttribute('width',  containerEl.offsetWidth);
  svgEl.setAttribute('height', containerEl.offsetHeight);
  svgEl.innerHTML = '';

  const containerRect = containerEl.getBoundingClientRect();

  // Convert page-pixel centers to SVG-local coordinates
  const pts = line.map(idx => {
    const { x, y } = getCellCenter(idx);
    return {
      x: x - containerRect.left,
      y: y - containerRect.top,
    };
  });

  // Animated line segments connecting the 3 nodes
  pts.forEach((p, i) => {
    if (i === pts.length - 1) return;
    const q = pts[i + 1];
    const len = Math.sqrt((q.x - p.x) ** 2 + (q.y - p.y) ** 2);

    const seg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    seg.setAttribute('x1', p.x);
    seg.setAttribute('y1', p.y);
    seg.setAttribute('x2', q.x);
    seg.setAttribute('y2', q.y);
    seg.setAttribute('stroke', 'rgba(220,235,255,0.8)');
    seg.setAttribute('stroke-width', '1.8');
    seg.setAttribute('stroke-linecap', 'round');
    seg.setAttribute('stroke-dasharray', len);
    seg.setAttribute('stroke-dashoffset', len);
    seg.classList.add('win-seg');               // driven by CSS @keyframes drawLine
    seg.style.animationDelay = `${i * 0.2}s`;
    svgEl.appendChild(seg);
  });

  // Glowing node circles at each of the 3 star points
  pts.forEach((p, i) => {
    const delay = `${i * 0.2 + 0.1}s`;

    // Outer halo ring
    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    halo.setAttribute('cx', p.x);
    halo.setAttribute('cy', p.y);
    halo.setAttribute('r', '11');
    halo.setAttribute('fill',         'rgba(180,215,255,0.08)');
    halo.setAttribute('stroke',       'rgba(180,215,255,0.35)');
    halo.setAttribute('stroke-width', '1');
    halo.classList.add('win-dot');              // driven by CSS @keyframes popDot
    halo.style.animationDelay = delay;
    svgEl.appendChild(halo);

    // Mid ring
    const mid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    mid.setAttribute('cx', p.x);
    mid.setAttribute('cy', p.y);
    mid.setAttribute('r', '6.5');
    mid.setAttribute('fill',         'rgba(200,225,255,0.18)');
    mid.setAttribute('stroke',       'rgba(210,235,255,0.6)');
    mid.setAttribute('stroke-width', '1');
    mid.classList.add('win-dot');
    mid.style.animationDelay = delay;
    svgEl.appendChild(mid);

    // Bright core
    const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    core.setAttribute('cx', p.x);
    core.setAttribute('cy', p.y);
    core.setAttribute('r', '3.5');
    core.setAttribute('fill', 'rgba(240,250,255,0.95)');
    core.classList.add('win-dot');
    core.style.animationDelay = delay;
    svgEl.appendChild(core);
  });
}

/* Usage:
   const svgEl       = document.getElementById('winSvg');
   const containerEl = document.getElementById('sky');

   drawConstellationWinLine(svgEl, containerEl, [0, 4, 8], (idx) => {
     const rect = cells[idx].getBoundingClientRect();
     return {
       x: rect.left + rect.width  / 2,
       y: rect.top  + rect.height / 2,
     };
   });

   // To clear on reset:
   svgEl.innerHTML = '';
   svgEl.removeAttribute('width');
   svgEl.removeAttribute('height');
*/


/* ----------------------------------------------------------
   3. STAR MARKER — 5-pointed SVG star (Player X / Stars)
   Returns an HTML string containing an inline SVG.
   Inject with element.innerHTML = starMarker(54)
   ---------------------------------------------------------- */

export function starMarker(size = 54, opacity = 1) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <polygon
    points="25,2 31,18 48,18 35,28 40,45 25,35 10,45 15,28 2,18 19,18"
    fill="rgba(215,235,255,${opacity})"
    stroke="rgba(180,215,255,0.5)"
    stroke-width="1"
  />
</svg>`;
}

/* Usage:
   cell.innerHTML = starMarker(54);

   As an <img> src via data URI:
   img.src = 'data:image/svg+xml,' + encodeURIComponent(starMarker(54));
*/


/* ----------------------------------------------------------
   4. MOON MARKER — Crescent moon SVG (Player O / Moons)
   Returns an HTML string containing an inline SVG.
   Inject with element.innerHTML = moonMarker(50)
   ---------------------------------------------------------- */

export function moonMarker(size = 50, opacity = 1) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M34,7 Q19,9 16,25 Q13,41 28,45 Q15,47 8,37 Q2,27 7,15 Q12,4 26,3 Q31,2 34,7Z"
    fill="rgba(255,210,80,${opacity})"
    stroke="rgba(255,195,60,0.45)"
    stroke-width="1"
  />
</svg>`;
}

/* Usage:
   cell.innerHTML = moonMarker(50);

   As an <img> src via data URI:
   img.src = 'data:image/svg+xml,' + encodeURIComponent(moonMarker(50));
*/
