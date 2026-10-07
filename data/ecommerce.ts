export const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const store = {
  name: "Lumen Wear",
  tagline: "Considered clothing for everyday living",
  currency: "$",
  freeShippingOver: 120,
};

export type Category = { slug: string; name: string; image: string; blurb: string };

export const categories: Category[] = [
  { slug: "women", name: "Women", image: img("1515886657613-9f3515b0c78f"), blurb: "Dresses, knits & tailoring" },
  { slug: "men", name: "Men", image: img("1617137968427-85924c800a22"), blurb: "Shirts, outerwear & denim" },
  { slug: "shoes", name: "Shoes", image: img("1549298916-b41d501d3772"), blurb: "Sneakers & leather" },
  { slug: "accessories", name: "Accessories", image: img("1584917865442-de89df76afd3"), blurb: "Bags, caps & eyewear" },
];

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  badge?: "New" | "Sale" | "Bestseller";
  stock: number;
  description: string;
  details: string[];
};

const apparel = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["38", "39", "40", "41", "42", "43", "44"];

export const products: Product[] = [
  { id: 1, slug: "essential-cotton-tee", name: "Essential Cotton Tee", category: "men", price: 32, rating: 4.7, reviews: 214, badge: "Bestseller", stock: 120,
    colors: [{ name: "White", hex: "#f5f5f4" }, { name: "Black", hex: "#1c1917" }, { name: "Sage", hex: "#9caf88" }], sizes: apparel,
    images: [img("1521572163474-6864f9cf17ab"), img("1503341504253-dff4815485f1"), img("1576566588028-4147f3842f27")],
    description: "A heavyweight 220gsm organic cotton tee with a relaxed shoulder and a clean, structured neckline that holds its shape wash after wash.",
    details: ["100% organic cotton", "Relaxed fit", "Pre-shrunk", "Machine wash cold"] },
  { id: 2, slug: "moto-leather-jacket", name: "Moto Leather Jacket", category: "men", price: 289, compareAt: 349, rating: 4.9, reviews: 88, badge: "Sale", stock: 18,
    colors: [{ name: "Black", hex: "#1c1917" }, { name: "Cognac", hex: "#9a5b34" }], sizes: apparel,
    images: [img("1551028719-00167b16eac5"), img("1591047139829-d91aecb6caea"), img("1507679799987-c73779587ccf")],
    description: "Supple lambskin leather with an asymmetric zip, quilted shoulders and a soft satin lining. Built to age beautifully.",
    details: ["Genuine lambskin", "YKK hardware", "Two zip pockets", "Professional leather clean"] },
  { id: 3, slug: "straight-leg-denim", name: "Straight Leg Denim", category: "men", price: 89, rating: 4.6, reviews: 167, stock: 64,
    colors: [{ name: "Indigo", hex: "#2f3e63" }, { name: "Light Wash", hex: "#8aa3c2" }], sizes: ["28", "30", "32", "34", "36"],
    images: [img("1542272604-787c3835535d"), img("1541099649105-f69ad21f3246"), img("1489987707025-afc232f7ea0f")],
    description: "A timeless straight leg cut in rigid selvedge denim that softens and moulds to you over time.",
    details: ["13.5oz selvedge denim", "Mid rise", "Button fly", "Wash inside out"] },
  { id: 4, slug: "cloud-fleece-hoodie", name: "Cloud Fleece Hoodie", category: "women", price: 74, rating: 4.8, reviews: 302, badge: "New", stock: 75,
    colors: [{ name: "Oat", hex: "#d6c7ae" }, { name: "Charcoal", hex: "#3f3f46" }, { name: "Rose", hex: "#d8a7a0" }], sizes: apparel,
    images: [img("1556821840-3a63f95609a7"), img("1620799140408-edc6dcb6d633"), img("1576871337622-98d48d1cf531")],
    description: "Brushed-back fleece with a roomy hood and dropped shoulders. The hoodie you will reach for every single day.",
    details: ["80% cotton, 20% recycled polyester", "Oversized fit", "Kangaroo pocket", "Machine wash"] },
  { id: 5, slug: "linen-wrap-dress", name: "Linen Wrap Dress", category: "women", price: 128, rating: 4.7, reviews: 96, badge: "New", stock: 32,
    colors: [{ name: "Terracotta", hex: "#c8553d" }, { name: "Ivory", hex: "#efe9dc" }], sizes: apparel,
    images: [img("1595777457583-95e059d581b8"), img("1572804013309-59a88b7e92f1"), img("1594633312681-425c7b97ccd1")],
    description: "Breezy European linen in a flattering wrap silhouette with a tie waist and flutter sleeves.",
    details: ["100% European linen", "Midi length", "Adjustable tie", "Hand wash or gentle cycle"] },
  { id: 6, slug: "evening-satin-slip", name: "Evening Satin Slip", category: "women", price: 145, compareAt: 180, rating: 4.5, reviews: 54, badge: "Sale", stock: 22,
    colors: [{ name: "Champagne", hex: "#e6d3b3" }, { name: "Emerald", hex: "#1f5e4a" }], sizes: apparel,
    images: [img("1566174053879-31528523f8ae"), img("1509631179647-0177331693ae"), img("1469334031218-e382a71b716b")],
    description: "A bias-cut satin slip dress that skims the body, finished with delicate adjustable straps.",
    details: ["Recycled satin", "Bias cut", "Adjustable straps", "Dry clean recommended"] },
  { id: 7, slug: "wool-blend-coat", name: "Wool Blend Coat", category: "women", price: 249, rating: 4.9, reviews: 73, badge: "Bestseller", stock: 14,
    colors: [{ name: "Camel", hex: "#b88a5a" }, { name: "Black", hex: "#1c1917" }], sizes: apparel,
    images: [img("1539533018447-63fcce2678e3"), img("1544022613-e87ca75a784a"), img("1529139574466-a303027c1d8b")],
    description: "A double-faced wool blend coat with a softly tailored shoulder and generous lapels.",
    details: ["70% wool, 30% polyamide", "Fully lined", "Single breasted", "Dry clean only"] },
  { id: 8, slug: "oxford-button-down", name: "Oxford Button Down", category: "men", price: 68, rating: 4.6, reviews: 141, stock: 58,
    colors: [{ name: "Sky", hex: "#a9c4e0" }, { name: "White", hex: "#f5f5f4" }], sizes: apparel,
    images: [img("1598033129183-c4f50c736f10"), img("1596755094514-f87e34085b2c"), img("1602810318383-e386cc2a3ccf")],
    description: "Classic oxford cloth shirt with a soft button-down collar and a tailored yet comfortable body.",
    details: ["100% cotton oxford", "Regular fit", "Chest pocket", "Machine wash warm"] },
  { id: 9, slug: "runner-sneaker", name: "Everyday Runner Sneaker", category: "shoes", price: 120, rating: 4.8, reviews: 412, badge: "Bestseller", stock: 90,
    colors: [{ name: "Crimson", hex: "#b91c1c" }, { name: "White", hex: "#f5f5f4" }], sizes: shoeSizes,
    images: [img("1542291026-7eec264c27ff"), img("1525507119028-ed4c629a60a3"), img("1549298916-b41d501d3772")],
    description: "Lightweight knit upper on a responsive foam sole, designed for long days on your feet.",
    details: ["Recycled knit upper", "Foam midsole", "Removable insole", "Wipe clean"] },
  { id: 10, slug: "canvas-day-backpack", name: "Canvas Day Backpack", category: "accessories", price: 95, rating: 4.7, reviews: 129, stock: 40,
    colors: [{ name: "Olive", hex: "#5b6b45" }, { name: "Sand", hex: "#cdb994" }], sizes: ["One size"],
    images: [img("1553062407-98eeb64c6a62"), img("1548036328-c9fa89d128fa"), img("1584917865442-de89df76afd3")],
    description: "Waxed canvas backpack with leather trims, a padded laptop sleeve and plenty of pockets.",
    details: ["Waxed cotton canvas", "Fits 15\" laptop", "Leather trims", "Spot clean"] },
  { id: 11, slug: "structured-leather-tote", name: "Structured Leather Tote", category: "accessories", price: 210, compareAt: 260, rating: 4.8, reviews: 61, badge: "Sale", stock: 12,
    colors: [{ name: "Tan", hex: "#a8703f" }, { name: "Black", hex: "#1c1917" }], sizes: ["One size"],
    images: [img("1584917865442-de89df76afd3"), img("1548036328-c9fa89d128fa"), img("1553062407-98eeb64c6a62")],
    description: "Full-grain leather tote with a structured base and a removable zip pouch.",
    details: ["Full-grain leather", "Magnetic closure", "Interior pouch", "Condition regularly"] },
  { id: 12, slug: "classic-baseball-cap", name: "Classic Baseball Cap", category: "accessories", price: 28, rating: 4.5, reviews: 87, badge: "New", stock: 150,
    colors: [{ name: "Navy", hex: "#1e2a44" }, { name: "Stone", hex: "#c9c2b4" }], sizes: ["One size"],
    images: [img("1588850561407-ed78c282e89b"), img("1521369909029-2afed882baee"), img("1572635196237-14b3f281503f")],
    description: "Six-panel washed cotton cap with an adjustable brass buckle strap.",
    details: ["Washed cotton twill", "Adjustable strap", "Curved brim", "Hand wash"] },
];

