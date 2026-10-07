export const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const defaultSettings = {
  storeName: "Lumen Wear",
  freeShippingOver: 120,
  announcement: "Free shipping on orders over $120 · 30-day free returns",
  currency: "$",
};
export type Settings = typeof defaultSettings;

export const discountCodes: Record<string, number> = { LUMEN10: .1, WELCOME15: .15 };

export const formatPrice = (n: number) => `$${n.toFixed(2)}`;

/* ---------------------------------- Catalogue ---------------------------------- */

export type Category = { slug: string; name: string; image: string; blurb: string; types: string[] };

export const categories: Category[] = [
  { slug: "women", name: "Women", image: img("1515886657613-9f3515b0c78f"), blurb: "Dresses, knits & tailoring", types: ["Dresses", "Outerwear", "Knitwear", "Bottoms", "Tops"] },
  { slug: "men", name: "Men", image: img("1617137968427-85924c800a22"), blurb: "Shirts, suits & denim", types: ["Tops", "Shirts", "Outerwear", "Suits", "Bottoms"] },
  { slug: "shoes", name: "Shoes", image: img("1549298916-b41d501d3772"), blurb: "Sneakers & leather boots", types: ["Sneakers", "Boots"] },
  { slug: "accessories", name: "Accessories", image: img("1584917865442-de89df76afd3"), blurb: "Bags, caps, eyewear & watches", types: ["Bags", "Caps", "Eyewear", "Watches", "Small leather"] },
];

export type Color = { name: string; hex: string };
export type Product = {
  id: number; slug: string; name: string; category: string; type: string;
  price: number; compareAt?: number; rating: number; reviews: number; sold: number; createdAt: string;
  featured?: boolean; badge?: "New" | "Bestseller" | "Limited";
  colors: Color[]; sizes: string[]; images: string[]; stock: number; description: string; details: string[];
};

const A = ["XS", "S", "M", "L", "XL"];
const SH = ["38", "39", "40", "41", "42", "43", "44"];
const W = ["28", "30", "32", "34", "36"];
const ONE = ["One size"];
const c = (name: string, hex: string): Color => ({ name, hex });
const i = (...ids: string[]) => ids.map((x) => img(x));

