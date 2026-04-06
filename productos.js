// PERSONALIZATE — generado por Admin 11/3/2026, 10:20:28
const PRODUCTOS=[
  {img:"gallery_remera2.jpg",label:"Aji picante DTF",cat:"remera",tag:"Remera",color:""},
  {img:"gallery_remera5.jpg",label:"La Chorineta",cat:"remera",tag:"Remera",color:""},
  {img:"gallery_remera6.jpg",label:"Maradona — DIOS",cat:"remera",tag:"Remera",color:""},
  {img:"gallery_remera7.jpg",label:"Carros Food Truck",cat:"remera",tag:"Remera",color:""},
  {img:"gallery_bolsas.jpg",label:"Maradona espalda DTF",cat:"remera",tag:"Remera",color:""},
  {img:"gallery_gorras_pack.jpg",label:"Los Pollos Hermanos",cat:"remera",tag:"Remera",color:""},
  {img:"gallery_gorra2.jpg",label:"Power Clean",cat:"remera",tag:"Remera",color:""},
  {img:"gallery_gorra1.jpg",label:"Pack Fuerza Rionegrina",cat:"gorra",tag:"Gorra",color:"green"},
  {img:"gallery_pkg2.jpg",label:"Fuerza Federal DTF",cat:"gorra",tag:"Gorra",color:"green"},
  {img:"gallery_sticker1.jpg",label:"Sangre Negra Trucker",cat:"gorra",tag:"Gorra",color:"green"},
  {img:"gallery_gorra_bucket.jpg",label:"Bucket Hat Sangre Negra",cat:"gorra",tag:"Gorra",color:"green"},
  {img:"gallery_gorra_trucker2.jpg",label:"Trucker DTF INCRO",cat:"gorra",tag:"Gorra",color:"green"},
  {img:"gallery_remera3.jpg",label:"BG Servicio Tecnico",cat:"sticker",tag:"Sticker",color:"cyan"},
  {img:"gallery_remera4.jpg",label:"Bolsas personalizadas",cat:"otro",tag:"Otro",color:"purple"},
  {img:"gallery_pullover1.jpg",label:"Pullover Sangre Negra",cat:"otro",tag:"Pullover",color:"purple"},
  {img:"foto_1773234862492.png",label:"Deportivo rincón",cat:"gorra",tag:"Gorra",color:"green"},
];
function renderCatalogo(){
  const grid=document.getElementById('catalogoGrid');
  if(!grid)return;
  grid.innerHTML=PRODUCTOS.map(p=>`<div class="cat-item reveal" data-cat="${p.cat}"><img src="${p.img}" alt="${p.label}" loading="lazy"><div class="cat-item-tag${p.color?' '+p.color:''}">${p.tag}</div><div class="cat-item-label">${p.label}</div></div>`).join('');
  const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*60);obs.unobserve(e.target);}});},{threshold:.06});
  grid.querySelectorAll('.cat-item.reveal').forEach(el=>obs.observe(el));
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',renderCatalogo);}else{renderCatalogo();}
