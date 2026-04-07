// PERSONALIZATE — generado por Admin 6/4/2026, 09:10:09
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
  {img:"foto_1775477341753.jfif",label:"sticker lenceria",cat:"sticker",tag:"Sticker",color:"cyan"},
  {img:"foto_1775477354923.jfif",label:"sticker taller mecanico",cat:"sticker",tag:"Sticker",color:"cyan"},
  {img:"foto_1775477376095.jfif",label:"remera taller mecanico",cat:"remera",tag:"Remera",color:""},
  {img:"foto_1775477393774.jfif",label:"gorra deportivo rincon",cat:"gorra",tag:"Gorra",color:"green"},
];
function renderCatalogo(){
  const grid=document.getElementById('catalogoGrid');
  if(!grid)return;
  grid.replaceChildren();
  PRODUCTOS.forEach(p=>{
    const item=document.createElement('div');
    item.className='cat-item reveal';
    item.dataset.cat=p.cat;

    const img=document.createElement('img');
    img.src=p.img;
    img.alt=p.label;
    img.loading='lazy';
    img.decoding='async';

    const tag=document.createElement('div');
    tag.className='cat-item-tag'+(p.color?' '+p.color:'');
    tag.textContent=p.tag;

    const label=document.createElement('div');
    label.className='cat-item-label';
    label.textContent=p.label;

    item.append(img,tag,label);
    grid.appendChild(item);
  });
  const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*60);obs.unobserve(e.target);}});},{threshold:.06});
  grid.querySelectorAll('.cat-item.reveal').forEach(el=>obs.observe(el));
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',renderCatalogo);}else{renderCatalogo();}
