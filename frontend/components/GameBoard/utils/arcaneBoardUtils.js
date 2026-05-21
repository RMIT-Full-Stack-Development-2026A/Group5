/* ============================================================
   ARCANE DOMINION — COMPONENT CODE
   Four self-contained pieces to drop into your existing game.
   ============================================================ */

/* ----------------------------------------------------------
   INTERNAL HELPER
   Generates an inline animation-delay style string.
   ---------------------------------------------------------- */
function _d(seconds) {
  return `style="animation-delay:${seconds}s"`;
}

/* ----------------------------------------------------------
   1. BACKGROUND — Arcane void canvas
   Call drawArcaneBackground(canvas) after sizing the canvas.

   Required HTML:
     <canvas id="bgc" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"></canvas>

   Usage:
     const canvas = document.getElementById('bgc');
     canvas.width  = container.offsetWidth;
     canvas.height = container.offsetHeight;
     drawArcaneBackground(canvas);
   ---------------------------------------------------------- */

const _RUNES = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'.split('');

const _RUNE_POSITIONS = Array.from({ length: 30 }, () => [
  Math.random() * 100,
  Math.random() * 100,
  _RUNES[Math.floor(Math.random() * _RUNES.length)],
  0.04 + Math.random() * 0.1,
  8 + Math.floor(Math.random() * 8),
]);

const _SPARK_POSITIONS = Array.from({ length: 45 }, () => [
  Math.random() * 100,
  Math.random() * 100,
  0.4 + Math.random() * 1.2,
]);

