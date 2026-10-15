import fs from 'fs';
let content = fs.readFileSync('src/components/POSTab.tsx', 'utf-8');

const filteredProductsCode = `
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);
`;

content = content.replace(
  '  const [isAddingProduct, setIsAddingProduct] = useState(false);',
  filteredProductsCode.trim()
);

fs.writeFileSync('src/components/POSTab.tsx', content);
