// PERSONALIZATE - visor de imagenes con zoom tactil
(function(){
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  const style = document.createElement('style');
  style.textContent = `
    #lb-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      grid-template-rows: auto 1fr auto;
      background: rgba(0,0,0,.96);
      opacity: 0;
      pointer-events: none;
      transition: opacity .22s ease;
      overscroll-behavior: contain;
      touch-action: none;
    }
    #lb-overlay.open { opacity: 1; pointer-events: all; }
    #lb-toolbar {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .75rem;
      padding: max(.85rem, env(safe-area-inset-top)) max(.9rem, env(safe-area-inset-right)) .75rem max(.9rem, env(safe-area-inset-left));
      background: linear-gradient(180deg, rgba(0,0,0,.86), rgba(0,0,0,0));
      pointer-events: none;
    }
    #lb-title {
      min-width: 0;
      color: rgba(255,255,255,.72);
      font: 700 .78rem/1.35 'DM Sans', 'Nunito', system-ui, sans-serif;
      letter-spacing: .08em;
      text-transform: uppercase;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      pointer-events: none;
    }
    #lb-close {
      pointer-events: all;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: .45rem;
      min-width: 94px;
      height: 42px;
      padding: 0 .95rem;
      border: 1px solid rgba(255,255,255,.24);
      border-radius: 8px;
      background: rgba(255,255,255,.11);
      color: #fff;
      font: 800 .78rem/1 'DM Sans', 'Nunito', system-ui, sans-serif;
      letter-spacing: .08em;
      text-transform: uppercase;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    #lb-close:hover,
    #lb-close:focus-visible {
      background: #ff2d9b;
      border-color: #ff2d9b;
      outline: none;
    }
    #lb-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      cursor: zoom-in;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    #lb-wrap.zoomed { cursor: grab; }
    #lb-wrap.grabbing { cursor: grabbing; }
    #lb-img {
      display: block;
      width: auto;
      height: auto;
      max-width: calc(100vw - 28px);
      max-height: calc(100svh - 132px);
      object-fit: contain;
      object-position: center center;
      transform: translate3d(0,0,0) scale(1);
      transform-origin: center center;
      transition: transform .18s ease;
      user-select: none;
      -webkit-user-select: none;
      -webkit-user-drag: none;
      will-change: transform;
      border-radius: 6px;
      box-shadow: 0 24px 80px rgba(0,0,0,.55);
    }
    #lb-img.no-transition { transition: none; }
    #lb-footer {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .75rem;
      padding: .75rem max(.9rem, env(safe-area-inset-right)) max(.9rem, env(safe-area-inset-bottom)) max(.9rem, env(safe-area-inset-left));
      background: linear-gradient(0deg, rgba(0,0,0,.86), rgba(0,0,0,0));
      pointer-events: none;
    }
    #lb-hint {
      color: rgba(255,255,255,.48);
      font: 700 .68rem/1.35 'DM Sans', 'Nunito', system-ui, sans-serif;
      letter-spacing: .1em;
      text-transform: uppercase;
      transition: opacity .35s ease;
      pointer-events: none;
    }
    #lb-zoom-btns {
      display: flex;
      gap: .45rem;
      pointer-events: all;
    }
    #lb-zoom-btns button {
      width: 42px;
      height: 42px;
      border: 1px solid rgba(255,255,255,.24);
      border-radius: 8px;
      background: rgba(255,255,255,.11);
      color: #fff;
      font-size: 1.25rem;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    #lb-zoom-btns button:hover,
    #lb-zoom-btns button:focus-visible {
      background: rgba(255,45,155,.7);
      outline: none;
    }
    .cat-item img,
    .product-img img,
    .modal-img img {
      cursor: zoom-in !important;
    }
    @media (max-width: 640px) {
      #lb-overlay { grid-template-rows: auto 1fr auto; }
      #lb-close {
        min-width: 104px;
        height: 44px;
        background: rgba(255,45,155,.88);
        border-color: rgba(255,45,155,.95);
      }
      #lb-img {
        max-width: calc(100vw - 18px);
        max-height: calc(100svh - 150px);
        border-radius: 4px;
      }
      #lb-footer {
        align-items: flex-end;
      }
      #lb-hint {
        max-width: 58vw;
        font-size: .62rem;
      }
      #lb-zoom-btns button {
        width: 46px;
        height: 46px;
      }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div id="lb-toolbar">
      <div id="lb-title">Vista de imagen</div>
      <button id="lb-close" type="button" aria-label="Cerrar visor">Volver ✕</button>
    </div>
    <div id="lb-wrap">
      <img id="lb-img" src="" alt="">
    </div>
    <div id="lb-footer">
      <div id="lb-hint">Pellizcá o doble tap para acercar</div>
      <div id="lb-zoom-btns" aria-label="Controles de zoom">
        <button id="lb-zout" type="button" aria-label="Alejar">−</button>
        <button id="lb-zin" type="button" aria-label="Acercar">+</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const img = document.getElementById('lb-img');
  const wrap = document.getElementById('lb-wrap');
  const hint = document.getElementById('lb-hint');
  const title = document.getElementById('lb-title');
  const closeBtn = document.getElementById('lb-close');
  const zoomInBtn = document.getElementById('lb-zin');
  const zoomOutBtn = document.getElementById('lb-zout');

  let scale = 1;
  let tx = 0;
  let ty = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartTx = 0;
  let dragStartTy = 0;
  let lastTap = 0;
  let hintTimer = 0;

  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let pinchStartTx = 0;
  let pinchStartTy = 0;
  let pinchStartMidX = 0;
  let pinchStartMidY = 0;
  let panStartX = 0;
  let panStartY = 0;
  let panStartTx = 0;
  let panStartTy = 0;

  function viewportSize(){
    const vv = window.visualViewport;
    return {
      width: vv ? vv.width : window.innerWidth,
      height: vv ? vv.height : window.innerHeight
    };
  }

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function clampTranslate(){
    if(scale <= 1){
      tx = 0;
      ty = 0;
      return;
    }
    const rect = img.getBoundingClientRect();
    const baseWidth = rect.width / scale;
    const baseHeight = rect.height / scale;
    const view = viewportSize();
    const maxTx = Math.max(0, (baseWidth * scale - view.width + 32) / 2);
    const maxTy = Math.max(0, (baseHeight * scale - view.height + 150) / 2);
    tx = clamp(tx, -maxTx, maxTx);
    ty = clamp(ty, -maxTy, maxTy);
  }

  function applyTransform(animate){
    if(!animate) img.classList.add('no-transition');
    img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    wrap.classList.toggle('zoomed', scale > 1);
    if(!animate) requestAnimationFrame(()=>img.classList.remove('no-transition'));
  }

  function setZoom(nextScale, centerX, centerY, animate){
    const target = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    if(target === scale) return;

    if(target <= 1){
      scale = 1;
      tx = 0;
      ty = 0;
      applyTransform(animate);
      return;
    }

    const rect = img.getBoundingClientRect();
    const cx = Number.isFinite(centerX) ? centerX : rect.left + rect.width / 2;
    const cy = Number.isFinite(centerY) ? centerY : rect.top + rect.height / 2;
    const px = cx - (rect.left + rect.width / 2);
    const py = cy - (rect.top + rect.height / 2);
    const ratio = target / scale;

    tx = tx - px * (ratio - 1);
    ty = ty - py * (ratio - 1);
    scale = target;
    clampTranslate();
    applyTransform(animate);
  }

  function showHint(){
    clearTimeout(hintTimer);
    hint.style.opacity = '1';
    hintTimer = setTimeout(()=>{ hint.style.opacity = '.5'; }, 2800);
  }

  function resetView(){
    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform(false);
  }

  function openLightbox(src, alt){
    if(!src || src.startsWith('data:')) return;
    resetView();
    img.src = src;
    img.alt = alt || 'Imagen ampliada';
    title.textContent = alt || 'Vista de imagen';
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showHint();
    img.onload = function(){
      resetView();
    };
    closeBtn.focus({preventScroll:true});
  }

  function closeLightbox(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearTimeout(hintTimer);
    setTimeout(()=>{
      if(!overlay.classList.contains('open')) img.src = '';
    }, 220);
  }

  closeBtn.addEventListener('click', closeLightbox);
  zoomInBtn.addEventListener('click', ()=>setZoom(scale * 1.5, null, null, true));
  zoomOutBtn.addEventListener('click', ()=>setZoom(scale / 1.5, null, null, true));

  overlay.addEventListener('click', e=>{
    if(e.target === wrap && scale === 1) closeLightbox();
  });

  document.addEventListener('keydown', e=>{
    if(!overlay.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === '+' || e.key === '=') setZoom(scale * 1.25, null, null, true);
    if(e.key === '-' || e.key === '_') setZoom(scale / 1.25, null, null, true);
  });

  wrap.addEventListener('wheel', e=>{
    if(!overlay.classList.contains('open')) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? .88 : 1.14;
    setZoom(scale * factor, e.clientX, e.clientY, true);
  }, {passive:false});

  wrap.addEventListener('dblclick', e=>{
    e.preventDefault();
    setZoom(scale > 1 ? 1 : 2.35, e.clientX, e.clientY, true);
    showHint();
  });

  wrap.addEventListener('mousedown', e=>{
    if(scale <= 1 || e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartTx = tx;
    dragStartTy = ty;
    wrap.classList.add('grabbing');
    e.preventDefault();
  });

  window.addEventListener('mousemove', e=>{
    if(!isDragging) return;
    tx = dragStartTx + (e.clientX - dragStartX);
    ty = dragStartTy + (e.clientY - dragStartY);
    clampTranslate();
    applyTransform(false);
  });

  window.addEventListener('mouseup', ()=>{
    isDragging = false;
    wrap.classList.remove('grabbing');
  });

  function touchDistance(touches){
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  }

  function touchMidpoint(touches){
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  wrap.addEventListener('touchstart', e=>{
    if(!overlay.classList.contains('open')) return;

    if(e.touches.length === 2){
      e.preventDefault();
      const mid = touchMidpoint(e.touches);
      pinchStartDistance = touchDistance(e.touches);
      pinchStartScale = scale;
      pinchStartTx = tx;
      pinchStartTy = ty;
      pinchStartMidX = mid.x;
      pinchStartMidY = mid.y;
      return;
    }

    if(e.touches.length === 1){
      const touch = e.touches[0];
      panStartX = touch.clientX;
      panStartY = touch.clientY;
      panStartTx = tx;
      panStartTy = ty;

      const now = Date.now();
      if(now - lastTap < 320){
        e.preventDefault();
        setZoom(scale > 1 ? 1 : 2.35, touch.clientX, touch.clientY, true);
        showHint();
        lastTap = 0;
      } else {
        lastTap = now;
      }
    }
  }, {passive:false});

  wrap.addEventListener('touchmove', e=>{
    if(!overlay.classList.contains('open')) return;

    if(e.touches.length === 2 && pinchStartDistance){
      e.preventDefault();
      const mid = touchMidpoint(e.touches);
      const distance = touchDistance(e.touches);
      scale = clamp(pinchStartScale * (distance / pinchStartDistance), MIN_SCALE, MAX_SCALE);
      tx = pinchStartTx + (mid.x - pinchStartMidX);
      ty = pinchStartTy + (mid.y - pinchStartMidY);
      clampTranslate();
      applyTransform(false);
      return;
    }

    if(e.touches.length === 1 && scale > 1){
      e.preventDefault();
      const touch = e.touches[0];
      tx = panStartTx + (touch.clientX - panStartX);
      ty = panStartTy + (touch.clientY - panStartY);
      clampTranslate();
      applyTransform(false);
    }
  }, {passive:false});

  wrap.addEventListener('touchend', e=>{
    if(e.touches.length < 2) pinchStartDistance = 0;
    if(e.touches.length === 1){
      const touch = e.touches[0];
      panStartX = touch.clientX;
      panStartY = touch.clientY;
      panStartTx = tx;
      panStartTy = ty;
    }
  });

  window.addEventListener('resize', ()=>{
    if(!overlay.classList.contains('open')) return;
    clampTranslate();
    applyTransform(false);
  });

  function attachToImages(){
    document.querySelectorAll(
      '.product-img img, .modal-img img, .cat-item img, .cat-grid img, #catalogoGrid img'
    ).forEach(el=>{
      if(el.dataset.lb) return;
      el.dataset.lb = '1';
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', e=>{
        e.stopPropagation();
        openLightbox(el.currentSrc || el.src, el.alt);
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', attachToImages);
  } else {
    attachToImages();
  }
  setTimeout(attachToImages, 800);
  setTimeout(attachToImages, 2000);
})();