function drawArcaneBackground(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Deep void fill
  ctx.fillStyle = '#060410';
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.4, rv = r * 0.7;

  // Outer dashed circle
  ctx.strokeStyle = 'rgba(55,28,100,0.22)';
  ctx.lineWidth = 0.7;
  ctx.setLineDash([2, 4]);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

  // Inner solid circle
  ctx.strokeStyle = 'rgba(55,28,100,0.14)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(cx, cy, rv, 0, Math.PI * 2); ctx.stroke();

  // Star of Solomon — upward triangle
  const tri1 = [
    [cx, cy - rv],
    [cx + rv * Math.sin(2 * Math.PI / 3), cy - rv * Math.cos(2 * Math.PI / 3)],
    [cx + rv * Math.sin(4 * Math.PI / 3), cy - rv * Math.cos(4 * Math.PI / 3)],
  ];
  ctx.strokeStyle = 'rgba(44,22,88,0.16)'; ctx.lineWidth = 0.5;
  ctx.beginPath();
  tri1.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath(); ctx.stroke();

  // Star of Solomon — downward triangle
  const tri2 = [
    [cx, cy + rv],
    [cx + rv * Math.sin(2 * Math.PI / 3), cy + rv * Math.cos(2 * Math.PI / 3)],
    [cx + rv * Math.sin(4 * Math.PI / 3), cy + rv * Math.cos(4 * Math.PI / 3)],
  ];
  ctx.beginPath();
  tri2.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath(); ctx.stroke();

  // Elder Futhark runes scattered across the void
  _RUNE_POSITIONS.forEach(([px, py, rune, alpha, fs]) => {
    ctx.fillStyle = `rgba(90,50,160,${alpha})`;
    ctx.font = `${fs}px Georgia`;
    ctx.fillText(rune, px / 100 * W, py / 100 * H);
  });

  // Astral sparks
  _SPARK_POSITIONS.forEach(([px, py, r]) => {
    ctx.beginPath();
    ctx.arc(px / 100 * W, py / 100 * H, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100,60,210,${0.12 + Math.random() * 0.22})`;
    ctx.fill();
  });
}


/* ----------------------------------------------------------
   2. ARCANE SEAL — Player X marker (purple Star of Solomon)
   Returns an SVG HTML string to inject via innerHTML.

   Usage:
     cell.innerHTML = arcaneSeal(50);       // 50px in a cell
     turnIndicator.innerHTML = arcaneSeal(20); // 20px in UI

   Each shape carries .sgl / .sglf / .sgd + animation-delay
   so the sigil draws itself stroke-by-stroke when injected.
   ---------------------------------------------------------- */
function arcaneSeal(sz) {
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 54 54" fill="none">
  <circle class="sglf" cx="27" cy="27" r="22"  stroke="#5a28a8" stroke-width="0.9" stroke-dasharray="2,3" ${_d(0)}/>
  <circle class="sgl"  cx="27" cy="27" r="17"  stroke="#9b6ffb" stroke-width="1.2" ${_d(0.06)}/>
  <polygon class="sgl" points="27,10 41.7,35.5 12.3,35.5" stroke="#9b6ffb" stroke-width="1"  fill="rgba(139,92,246,0.12)" ${_d(0.14)}/>
  <polygon class="sgl" points="27,44 41.7,18.5 12.3,18.5" stroke="#7a3be6" stroke-width="1"  fill="rgba(109,40,217,0.12)" ${_d(0.23)}/>
  <circle class="sgl"  cx="27" cy="27" r="4.5" stroke="#d7ccff" stroke-width="1" fill="rgba(139,92,246,0.30)" ${_d(0.32)}/>
  <circle class="sgd"  cx="27"   cy="27"   r="1.8" fill="#efe6ff" ${_d(0.40)}/>
  <circle class="sgd"  cx="27"   cy="10"   r="1.6" fill="#d7ccff" ${_d(0.46)}/>
  <circle class="sgd"  cx="41.7" cy="35.5" r="1.6" fill="#d7ccff" ${_d(0.46)}/>
  <circle class="sgd"  cx="12.3" cy="35.5" r="1.6" fill="#d7ccff" ${_d(0.46)}/>
  <circle class="sgd"  cx="27"   cy="44"   r="1.6" fill="#c99bff" ${_d(0.50)}/>
  <circle class="sgd"  cx="41.7" cy="18.5" r="1.6" fill="#c99bff" ${_d(0.50)}/>
  <circle class="sgd"  cx="12.3" cy="18.5" r="1.6" fill="#c99bff" ${_d(0.50)}/>
</svg>`;
}


/* ----------------------------------------------------------
   3. BLOOD RUNE — Player O marker (crimson Elder bind-rune)
   Returns an SVG HTML string to inject via innerHTML.

   Usage:
     cell.innerHTML = bloodRune(46);
     turnIndicator.innerHTML = bloodRune(18);
   ---------------------------------------------------------- */
function bloodRune(sz) {
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 46 52" fill="none">
  <path class="sglf" d="M31,6 A20,20 0 1,1 15,6" stroke="#dc2626" stroke-width="0.8" stroke-dasharray="2,4" ${_d(0)}/>
  <line class="sgl" x1="23" y1="3"  x2="23" y2="49" stroke="#dc2626" stroke-width="1.7" ${_d(0.05)}/>
  <line class="sgl" x1="23" y1="14" x2="8"  y2="24" stroke="#dc2626" stroke-width="1.3" ${_d(0.13)}/>
  <line class="sgl" x1="23" y1="14" x2="38" y2="24" stroke="#dc2626" stroke-width="1.3" ${_d(0.18)}/>
  <line class="sgl" x1="23" y1="26" x2="10" y2="20" stroke="#ef4444" stroke-width="1"   ${_d(0.24)}/>
  <line class="sgl" x1="23" y1="26" x2="36" y2="20" stroke="#ef4444" stroke-width="1"   ${_d(0.28)}/>
  <line class="sgl" x1="12" y1="37" x2="34" y2="37" stroke="#dc2626" stroke-width="1.2" ${_d(0.34)}/>
  <line class="sgl" x1="15" y1="41" x2="31" y2="41" stroke="#b91c1c" stroke-width="0.7" ${_d(0.38)}/>
  <circle class="sgd" cx="23" cy="3"  r="2.2" fill="#dc2626" ${_d(0.44)}/>
  <circle class="sgd" cx="23" cy="49" r="2.2" fill="#dc2626" ${_d(0.44)}/>
  <circle class="sgd" cx="8"  cy="24" r="1.7" fill="#ef4444" ${_d(0.48)}/>
  <circle class="sgd" cx="38" cy="24" r="1.7" fill="#ef4444" ${_d(0.48)}/>
  <circle class="sgd" cx="10" cy="20" r="1.2" fill="#b91c1c" ${_d(0.52)}/>
  <circle class="sgd" cx="36" cy="20" r="1.2" fill="#b91c1c" ${_d(0.52)}/>
  <circle class="sgd" cx="12" cy="37" r="1.2" fill="#ef4444" ${_d(0.52)}/>
  <circle class="sgd" cx="34" cy="37" r="1.2" fill="#ef4444" ${_d(0.52)}/>
</svg>`;
}


/* ----------------------------------------------------------
   4. ARCANE WIN LINE — Energy beam with 8-pointed sigil nodes
   Draws an animated beam + activation circles across the 3
   winning cells in the winner's color (purple or crimson).

   Parameters:
     svgEl         — <svg> element, position:absolute over board,
                     pointer-events:none, z-index above cells
     containerEl   — the board wrapper the SVG overlays
                     (used to set SVG width/height)
     line          — array of 3 cell indices e.g. [0, 4, 8]
     winner        — 'X' (arcane/purple) or 'O' (blood/crimson)
     getCellCenter — function(idx) => { x, y } in page pixels

   Usage:
     drawArcaneWinLine(
       document.getElementById('winSvg'),
       document.getElementById('boardOuter'),
       [0, 4, 8],
       'X',
       (idx) => {
         const r = cells[idx].getBoundingClientRect();
         return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
       }
     );

   To clear on reset:
     svgEl.innerHTML = '';
     svgEl.removeAttribute('width');
     svgEl.removeAttribute('height');
   ---------------------------------------------------------- */
function drawArcaneWinLine(svgEl, containerEl, line, winner, getCellCenter) {
  const ns = 'http://www.w3.org/2000/svg';

  // Size SVG to exactly match container
  svgEl.setAttribute('width', containerEl.offsetWidth);
  svgEl.setAttribute('height', containerEl.offsetHeight);
  svgEl.innerHTML = '';

  const cRect = containerEl.getBoundingClientRect();

  // Convert page-pixel centers to SVG-local coords
  const pts = line.map(idx => {
    const { x, y } = getCellCenter(idx);
    return { x: x - cRect.left, y: y - cRect.top };
  });

  const isX = winner === 'X';
  const [cr, cg, cb] = isX ? [139, 92, 246] : [220, 38, 38];
  const col = `rgb(${cr},${cg},${cb})`;
  const colD = isX ? '#4c1d95' : '#991b1b';
  const colB = isX ? '#c4b5fd' : '#fca5a5';

  // Animated beam — thick main line + thin bright edge
  pts.forEach((p, i) => {
    if (i === pts.length - 1) return;
    const q = pts[i + 1];
    const len = Math.sqrt((q.x - p.x) ** 2 + (q.y - p.y) ** 2);

    [[2.5, col, 0], [0.7, colB, 0.06]].forEach(([sw, stroke, od]) => {
      const s = document.createElementNS(ns, 'line');
      s.setAttribute('x1', p.x); s.setAttribute('y1', p.y);
      s.setAttribute('x2', q.x); s.setAttribute('y2', q.y);
      s.setAttribute('stroke', stroke);
      s.setAttribute('stroke-width', sw);
      s.setAttribute('stroke-linecap', 'round');
      s.setAttribute('stroke-dasharray', len);
      s.setAttribute('stroke-dashoffset', len);
      s.classList.add('win-seg');
      s.style.animationDelay = `${i * 0.2 + od}s`;
      svgEl.appendChild(s);
    });
  });

  // 8-pointed activation node at each of the 3 winning cells
  pts.forEach((p, i) => {
    const delay = `${i * 0.2 + 0.45}s`;

    const mkC = (r, fill, stroke, sw) => {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', r);
      c.setAttribute('fill', fill); c.setAttribute('stroke', stroke); c.setAttribute('stroke-width', sw);
      c.classList.add('win-nd'); c.style.animationDelay = delay;
      svgEl.appendChild(c);
    };
    const mkL = (x1, y1, x2, y2) => {
      const l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1);
      l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('stroke', col); l.setAttribute('stroke-width', '0.7');
      l.classList.add('win-nd'); l.style.animationDelay = delay;
      svgEl.appendChild(l);
    };

    // Concentric rings
    mkC(15, `rgba(${cr},${cg},${cb},0.06)`, `rgba(${cr},${cg},${cb},0.15)`, '4');
    mkC(11, `rgba(${cr},${cg},${cb},0.10)`, col, '1');
    mkC(6, `rgba(${cr},${cg},${cb},0.06)`, colD, '0.8');

    // 8 spokes — cross + diagonal
    mkL(p.x - 11, p.y, p.x + 11, p.y);
    mkL(p.x, p.y - 11, p.x, p.y + 11);
    mkL(p.x - 7.8, p.y - 7.8, p.x + 7.8, p.y + 7.8);
    mkL(p.x + 7.8, p.y - 7.8, p.x - 7.8, p.y + 7.8);

    // Bright core dot
    mkC(2.5, colB, 'none', '0');
  });
}

export { drawArcaneWinLine, arcaneSeal, bloodRune, drawArcaneBackground };