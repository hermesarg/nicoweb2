// ═══════════════════════════════════════════════════════
//  PERSONALIZATE — Catálogo de productos
//  Editá este archivo para agregar, quitar o modificar
//  items del catálogo. Después subilo a GitHub.
//
//  Campos:
//    img    → nombre del archivo de imagen (en la misma carpeta)
//    label  → texto que aparece en la tarjeta
//    cat    → "remera" | "gorra" | "sticker" | "otro"
//    tag    → texto del badge de color (ej: "Remera", "Gorra")
//    color  → clase CSS del badge: "" | "green" | "cyan" | "orange" | "purple"
// ═══════════════════════════════════════════════════════

const PRODUCTOS = [

  // ── REMERAS ──────────────────────────────────────────
  { img: "gallery_remera2.jpg",      label: "Aji picante DTF",       cat: "remera",  tag: "Remera",  color: "" },
  { img: "gallery_remera5.jpg",      label: "La Chorineta",          cat: "remera",  tag: "Remera",  color: "" },
  { img: "gallery_remera6.jpg",      label: "Maradona — DIOS",       cat: "remera",  tag: "Remera",  color: "" },
  { img: "gallery_remera7.jpg",      label: "Carros Food Truck",     cat: "remera",  tag: "Remera",  color: "" },
  { img: "gallery_bolsas.jpg",       label: "Maradona espalda DTF",  cat: "remera",  tag: "Remera",  color: "" },
  { img: "gallery_gorras_pack.jpg",  label: "Los Pollos Hermanos",   cat: "remera",  tag: "Remera",  color: "" },
  { img: "gallery_gorra2.jpg",       label: "Power Clean",           cat: "remera",  tag: "Remera",  color: "" },

  // ── GORRAS ───────────────────────────────────────────
  { img: "gallery_gorra1.jpg",         label: "Pack Fuerza Rionegrina",   cat: "gorra",   tag: "Gorra",   color: "green" },
  { img: "gallery_pkg2.jpg",           label: "Fuerza Federal DTF",       cat: "gorra",   tag: "Gorra",   color: "green" },
  { img: "gallery_sticker1.jpg",       label: "Sangre Negra Trucker",     cat: "gorra",   tag: "Gorra",   color: "green" },
  { img: "gallery_gorra_bucket.jpg",   label: "Bucket Hat Sangre Negra",  cat: "gorra",   tag: "Gorra",   color: "green" },
  { img: "gallery_gorra_trucker2.jpg", label: "Trucker DTF INCRO",        cat: "gorra",   tag: "Gorra",   color: "green" },

  // ── STICKERS ─────────────────────────────────────────
  { img: "gallery_remera3.jpg",      label: "BG Servicio Tecnico",   cat: "sticker", tag: "Sticker", color: "cyan" },

  // ── OTROS ────────────────────────────────────────────
  { img: "gallery_remera4.jpg",      label: "Bolsas personalizadas", cat: "otro",    tag: "Bolsa",   color: "orange" },
  { img: "gallery_pullover1.jpg",    label: "Pullover Sangre Negra", cat: "otro",    tag: "Pullover",color: "purple" },

];

// ═══════════════════════════════════════════════════════
//  Render — NO toques esto
// ═══════════════════════════════════════════════════════
function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTOS.map(p => `
    <div class="cat-item reveal" data-cat="${p.cat}">
      <img src="${p.img}" alt="${p.label}" loading="lazy">
      <div class="cat-item-tag${p.color ? ' ' + p.color : ''}">${p.tag}</div>
      <div class="cat-item-label">${p.label}</div>
    </div>
  `).join('');

  // Re-attach reveal observer
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });
  grid.querySelectorAll('.cat-item.reveal').forEach(el => obs.observe(el));
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderCatalogo);
} else {
  renderCatalogo();
}