let n = 0;
const p = (d: Omit<Product, "id" | "slug"> & { slug?: string }): Product => ({ ...d, id: ++n, slug: d.slug ?? d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") });

export const seedProducts: Product[] = [
  // Men
  p({ name: "Essential Cotton Tee", category: "men", type: "Tops", price: 32, rating: 4.7, reviews: 214, sold: 1840, createdAt: "2026-06-02", badge: "Bestseller", featured: true, stock: 120,
    colors: [c("White", "#f5f5f4"), c("Black", "#1c1917"), c("Heather", "#a8b3bd")], sizes: A, images: i("1521572163474-6864f9cf17ab", "1618354691373-d851c5c3a990", "1564584217132-2271feaeb3c5"),
    description: "A heavyweight 220gsm organic cotton tee with a relaxed shoulder and a neckline that keeps its shape wash after wash.", details: ["100% organic cotton", "Relaxed fit", "Pre-shrunk", "Machine wash cold"] }),
  p({ name: "Graphic Heavy Tee", category: "men", type: "Tops", price: 38, rating: 4.5, reviews: 96, sold: 760, createdAt: "2026-09-12", badge: "New", stock: 64,
    colors: [c("Stone", "#e7e1d6"), c("Black", "#1c1917")], sizes: A, images: i("1576566588028-4147f3842f27", "1583743814966-8936f5b7be1a", "1503341504253-dff4815485f1"),
    description: "Boxy-fit heavyweight jersey with a soft-hand screen print. Built for layering or wearing solo.", details: ["240gsm cotton jersey", "Boxy fit", "Water-based inks", "Wash inside out"] }),
  p({ name: "Moto Leather Jacket", category: "men", type: "Outerwear", price: 289, compareAt: 349, rating: 4.9, reviews: 88, sold: 310, createdAt: "2026-03-18", featured: true, stock: 16,
    colors: [c("Black", "#1c1917"), c("Cognac", "#9a5b34")], sizes: A, images: i("1551028719-00167b16eac5", "1490114538077-0a7f8cb49891", "1507679799987-c73779587ccf"),
    description: "Supple lambskin with an asymmetric zip, quilted shoulders and a satin lining. Made to age beautifully.", details: ["Genuine lambskin", "YKK hardware", "Two zip pockets", "Professional leather clean"] }),
  p({ name: "Suede Bomber Jacket", category: "men", type: "Outerwear", price: 198, rating: 4.6, reviews: 57, sold: 220, createdAt: "2026-08-21", badge: "New", stock: 22,
    colors: [c("Rust", "#a4532f"), c("Olive", "#5b6b45")], sizes: A, images: i("1591047139829-d91aecb6caea", "1544022613-e87ca75a784a", "1490114538077-0a7f8cb49891"),
    description: "Brushed suede bomber with ribbed trims and a lightweight quilted lining for transitional weather.", details: ["Goat suede shell", "Rib-knit trims", "Inner pocket", "Specialist clean"] }),
  p({ name: "Straight Leg Denim", category: "men", type: "Bottoms", price: 89, rating: 4.6, reviews: 167, sold: 1210, createdAt: "2026-02-10", stock: 64,
    colors: [c("Indigo", "#2f3e63"), c("Light Wash", "#8aa3c2")], sizes: W, images: i("1542272604-787c3835535d", "1604176354204-9268737828e4", "1541099649105-f69ad21f3246"),
    description: "A timeless straight leg in rigid selvedge denim that softens and moulds to you over time.", details: ["13.5oz selvedge denim", "Mid rise", "Button fly", "Wash inside out"] }),
  p({ name: "Slim Chino Trousers", category: "men", type: "Bottoms", price: 74, rating: 4.5, reviews: 132, sold: 980, createdAt: "2026-05-04", stock: 70,
    colors: [c("Khaki", "#b9a27c"), c("Navy", "#1e2a44")], sizes: W, images: i("1473966968600-fa801b869a1a", "1593030761757-71fae45fa0e7", "1604176354204-9268737828e4"),
    description: "Garment-dyed stretch twill chinos with a tapered leg — sharp enough for the office, easy for weekends.", details: ["98% cotton, 2% elastane", "Slim tapered fit", "Garment dyed", "Machine wash"] }),
  p({ name: "Oxford Button Down", category: "men", type: "Shirts", price: 68, rating: 4.6, reviews: 141, sold: 870, createdAt: "2026-04-14", stock: 58,
    colors: [c("Sky", "#a9c4e0"), c("White", "#f5f5f4")], sizes: A, images: i("1598033129183-c4f50c736f10", "1602810318383-e386cc2a3ccf", "1596755094514-f87e34085b2c"),
    description: "Classic oxford cloth with a soft button-down collar and a tailored yet comfortable body.", details: ["100% cotton oxford", "Regular fit", "Chest pocket", "Machine wash warm"] }),
  p({ name: "Plaid Flannel Overshirt", category: "men", type: "Shirts", price: 82, rating: 4.7, reviews: 73, sold: 410, createdAt: "2026-09-25", badge: "New", stock: 34,
    colors: [c("Mustard Plaid", "#c49a3a"), c("Forest Plaid", "#2f5a3f")], sizes: A, images: i("1607345366928-199ea26cfe3e", "1490114538077-0a7f8cb49891", "1602810318383-e386cc2a3ccf"),
    description: "Brushed cotton flannel cut as an overshirt — wear it buttoned or open over a tee.", details: ["Brushed cotton flannel", "Relaxed fit", "Two flap pockets", "Machine wash"] }),
  p({ name: "Tailored Check Suit", category: "men", type: "Suits", price: 420, compareAt: 520, rating: 4.8, reviews: 41, sold: 120, createdAt: "2026-01-22", featured: true, badge: "Limited", stock: 9,
    colors: [c("Blue Check", "#3a5a8c"), c("Navy", "#1e2a44")], sizes: ["46", "48", "50", "52", "54"], images: i("1594938298603-c8148c4dae35", "1617137968427-85924c800a22", "1507679799987-c73779587ccf"),
    description: "Half-canvassed two-piece suit in Italian wool with a softly structured shoulder.", details: ["100% Italian wool", "Half-canvas construction", "Flat-front trousers", "Dry clean only"] }),
  p({ name: "Everyday Crew Sweatshirt", category: "men", type: "Tops", price: 64, rating: 4.6, reviews: 118, sold: 690, createdAt: "2026-07-08", stock: 88,
    colors: [c("Chalk", "#f2efe9"), c("Charcoal", "#3f3f46")], sizes: A, images: i("1620799140408-edc6dcb6d633", "1576871337622-98d48d1cf531", "1562157873-818bc0726f68"),
    description: "Loopback French terry crewneck with a clean, minimal finish and a comfortable regular fit.", details: ["Organic cotton terry", "Regular fit", "Ribbed cuffs", "Machine wash"] }),
  // Women
  p({ name: "Cloud Fleece Hoodie", category: "women", type: "Tops", price: 74, rating: 4.8, reviews: 302, sold: 2010, createdAt: "2026-09-02", badge: "Bestseller", featured: true, stock: 75,
    colors: [c("Oat", "#d6c7ae"), c("Tangerine", "#e0782f"), c("Charcoal", "#3f3f46")], sizes: A, images: i("1556821840-3a63f95609a7", "1578587018452-892bacefd3f2", "1620799140408-edc6dcb6d633"),
    description: "Brushed-back fleece with a roomy hood and dropped shoulders — the one you'll reach for every day.", details: ["80% cotton, 20% recycled polyester", "Oversized fit", "Kangaroo pocket", "Machine wash"] }),
  p({ name: "Linen Wrap Dress", category: "women", type: "Dresses", price: 128, rating: 4.7, reviews: 96, sold: 520, createdAt: "2026-08-30", badge: "New", stock: 32,
    colors: [c("Poppy", "#d64545"), c("Rose Print", "#d4766b")], sizes: A, images: i("1595777457583-95e059d581b8", "1572804013309-59a88b7e92f1", "1550614000-4895a10e1bfd"),
    description: "Breezy European linen in a flattering wrap silhouette with a tie waist and flutter sleeves.", details: ["100% European linen", "Midi length", "Adjustable tie", "Gentle cycle"] }),
  p({ name: "Evening Satin Slip", category: "women", type: "Dresses", price: 145, compareAt: 180, rating: 4.5, reviews: 54, sold: 260, createdAt: "2026-04-02", stock: 22,
    colors: [c("Champagne", "#e6d3b3"), c("Emerald", "#1f5e4a")], sizes: A, images: i("1566174053879-31528523f8ae", "1509631179647-0177331693ae", "1469334031218-e382a71b716b"),
    description: "A bias-cut satin slip that skims the body, finished with delicate adjustable straps.", details: ["Recycled satin", "Bias cut", "Adjustable straps", "Dry clean recommended"] }),
  p({ name: "Wool Blend Coat", category: "women", type: "Outerwear", price: 249, rating: 4.9, reviews: 73, sold: 340, createdAt: "2026-02-26", badge: "Bestseller", featured: true, stock: 14,
    colors: [c("Camel", "#b88a5a"), c("Tartan", "#2f3b55")], sizes: A, images: i("1539533018447-63fcce2678e3", "1485968579580-b6d095142e6e", "1539109136881-3be0616acf4b"),
    description: "A double-faced wool blend coat with a softly tailored shoulder and generous lapels.", details: ["70% wool, 30% polyamide", "Fully lined", "Single breasted", "Dry clean only"] }),
  p({ name: "Houndstooth Blazer", category: "women", type: "Outerwear", price: 168, compareAt: 210, rating: 4.6, reviews: 48, sold: 190, createdAt: "2026-03-11", stock: 19,
    colors: [c("Black & White", "#6b6b6b"), c("Camel", "#b88a5a")], sizes: A, images: i("1525450824786-227cbef70703", "1515886657613-9f3515b0c78f", "1529139574466-a303027c1d8b"),
    description: "A relaxed single-breasted blazer in classic houndstooth, cut slightly oversized for easy layering.", details: ["Wool-blend tweed", "Relaxed fit", "Flap pockets", "Dry clean only"] }),
  p({ name: "Utility Field Jacket", category: "women", type: "Outerwear", price: 138, rating: 4.7, reviews: 66, sold: 300, createdAt: "2026-09-18", badge: "New", stock: 28,
    colors: [c("Olive", "#5b6b45"), c("Black", "#1c1917")], sizes: A, images: i("1544022613-e87ca75a784a", "1529139574466-a303027c1d8b", "1591047139829-d91aecb6caea"),
    description: "Washed cotton canvas field jacket with four cargo pockets and an adjustable drawcord waist.", details: ["Washed cotton canvas", "Regular fit", "Four cargo pockets", "Machine wash"] }),
  p({ name: "Chunky Knit Sweater", category: "women", type: "Knitwear", price: 96, rating: 4.8, reviews: 121, sold: 640, createdAt: "2026-09-28", badge: "New", featured: true, stock: 40,
    colors: [c("Cream", "#efe6d2"), c("Tangerine", "#e0782f")], sizes: A, images: i("1624623278313-a930126a11c3", "1578587018452-892bacefd3f2", "1576871337622-98d48d1cf531"),
    description: "Hand-feel chunky rib knit in a soft wool-alpaca blend with a relaxed, slouchy silhouette.", details: ["Wool & alpaca blend", "Relaxed fit", "Ribbed hem", "Hand wash cold"] }),
  p({ name: "Pleated Jogger Trousers", category: "women", type: "Bottoms", price: 88, rating: 4.4, reviews: 39, sold: 210, createdAt: "2026-06-19", stock: 36,
    colors: [c("Blush", "#d8a7a0"), c("Black", "#1c1917")], sizes: A, images: i("1594633312681-425c7b97ccd1", "1509631179647-0177331693ae", "1469334031218-e382a71b716b"),
    description: "Fluid crepe trousers with front pleats, slant pockets and elasticated cuffs for an easy, polished look.", details: ["Recycled crepe", "High rise", "Elastic cuffs", "Machine wash cold"] }),
  p({ name: "Vintage Denim Shorts", category: "women", type: "Bottoms", price: 54, compareAt: 68, rating: 4.3, reviews: 82, sold: 450, createdAt: "2026-05-15", stock: 48,
    colors: [c("Light Wash", "#a8c0dc")], sizes: ["24", "26", "28", "30", "32"], images: i("1591195853828-11db59a44f6b", "1516762689617-e1cffcef479d", "1604176354204-9268737828e4"),
    description: "High-rise cut-offs in rigid vintage-wash denim with a lightly frayed hem.", details: ["100% cotton denim", "High rise", "Frayed hem", "Wash inside out"] }),
  // Shoes
  p({ name: "Everyday Runner Sneaker", category: "shoes", type: "Sneakers", price: 120, rating: 4.8, reviews: 412, sold: 2600, createdAt: "2026-07-22", badge: "Bestseller", featured: true, stock: 90,
    colors: [c("Multi", "#e8d6c2"), c("Ivory", "#f3efe7")], sizes: SH, images: i("1560769629-975ec94e6a86", "1525507119028-ed4c629a60a3", "1549298916-b41d501d3772"),
    description: "Lightweight knit upper on a responsive foam sole, designed for long days on your feet.", details: ["Recycled knit upper", "Foam midsole", "Removable insole", "Wipe clean"] }),
  p({ name: "Court Leather Sneaker", category: "shoes", type: "Sneakers", price: 110, rating: 4.6, reviews: 188, sold: 1100, createdAt: "2026-04-28", stock: 52,
    colors: [c("White", "#f5f5f4"), c("Tan", "#a8703f")], sizes: SH, images: i("1608231387042-66d1773070a5", "1549298916-b41d501d3772", "1525507119028-ed4c629a60a3"),
    description: "Minimal low-top in smooth full-grain leather with a cupsole built to last.", details: ["Full-grain leather", "Rubber cupsole", "Leather lining", "Wipe clean"] }),
  p({ name: "Rugged Lace-Up Boot", category: "shoes", type: "Boots", price: 185, compareAt: 220, rating: 4.7, reviews: 97, sold: 380, createdAt: "2026-01-30", stock: 18,
    colors: [c("Brown", "#7a4a2a")], sizes: SH, images: i("1520639888713-7851133b1ed0", "1549298916-b41d501d3772", "1516762689617-e1cffcef479d"),
    description: "Waxed leather work boot with a Goodyear-welted lug sole — resoleable for years of wear.", details: ["Waxed leather", "Goodyear welt", "Lug sole", "Condition regularly"] }),
  // Accessories
  p({ name: "Canvas Day Backpack", category: "accessories", type: "Bags", price: 95, rating: 4.7, reviews: 129, sold: 720, createdAt: "2026-03-05", stock: 40,
    colors: [c("Olive", "#5b6b45"), c("Sand", "#cdb994")], sizes: ONE, images: i("1553062407-98eeb64c6a62", "1590874103328-eac38a683ce7", "1584917865442-de89df76afd3"),
    description: "Waxed canvas backpack with leather trims, a padded laptop sleeve and plenty of pockets.", details: ["Waxed cotton canvas", "Fits 15\" laptop", "Leather trims", "Spot clean"] }),
  p({ name: "Woven Leather Handbag", category: "accessories", type: "Bags", price: 210, compareAt: 260, rating: 4.8, reviews: 61, sold: 240, createdAt: "2026-08-08", featured: true, stock: 12,
    colors: [c("Apricot", "#e3955e"), c("Tan", "#a8703f")], sizes: ONE, images: i("1590874103328-eac38a683ce7", "1584917865442-de89df76afd3", "1553062407-98eeb64c6a62"),
    description: "Structured top-handle bag with a hand-woven body, polished hardware and a detachable strap.", details: ["Full-grain leather", "Magnetic closure", "Detachable strap", "Condition regularly"] }),
  p({ name: "Washed Baseball Cap", category: "accessories", type: "Caps", price: 28, rating: 4.5, reviews: 87, sold: 930, createdAt: "2026-09-30", badge: "New", stock: 150,
    colors: [c("Slate", "#5d6670"), c("White", "#f5f5f4")], sizes: ONE, images: i("1521369909029-2afed882baee", "1588850561407-ed78c282e89b", "1622445275576-721325763afe"),
    description: "Six-panel washed cotton cap with an adjustable brass buckle strap.", details: ["Washed cotton twill", "Adjustable strap", "Curved brim", "Hand wash"] }),
  p({ name: "Round Metal Sunglasses", category: "accessories", type: "Eyewear", price: 79, rating: 4.6, reviews: 74, sold: 510, createdAt: "2026-06-11", stock: 60,
    colors: [c("Gold / Green", "#b49a55"), c("Black", "#1c1917")], sizes: ONE, images: i("1511499767150-a48a237f0083", "1572635196237-14b3f281503f", "1469334031218-e382a71b716b"),
    description: "Lightweight round frames with polarised lenses and adjustable nose pads.", details: ["Stainless steel frame", "Polarised UV400 lenses", "Case included", "Wipe with cloth"] }),
  p({ name: "Steel Chronograph Watch", category: "accessories", type: "Watches", price: 260, rating: 4.9, reviews: 35, sold: 140, createdAt: "2026-02-14", badge: "Limited", stock: 7,
    colors: [c("Navy Dial", "#1e2a44")], sizes: ONE, images: i("1523170335258-f5ed11844a49", "1507679799987-c73779587ccf", "1617137968427-85924c800a22"),
    description: "Brushed steel chronograph with a sapphire crystal and 100m water resistance.", details: ["316L stainless steel", "Sapphire crystal", "100m water resistant", "2-year warranty"] }),
  p({ name: "Leather Bifold Wallet", category: "accessories", type: "Small leather", price: 45, rating: 4.7, reviews: 102, sold: 860, createdAt: "2026-05-27", stock: 95,
    colors: [c("Chestnut", "#7a4a2a")], sizes: ONE, images: i("1627123424574-724758594e93", "1584917865442-de89df76afd3", "1553062407-98eeb64c6a62"),
    description: "Slim vegetable-tanned leather bifold with six card slots and a note compartment.", details: ["Veg-tanned leather", "6 card slots", "Hand-stitched edges", "Condition occasionally"] }),
];

/* ---------------------------------- Content ---------------------------------- */

export const banners = {
  hero: [
    { title: "The Autumn Edit", subtitle: "Layer up in soft wool, rich leather and warm neutrals.", image: img("1445205170230-053b83016050", 1800), cta: "Shop women", href: "/ecommerce/shop?category=women" },
    { title: "Built to Last", subtitle: "Wardrobe staples crafted from honest materials.", image: img("1490481651871-ab68de25d43d", 1800), cta: "Shop men", href: "/ecommerce/shop?category=men" },
    { title: "Step Lighter", subtitle: "New sneakers and boots designed for all-day comfort.", image: img("1441984904996-e0b6ba687e04", 1800), cta: "Shop shoes", href: "/ecommerce/shop?category=shoes" },
  ],
  promo: img("1483985988355-763728e1935b", 1600),
  story: img("1523381210434-271e8be1f52b", 1200),
  about: img("1489987707025-afc232f7ea0f", 1600),
  folded: img("1562157873-818bc0726f68", 1200),
};

export const testimonials = [
  { name: "Aarati S.", product: "Cloud Fleece Hoodie", text: "Unbelievably soft and it arrived in plastic-free packaging. Already ordered a second colour.", rating: 5 },
  { name: "Marcus L.", product: "Straight Leg Denim", text: "Finally denim that fits right out of the box. The selvedge detail is a lovely touch.", rating: 5 },
  { name: "Priya K.", product: "Wool Blend Coat", text: "Looks twice its price. Support helped me choose the right size within minutes.", rating: 4 },
];

export const reviewPool = [
  { name: "Sam P.", rating: 5, text: "Great quality and exactly as pictured. Fits true to size." },
  { name: "Nisha T.", rating: 5, text: "The fabric feels premium and it washed beautifully." },
  { name: "Leo M.", rating: 4, text: "Really nice piece. Shipping was quick — would size up next time for a looser fit." },
  { name: "Grace H.", rating: 4, text: "Lovely colour in person. Slightly long on me but easy to tailor." },
];

export const faqs: { group: string; items: [string, string][] }[] = [
  { group: "Orders & shipping", items: [
    ["How long does shipping take?", "Orders leave our studio within 1–2 business days. Standard delivery takes 3–5 business days and express takes 1–2."],
    ["Do you ship internationally?", "Yes — we ship to over 40 countries. Duties and taxes are calculated at checkout so there are no surprises."],
    ["How can I track my order?", "Use the Track Order page with your order number (for example LW-1046). Signed-in customers can also see every order in their account."],
  ] },
  { group: "Returns & exchanges", items: [
    ["What is your return policy?", "Return unworn items within 30 days for a full refund. Domestic returns are free."],
    ["How do exchanges work?", "Start a return and place a new order for the size or colour you want — we refund the original as soon as it arrives back."],
  ] },
  { group: "Products & sizing", items: [
    ["How do I find my size?", "Every product page has a size guide with body measurements. Most of our pieces are true to size."],
    ["Where are your products made?", "We work with small family-run workshops in Portugal, Italy and Nepal that we visit every season."],
  ] },
  { group: "Payments", items: [
    ["Which payment methods do you accept?", "Major cards, digital wallets and cash on delivery in selected regions. This demo does not process real payments."],
    ["Is checkout secure?", "In a real deployment payments would run through a PCI-compliant provider. This template stores demo data only in your browser."],
  ] },
];

export const sizeGuide = {
  apparel: { head: ["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)"], rows: [["XS", "82–86", "66–70", "88–92"], ["S", "87–92", "71–76", "93–98"], ["M", "93–100", "77–84", "99–104"], ["L", "101–108", "85–92", "105–110"], ["XL", "109–116", "93–100", "111–116"]] },
  shoes: { head: ["EU", "UK", "US", "Foot length (cm)"], rows: [["38", "5", "6", "24.0"], ["39", "6", "7", "24.7"], ["40", "6.5", "7.5", "25.3"], ["41", "7.5", "8.5", "26.0"], ["42", "8", "9", "26.7"], ["43", "9", "10", "27.3"], ["44", "9.5", "10.5", "28.0"]] },
};

/* ---------------------------------- Orders & customers ---------------------------------- */

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type Address = { id: string; label: string; name: string; line1: string; city: string; postal: string; country: string; phone: string };
export type OrderItem = { productId: number; name: string; image: string; price: number; qty: number; color: string; size: string };
export type Order = {
  id: string; customer: string; email: string; date: string; items: OrderItem[];
  subtotal: number; shipping: number; discount: number; total: number; status: OrderStatus;
  payment: "card" | "cod" | "wallet"; shippingMethod: "standard" | "express"; address: Address;
};

const addr = (name: string, city: string, country: string): Address => ({ id: "a-" + name, label: "Home", name, line1: "12 Market Street", city, postal: "44600", country, phone: "+977 9800000000" });
const line = (pid: number, qty: number): OrderItem => {
  const pr = seedProducts[pid - 1];
  return { productId: pr.id, name: pr.name, image: pr.images[0], price: pr.price, qty, color: pr.colors[0].name, size: pr.sizes[Math.min(2, pr.sizes.length - 1)] };
};
const order = (id: string, customer: string, email: string, date: string, status: OrderStatus, items: OrderItem[], city: string, country: string, payment: Order["payment"] = "card"): Order => {
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
  const shipping = subtotal >= 120 ? 0 : 9;
  return { id, customer, email, date, items, subtotal, shipping, discount: 0, total: subtotal + shipping, status, payment, shippingMethod: "standard", address: addr(customer, city, country) };
};

export const seedOrders: Order[] = [
  order("LW-1048", "Aarati Shrestha", "aarati@example.com", "2026-10-06T09:12:00Z", "Processing", [line(11, 1), line(25, 2)], "Kathmandu", "Nepal"),
  order("LW-1047", "Marcus Lee", "marcus@example.com", "2026-10-06T07:40:00Z", "Pending", [line(5, 1)], "Austin", "United States", "cod"),
  order("LW-1046", "Priya Karki", "priya@example.com", "2026-10-04T15:05:00Z", "Shipped", [line(14, 1), line(17, 1)], "Pokhara", "Nepal"),
  order("LW-1045", "Daniel Okafor", "daniel@example.com", "2026-10-02T11:30:00Z", "Delivered", [line(3, 1), line(20, 1)], "Lagos", "Nigeria"),
  order("LW-1044", "Sofia Rossi", "sofia@example.com", "2026-09-30T18:22:00Z", "Delivered", [line(13, 1)], "Milan", "Italy", "wallet"),
  order("LW-1043", "Kenji Tanaka", "kenji@example.com", "2026-09-28T08:10:00Z", "Cancelled", [line(7, 2)], "Osaka", "Japan"),
  order("LW-1042", "Emma Wilson", "emma@example.com", "2026-09-26T13:45:00Z", "Delivered", [line(9, 1), line(28, 1)], "London", "United Kingdom"),
  order("LW-1041", "Rohan Gurung", "rohan@example.com", "2026-09-24T10:00:00Z", "Shipped", [line(21, 1), line(26, 1)], "Lalitpur", "Nepal"),
];

export const seedCustomers = [
  { name: "Aarati Shrestha", email: "aarati@example.com", joined: "2025-03-14", location: "Kathmandu, NP" },
  { name: "Marcus Lee", email: "marcus@example.com", joined: "2025-08-02", location: "Austin, US" },
  { name: "Priya Karki", email: "priya@example.com", joined: "2024-11-21", location: "Pokhara, NP" },
  { name: "Daniel Okafor", email: "daniel@example.com", joined: "2024-06-09", location: "Lagos, NG" },
  { name: "Sofia Rossi", email: "sofia@example.com", joined: "2026-01-17", location: "Milan, IT" },
  { name: "Kenji Tanaka", email: "kenji@example.com", joined: "2025-05-30", location: "Osaka, JP" },
  { name: "Emma Wilson", email: "emma@example.com", joined: "2024-02-11", location: "London, UK" },
  { name: "Rohan Gurung", email: "rohan@example.com", joined: "2025-12-03", location: "Lalitpur, NP" },
];

export const monthlySales = [
  { month: "Jan", revenue: 12400, orders: 210 }, { month: "Feb", revenue: 14100, orders: 236 }, { month: "Mar", revenue: 13200, orders: 221 },
  { month: "Apr", revenue: 16800, orders: 280 }, { month: "May", revenue: 18900, orders: 305 }, { month: "Jun", revenue: 17600, orders: 291 },
  { month: "Jul", revenue: 21300, orders: 344 }, { month: "Aug", revenue: 23800, orders: 378 }, { month: "Sep", revenue: 22100, orders: 361 },
  { month: "Oct", revenue: 26400, orders: 412 },
];

export const ratingBreakdown = (rating: number) => {
  const five = Math.max(.3, Math.min(.92, 1 - (5 - rating) * 1.1));
  const rest = 1 - five;
  return [five, rest * .6, rest * .25, rest * .1, rest * .05].map((v) => Math.round(v * 100));
};

/* ---------------------------------- i18n ---------------------------------- */

export type Locale = "en" | "ne";
const en = {
  home: "Home", shop: "Shop", women: "Women", men: "Men", shoes: "Shoes", accessories: "Accessories", newArrivals: "New arrivals", sale: "Sale",
  bestSellers: "Best sellers", featured: "Featured", allProducts: "All products", categories: "Categories", collections: "Collections", trending: "Trending now",
  search: "Search", searchPlaceholder: "Search products, categories, pages…", recentSearches: "Recent searches", quickLinks: "Quick links", noResults: "No results",
  bag: "Your bag", viewBag: "View bag", checkout: "Checkout", subtotal: "Subtotal", emptyBag: "Your bag is empty", startShopping: "Start shopping",
  addToBag: "Add to bag", quickAdd: "Quick add", quickView: "Quick view", added: "Added", buyNow: "Buy now",
  signIn: "Sign in", createAccount: "Create account", myAccount: "My account", orders: "Orders", wishlist: "Wishlist", signOut: "Sign out", admin: "Admin dashboard",
  about: "About", contact: "Contact", faq: "FAQ", trackOrder: "Track order", newsletter: "Newsletter", subscribe: "Subscribe",
  freeShippingLeft: "more for free shipping", freeShippingDone: "You've unlocked free shipping!", viewAll: "View all", shopNow: "Shop now",
  sizeGuide: "Size guide", reviews: "Reviews", writeReview: "Write a review", recentlyViewed: "Recently viewed", youMayLike: "You may also like",
  darkMode: "Dark mode", lightMode: "Light mode", language: "Language", loadMore: "Load more", filters: "Filters", clearAll: "Clear all", sortBy: "Sort by",
};
const ne: typeof en = {
  home: "गृहपृष्ठ", shop: "पसल", women: "महिला", men: "पुरुष", shoes: "जुत्ता", accessories: "सामग्री", newArrivals: "नयाँ आगमन", sale: "छुट",
  bestSellers: "धेरै बिक्री", featured: "विशेष", allProducts: "सबै उत्पादन", categories: "वर्गहरू", collections: "संग्रह", trending: "अहिले चर्चामा",
  search: "खोज्नुहोस्", searchPlaceholder: "उत्पादन, वर्ग, पृष्ठ खोज्नुहोस्…", recentSearches: "हालैका खोजहरू", quickLinks: "द्रुत लिङ्क", noResults: "केही भेटिएन",
  bag: "तपाईंको झोला", viewBag: "झोला हेर्नुहोस्", checkout: "चेकआउट", subtotal: "उप-जम्मा", emptyBag: "तपाईंको झोला खाली छ", startShopping: "किनमेल सुरु गर्नुहोस्",
  addToBag: "झोलामा थप्नुहोस्", quickAdd: "छिटो थप्नुहोस्", quickView: "छिटो हेर्नुहोस्", added: "थपियो", buyNow: "अहिले किन्नुहोस्",
  signIn: "साइन इन", createAccount: "खाता बनाउनुहोस्", myAccount: "मेरो खाता", orders: "अर्डरहरू", wishlist: "मनपर्ने सूची", signOut: "साइन आउट", admin: "एडमिन ड्यासबोर्ड",
  about: "हाम्रो बारेमा", contact: "सम्पर्क", faq: "प्रश्नोत्तर", trackOrder: "अर्डर ट्र्याक", newsletter: "समाचारपत्र", subscribe: "सदस्यता लिनुहोस्",
  freeShippingLeft: "थप्दा निःशुल्क ढुवानी", freeShippingDone: "तपाईंले निःशुल्क ढुवानी पाउनुभयो!", viewAll: "सबै हेर्नुहोस्", shopNow: "अहिले किन्नुहोस्",
  sizeGuide: "साइज गाइड", reviews: "समीक्षा", writeReview: "समीक्षा लेख्नुहोस्", recentlyViewed: "हालै हेरिएका", youMayLike: "तपाईंलाई यो पनि मन पर्न सक्छ",
  darkMode: "डार्क मोड", lightMode: "लाइट मोड", language: "भाषा", loadMore: "थप हेर्नुहोस्", filters: "फिल्टर", clearAll: "सबै हटाउनुहोस्", sortBy: "क्रमबद्ध",
};
export const dict = { en, ne };
export type TKey = keyof typeof en;
