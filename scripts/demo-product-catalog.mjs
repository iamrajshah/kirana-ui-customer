export const DEMO_PRODUCT_ASSET_DIRECTORY = "/demo-products/catalog";

const CORE_PRODUCTS = [
  ["DEMO-MILK-1L", "Amul Taaza Milk", "Amul", "Taaza Milk", "1 L", "Daily Essentials", "POUCH"],
  ["DEMO-SALT-1KG", "Tata Salt", "Tata", "Salt", "1 kg", "Daily Essentials", "PACKET"],
  ["DEMO-OIL-1L", "Fortune Sunflower Oil", "Fortune", "Sunflower Oil", "1 L", "Cooking", "POUCH"],
  ["DEMO-PARLEG-800G", "Parle-G Biscuits", "Parle", "G Biscuits", "800 g", "Snacks", "PACKET"],
  ["DEMO-COKE-750ML", "Coca-Cola", "Coca-Cola", "Cola", "750 ml", "Beverages", "BOTTLE"],
  ["DEMO-SURF-1KG", "Surf Excel Easy Wash", "Surf Excel", "Easy Wash", "1 kg", "Home Care", "PACKET"],
  ["DEMO-COLGATE-200G", "Colgate Strong Teeth", "Colgate", "Strong Teeth", "200 g", "Personal Care", "BOX"],
  ["DEMO-RICE-5KG", "India Gate Basmati Rice", "India Gate", "Basmati Rice", "5 kg", "Cooking", "PACKET"],
];

const CATALOG_TEMPLATES = [
  ["Pulses & Grains", "Tata Sampann", "Toor Dal", ["500 g", "1 kg", "2 kg", "5 kg"], "PACKET"],
  ["Pulses & Grains", "Fortune", "Chana Dal", ["500 g", "1 kg", "2 kg", "5 kg"], "PACKET"],
  ["Pulses & Grains", "Aashirvaad", "Whole Wheat Atta", ["1 kg", "2 kg", "5 kg", "10 kg"], "PACKET"],
  ["Cooking", "Dhara", "Groundnut Oil", ["500 ml", "1 L", "2 L", "5 L"], "POUCH"],
  ["Cooking", "Saffola", "Gold Oil", ["500 ml", "1 L", "2 L", "5 L"], "POUCH"],
  ["Spices", "Everest", "Turmeric Powder", ["50 g", "100 g", "200 g", "500 g"], "PACKET"],
  ["Spices", "MDH", "Garam Masala", ["50 g", "100 g", "200 g", "500 g"], "PACKET"],
  ["Spices", "Catch", "Red Chilli Powder", ["50 g", "100 g", "200 g", "500 g"], "PACKET"],
  ["Beverages", "Tata Tea", "Premium Tea", ["100 g", "250 g", "500 g", "1 kg"], "PACKET"],
  ["Beverages", "Nescafe", "Classic Coffee", ["25 g", "50 g", "100 g", "200 g"], "JAR"],
  ["Beverages", "Real", "Mixed Fruit Juice", ["200 ml", "500 ml", "1 L", "2 L"], "BOX"],
  ["Snacks", "Haldiram", "Aloo Bhujia", ["100 g", "200 g", "400 g", "1 kg"], "PACKET"],
  ["Snacks", "Balaji", "Masala Wafers", ["50 g", "100 g", "200 g", "400 g"], "PACKET"],
  ["Snacks", "Britannia", "Good Day Biscuits", ["75 g", "150 g", "300 g", "600 g"], "PACKET"],
  ["Breakfast", "Kelloggs", "Corn Flakes", ["100 g", "250 g", "475 g", "1 kg"], "BOX"],
  ["Breakfast", "Quaker", "Oats", ["200 g", "500 g", "1 kg", "2 kg"], "PACKET"],
  ["Dairy", "Amul", "Butter", ["50 g", "100 g", "200 g", "500 g"], "BOX"],
  ["Dairy", "Amul", "Cheese Slices", ["100 g", "200 g", "400 g", "750 g"], "PACKET"],
  ["Home Care", "Vim", "Dishwash Gel", ["250 ml", "500 ml", "1 L", "2 L"], "BOTTLE"],
  ["Home Care", "Lizol", "Floor Cleaner", ["200 ml", "500 ml", "1 L", "2 L"], "BOTTLE"],
  ["Personal Care", "Dove", "Bathing Bar", ["50 g", "75 g", "100 g", "150 g"], "BOX"],
  ["Personal Care", "Clinic Plus", "Shampoo", ["80 ml", "175 ml", "340 ml", "650 ml"], "BOTTLE"],
  ["Household", "Goodknight", "Mosquito Refill", ["30 ml", "45 ml", "60 ml", "90 ml"], "BOX"],
];

export const demoProductAssetSlug = (value) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const demoProductAssetFilename = ({ sku, name }) =>
  `${sku.trim().toLowerCase()}--${demoProductAssetSlug(name)}.svg`;

export const demoProductAssetPath = (product) =>
  `${DEMO_PRODUCT_ASSET_DIRECTORY}/${demoProductAssetFilename(product)}`;

export const buildDemoProductAssetCatalog = () => {
  const core = CORE_PRODUCTS.map(
    ([sku, name, brand, item, size, category, packaging]) => ({
      sku,
      name,
      brand,
      item,
      size,
      category,
      packaging,
    }),
  );
  const generated = CATALOG_TEMPLATES.flatMap(
    ([category, brand, item, sizes, packaging], templateIndex) =>
      sizes.map((size, sizeIndex) => {
        const index = templateIndex * 4 + sizeIndex + CORE_PRODUCTS.length + 1;
        return {
          sku: `DEMO-CATALOG-${index.toString().padStart(3, "0")}`,
          name: `${brand} ${item} ${size}`,
          brand,
          item,
          size,
          category,
          packaging,
        };
      }),
  );

  return [...core, ...generated].map((product) => ({
    ...product,
    assetPath: demoProductAssetPath(product),
  }));
};
