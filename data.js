// STYLE — shared product catalog used by index.html, shop.html, product.html, tryon.html
const PRODUCTS = [
  { id:'korean-blazer',       name:'Korean Blazer',        price:299000, category:'fashion',     emoji:'🧥', color:'#2b2b2b', desc:'Blazer oversized ala Korea, cocok untuk tampilan kasual maupun semi-formal.' },
  { id:'flowy-dress',         name:'Flowy Dress',          price:249000, category:'fashion',     emoji:'👗', color:'#c98793', desc:'Dress flowy yang ringan dan nyaman, ideal untuk acara santai maupun photoshoot.' },
  { id:'pleated-skirt',       name:'Pleated Skirt',        price:249000, category:'fashion',     emoji:'👘', color:'#7c6a58', desc:'Rok pleated dengan potongan rapi, mudah dipadukan dengan atasan apa pun.' },
  { id:'oversized-blazer',    name:'Oversized Blazer',     price:399000, category:'fashion',     emoji:'🧥', color:'#3a3a3a', desc:'Blazer oversized untuk tampilan profesional yang tetap santai.' },
  { id:'white-sneakers',      name:'White Sneakers',       price:299000, category:'fashion',     emoji:'👟', color:'#f2f2f2', desc:'Sneakers putih serbaguna, cocok untuk gaya kasual sehari-hari.' },
  { id:'wide-trousers',       name:'Wide Trousers',        price:279000, category:'fashion',     emoji:'👖', color:'#4a4a4a', desc:'Celana wide-leg yang nyaman dipakai seharian tanpa mengurangi gaya.' },
  { id:'coral-lipstick',      name:'Coral Nude Lipstick',  price:149000, category:'makeup',      emoji:'💄', color:'#c9776b', desc:'Lipstick shade coral nude, cocok untuk kulit sawo matang hingga terang.' },
  { id:'glow-cushion',        name:'Glow Cushion',         price:189000, category:'makeup',      emoji:'🧴', color:'#e8c39e', desc:'Cushion dengan hasil akhir glowing dan coverage medium.' },
  { id:'peach-blush',         name:'Peach Blush',          price:129000, category:'makeup',      emoji:'🌸', color:'#f4a89e', desc:'Blush on warna peach untuk kesan segar dan natural.' },
  { id:'canvas-bag',          name:'Canvas Bag',           price:159000, category:'accessories', emoji:'👜', color:'#9c8465', desc:'Tas canvas kasual, cukup luas untuk kebutuhan harian.' },
  { id:'shoulder-bag',        name:'Shoulder Bag',         price:199000, category:'accessories', emoji:'👜', color:'#6b5b48', desc:'Tas selempang minimalis, cocok untuk tampilan formal maupun kasual.' },
  { id:'statement-necklace',  name:'Statement Necklace',   price:129000, category:'accessories', emoji:'📿', color:'#d4af37', desc:'Kalung statement untuk mempercantik tampilan outfit-mu.' },
  { id:'round-glasses',       name:'Round Glasses',        price:179000, category:'accessories', emoji:'🕶️', color:'#333333', desc:'Kacamata bulat bergaya retro, cocok untuk berbagai bentuk wajah.' },
  { id:'classic-watch',       name:'Classic Watch',        price:349000, category:'accessories', emoji:'⌚', color:'#222222', desc:'Jam tangan klasik yang menambah kesan profesional.' },
  { id:'pearl-earrings',      name:'Pearl Earrings',       price:99000,  category:'accessories', emoji:'💎', color:'#eeeeee', desc:'Anting mutiara elegan untuk berbagai kesempatan.' },
];

const CATEGORY_LABEL = { fashion:'Fashion', makeup:'Makeup', accessories:'Accessories' };

// Static example "look" — mirrors the items shown on mixmatch.html — used when
// checkout is entered via "Buy All Items" instead of a single product.
const DEMO_LOOK = [
  { name:'Oversized Blazer',    price:399000, emoji:'🧥', color:'#3a3a3a' },
  { name:'Pleated Skirt',       price:249000, emoji:'👘', color:'#7c6a58' },
  { name:'Shoulder Bag',        price:199000, emoji:'👜', color:'#6b5b48' },
  { name:'White Sneakers',      price:299000, emoji:'👟', color:'#f2f2f2' },
  { name:'Coral Nude Lipstick', price:149000, emoji:'💄', color:'#c9776b' },
];
const SHIPPING_FEE = 15000;

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}
function formatPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
// Resolves the order.html / order-confirmation.html query params (?type=item&id=..
// or ?type=look) into a list of {name, price, emoji, color} line items.
function resolveOrderItems() {
  if (getQueryParam('type') === 'item') {
    const p = getProduct(getQueryParam('id'));
    return p ? [p] : DEMO_LOOK;
  }
  return DEMO_LOOK;
}