export const formatPrice = (n: number) => `${store.currency}${n.toFixed(2)}`;
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const banners = {
  hero: [
    { title: "The Autumn Edit", subtitle: "Layer up in soft wool, rich leather and warm neutrals.", image: img("1445205170230-053b83016050", 1800), cta: "Shop women", href: "/ecommerce/shop?category=women" },
    { title: "Built to Last", subtitle: "Wardrobe staples crafted from honest materials.", image: img("1490481651871-ab68de25d43d", 1800), cta: "Shop men", href: "/ecommerce/shop?category=men" },
    { title: "Step Lighter", subtitle: "New sneakers designed for all-day comfort.", image: img("1441984904996-e0b6ba687e04", 1800), cta: "Shop shoes", href: "/ecommerce/shop?category=shoes" },
  ],
  promo: img("1483985988355-763728e1935b", 1600),
  story: img("1523381210434-271e8be1f52b", 1200),
};

export const testimonials = [
  { name: "Aarati S.", text: "The fleece hoodie is unbelievably soft. Shipping was fast and the packaging was plastic-free.", rating: 5 },
  { name: "Marcus L.", text: "Finally denim that fits right out of the box. Already ordered a second pair.", rating: 5 },
  { name: "Priya K.", text: "The wool coat looks twice its price. Customer service helped me pick the perfect size.", rating: 4 },
];

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export const orders: { id: string; customer: string; email: string; date: string; items: number; total: number; status: OrderStatus }[] = [
  { id: "#LW-1048", customer: "Aarati Shrestha", email: "aarati@example.com", date: "2026-10-06", items: 3, total: 234, status: "Processing" },
  { id: "#LW-1047", customer: "Marcus Lee", email: "marcus@example.com", date: "2026-10-06", items: 1, total: 89, status: "Pending" },
  { id: "#LW-1046", customer: "Priya Karki", email: "priya@example.com", date: "2026-10-05", items: 2, total: 394, status: "Shipped" },
  { id: "#LW-1045", customer: "Daniel Okafor", email: "daniel@example.com", date: "2026-10-05", items: 4, total: 412, status: "Delivered" },
  { id: "#LW-1044", customer: "Sofia Rossi", email: "sofia@example.com", date: "2026-10-04", items: 1, total: 145, status: "Delivered" },
  { id: "#LW-1043", customer: "Kenji Tanaka", email: "kenji@example.com", date: "2026-10-03", items: 2, total: 152, status: "Cancelled" },
  { id: "#LW-1042", customer: "Emma Wilson", email: "emma@example.com", date: "2026-10-03", items: 5, total: 521, status: "Delivered" },
  { id: "#LW-1041", customer: "Rohan Gurung", email: "rohan@example.com", date: "2026-10-02", items: 1, total: 249, status: "Shipped" },
];

