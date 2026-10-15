const fs = require('fs');

const categories = [
  "Grocery & Staples", "Snacks & Branded Foods", "Beverages", 
  "Personal Care", "Home Care", "Dairy & Bakery", 
  "Fruits & Vegetables", "Stationery", "Baby Care", "Medicines/OTC"
];

const adjectives = ["Premium", "Organic", "Fresh", "Classic", "Spicy", "Sweet", "Roasted", "Healthy", "Natural", "Instant"];
const items = ["Rice", "Dal", "Flour", "Oil", "Salt", "Sugar", "Spices", "Tea", "Coffee", "Biscuits", "Chips", "Noodles", "Soap", "Shampoo", "Detergent", "Toothpaste", "Milk", "Butter", "Cheese", "Paneer"];
const brands = ["Tata", "Reliance", "Aashirvaad", "Fortune", "Patanjali", "Amul", "Britannia", "Parle", "Haldiram's", "Nestle", "HUL", "ITC", "P&G", "Dabur", "Godrej", "Marico", "MTR", "Everest", "MDH", "Catch"];

const catalog = [];
let id = 1;

for (let i = 0; i < 1000; i++) {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const item = items[Math.floor(Math.random() * items.length)];
  
  const name = `${brand} ${adjective} ${item} ${Math.floor(Math.random() * 100) + 1}g`;
  const cost = Math.floor(Math.random() * 400) + 10;
  const price = Math.floor(cost * (1 + (Math.random() * 0.4 + 0.1))); // 10% to 50% margin
  
  catalog.push({
    id: id++,
    name: name,
    unit: ["kg", "L", "pcs", "pkt", "box"][Math.floor(Math.random() * 5)],
    suggestedPrice: price,
    suggestedCostPrice: cost,
    category: categories[Math.floor(Math.random() * categories.length)]
  });
}

const fileContent = `export const seedCatalog = ${JSON.stringify(catalog, null, 2)};\n`;
fs.writeFileSync('src/db/catalog-seed.ts', fileContent);
console.log("Generated 1000 items in src/db/catalog-seed.ts");
