// PERSONALIZATE — Lightbox con zoom
// Se agrega solo en <script src="lightbox.js"></script> en cualquier página

(function(){

  // ── CSS ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #lb-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,.95);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity .25s;
    }
    #lb-overlay.open { opacity: 1; pointer-events: all; }
    #lb-wrap {
      position: relative; width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; cursor: zoom-in;
    }
    #lb-wrap.zoomed { cursor: grab; }
    #lb-wrap.grabbing { cursor: grabbing; }
    #lb-img {
      max-width: 92vw; max-height: 88vh;
      object-fit: contain;
      transform-origin: center center;
      transform: scale(1) translate(0px, 0px);
      transition: transform .2s ease;
      user-select: none; -webkit-user-drag: none;
      border-radius: 2px;
    }
    #lb-img.no-transition { transition: none; }
    #lb-close {
      position: fixed; top: 1rem; right: 1.2rem;
      background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
      color: #fff; font-size: 1.4rem; width: 42px; height: 42px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border-radius: 50%; z-index: 10000;
      transition: background .2s;
    }
    #lb-close:hover { background: #ff2d9b; border-color: #ff2d9b; }
    #lb-hint {
      position: fixed; bottom: 1.2rem; left: 50%; transform: translateX(-50%);
      color: rgba(255,255,255,.35); font-size: .72rem; letter-spacing: .1em;
      text-transform: uppercase; pointer-events: none;
      font-family: 'DM Sans', sans-serif;
      transition: opacity .4s;
    }
    #lb-zoom-btns {
      position: fixed; bottom: 1.2rem; right: 1.2rem;
      display: flex; gap: .4rem; z-index: 10000;
    }
    #lb-zoom-btns button {
      background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
      color: #fff; font-size: 1.1rem; width: 38px; height: 38px;
      cursor: pointer; border-radius: 4px;
      transition: background .15s;
    }
    #lb-zoom-btns button:hover { background: rgba(255,45,155,.5); }
    /* Make catalog images and product images clickable */
    .cat-item img,
    .product-img img,
    .modal-img img {
      cursor: zoom-in !important;
    }
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.innerHTML = `
    <button id="lb-close" title="Cerrar">✕</button>
    <div id="lb-wrap">
      <img id="lb-img" src="" alt="">
    </div>
    <div id="lb-hint">Doble click · Pellizco · Rueda para hacer zoom</div>
    <div id="lb-zoom-btns">
      <button id="lb-zin" title="Acercar">＋</button>
      <button id="lb-zout" title="Alejar">－</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const img   = document.getElementById('lb-img');
  const wrap  = document.getElementById('lb-wrap');
  const hint  = document.getElementById('lb-hint');

  // ── STATE ─────────────────────────────────────────────────────────────────
  let scale = 1, tx = 0, ty = 0;
  let isDragging = false, dragStartX = 0, dragStartY = 0, dragTx = 0, dragTy = 0;
  let lastTap = 0;
  const MIN_SCALE = 1, MAX_SCALE = 5;

  function applyTransform(animate){
    if(!animate) img.classList.add('no-transition');
    img.style.transform = `scale(${scale}) translate(${tx/scale}px, ${ty/scale}px)`;
    if(!animate) requestAnimationFrame(()=> img.classList.remove('no-transition'));
    wrap.classList.toggle('zoomed', scale > 1);
  }

  function clampTranslate(){
    if(scale <= 1){ tx = 0; ty = 0; return; }
    const iw = img.naturalWidth  || img.offsetWidth;
    const ih = img.naturalHeight || img.offsetHeight;
    const rw = Math.min(iw, window.innerWidth  * .92);
    const rh = Math.min(ih, window.innerHeight * .88);
    const maxTx = (rw  * (scale - 1)) / 2;
    const maxTy = (rh * (scale - 1)) / 2;
    tx = Math.max(-maxTx, Math.min(maxTx, tx));
    ty = Math.max(-maxTy, Math.min(maxTy, ty));
  }

  function zoomTo(newScale, cx, cy){
    const rect = img.getBoundingClientRect();
    const px = (cx - rect.left - rect.width/2);
    const py = (cy - rect.top  - rect.height/2);
    const ratio = newScale / scale;
    tx = (tx + px) * ratio - px;
    ty = (ty + py) * ratio - py;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    clampTranslate();
    applyTransform(true);
  }

  // ── OPEN / CLOSE ──────────────────────────────────────────────────────────
  function openLightbox(src, alt){
    if(!src || src.startsWith('data:')) return; // skip base64/placeholder
    scale = 1; tx = 0; ty = 0;
    img.src = src;
    img.alt = alt || '';
    applyTransform(false);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(()=>{ hint.style.opacity = '0'; }, 3000);
    hint.style.opacity = '1';
  }

  function closeLightbox(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(()=>{ img.src = ''; }, 300);
  }

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  overlay.addEventListener('click', e=>{ if(e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeLightbox(); });

  // ── ZOOM BUTTONS ──────────────────────────────────────────────────────────
  document.getElementById('lb-zin').addEventListener('click', ()=>{
    zoomTo(Math.min(scale * 1.5, MAX_SCALE), window.innerWidth/2, window.innerHeight/2);
  });
  document.getElementById('lb-zout').addEventListener('click', ()=>{
    zoomTo(Math.max(scale / 1.5, MIN_SCALE), window.innerWidth/2, window.innerHeight/2);
  });

  // ── MOUSE WHEEL ZOOM ──────────────────────────────────────────────────────
  wrap.addEventListener('wheel', e=>{
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.85 : 1.18;
    zoomTo(scale * delta, e.clientX, e.clientY);
  }, { passive: false });

  // ── DOUBLE CLICK ZOOM ─────────────────────────────────────────────────────
  wrap.addEventListener('dblclick', e=>{
    if(scale > 1){ zoomTo(1, e.clientX, e.clientY); }
    else { zoomTo(2.5, e.clientX, e.clientY); }
  });

  // ── DRAG TO PAN ───────────────────────────────────────────────────────────
  wrap.addEventListener('mousedown', e=>{
    if(scale <= 1) return;
    isDragging = true; dragStartX = e.clientX; dragStartY = e.clientY;
    dragTx = tx; dragTy = ty;
    wrap.classList.add('grabbing');
    e.preventDefault();
  });
  window.addEventListener('mousemove', e=>{
    if(!isDragging) return;
    tx = dragTx + (e.clientX - dragStartX);
    ty = dragTy + (e.clientY - dragStartY);
    clampTranslate();
    applyTransform(false);
  });
  window.addEventListener('mouseup', ()=>{
    isDragging = false;
    wrap.classList.remove('grabbing');
  });

  // ── TOUCH: PINCH ZOOM + PAN ───────────────────────────────────────────────
  let lastDist = null, touchStartScale = 1, touchMidX = 0, touchMidY = 0;
  let touchStartTx = 0, touchStartTy = 0, touchStartX = 0, touchStartY = 0;

  wrap.addEventListener('touchstart', e=>{
    if(e.touches.length === 2){
      lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartScale = scale;
      touchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      touchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      touchStartTx = tx; touchStartTy = ty;
    } else if(e.touches.length === 1){
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTx = tx; touchStartTy = ty;
      // Double tap
      const now = Date.now();
      if(now - lastTap < 300){
        const cx = e.touches[0].clientX, cy = e.touches[0].clientY;
        if(scale > 1){ zoomTo(1, cx, cy); }
        else { zoomTo(2.5, cx, cy); }
      }
      lastTap = now;
    }
  }, { passive: true });

  wrap.addEventListener('touchmove', e=>{
    e.preventDefault();
    if(e.touches.length === 2 && lastDist){
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, touchStartScale * dist / lastDist));
      const ratio = newScale / touchStartScale;
      const px = touchMidX - window.innerWidth/2;
      const py = touchMidY - window.innerHeight/2;
      tx = (touchStartTx + px) * ratio - px;
      ty = (touchStartTy + py) * ratio - py;
      scale = newScale;
      clampTranslate();
      applyTransform(false);
    } else if(e.touches.length === 1 && scale > 1){
      tx = touchStartTx + (e.touches[0].clientX - touchStartX);
      ty = touchStartTy + (e.touches[0].clientY - touchStartY);
      clampTranslate();
      applyTransform(false);
    }
  }, { passive: false });

  wrap.addEventListener('touchend', ()=>{ lastDist = null; });

  // ── ATTACH TO ALL IMAGES ──────────────────────────────────────────────────
  function attachToImages(){
    // Real images in product cards, catalog, modals
    document.querySelectorAll(
      '.product-img img, .modal-img img, .cat-item img, .cat-grid img, #catalogoGrid img'
    ).forEach(el=>{
      if(el.dataset.lb) return;
      el.dataset.lb = '1';
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', e=>{
        e.stopPropagation();
        openLightbox(el.src, el.alt);
      });
    });
  }

  // Run on load and after dynamic content (catalog loaded by productos.js)
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', attachToImages);
  } else {
    attachToImages();
  }
  // Also run after a short delay to catch dynamically rendered catalog
  setTimeout(attachToImages, 800);
  setTimeout(attachToImages, 2000);

})();