export const customers = [
  { name: "Aarati Shrestha", email: "aarati@example.com", orders: 7, spent: 1240, joined: "2025-03-14", location: "Kathmandu, NP" },
  { name: "Marcus Lee", email: "marcus@example.com", orders: 3, spent: 412, joined: "2025-08-02", location: "Austin, US" },
  { name: "Priya Karki", email: "priya@example.com", orders: 5, spent: 986, joined: "2024-11-21", location: "Pokhara, NP" },
  { name: "Daniel Okafor", email: "daniel@example.com", orders: 9, spent: 2104, joined: "2024-06-09", location: "Lagos, NG" },
  { name: "Sofia Rossi", email: "sofia@example.com", orders: 2, spent: 290, joined: "2026-01-17", location: "Milan, IT" },
  { name: "Kenji Tanaka", email: "kenji@example.com", orders: 4, spent: 603, joined: "2025-05-30", location: "Osaka, JP" },
  { name: "Emma Wilson", email: "emma@example.com", orders: 11, spent: 3018, joined: "2024-02-11", location: "London, UK" },
];

export const monthlySales = [
  { month: "Jan", revenue: 12400, orders: 210 }, { month: "Feb", revenue: 14100, orders: 236 }, { month: "Mar", revenue: 13200, orders: 221 },
  { month: "Apr", revenue: 16800, orders: 280 }, { month: "May", revenue: 18900, orders: 305 }, { month: "Jun", revenue: 17600, orders: 291 },
  { month: "Jul", revenue: 21300, orders: 344 }, { month: "Aug", revenue: 23800, orders: 378 }, { month: "Sep", revenue: 22100, orders: 361 },
  { month: "Oct", revenue: 26400, orders: 412 },
];
