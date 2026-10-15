import fs from 'fs';
let code = fs.readFileSync('src/components/InventoryTab.tsx', 'utf8');

const newCode = `  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAICatalogModal, setShowAICatalogModal] = useState(false);
  const [aiCatalogData, setAiCatalogData] = useState<any>(null);
  const [generatingCatalog, setGeneratingCatalog] = useState(false);`;

code = code.replace(`  const [showAddModal, setShowAddModal] = useState(false);\n  const [showAdjustModal, setShowAdjustModal] = useState(false);`, newCode);
fs.writeFileSync('src/components/InventoryTab.tsx', code);
