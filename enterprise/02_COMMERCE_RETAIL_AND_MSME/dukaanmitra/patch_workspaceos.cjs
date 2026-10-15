const fs = require('fs');
let code = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf8');

// add imports
code = code.replace(/import \{ formatRupees \} from "\.\.\/utils";/, `import { formatRupees } from "../utils";
import UniversalDataEntry from "./UniversalDataEntry";`);

// add onRefreshDB
code = code.replace(/setActiveTab \}: any\) \{/, `setActiveTab, onRefreshDB }: any) {`);

// replace the Greeting & AI Suggestions block with the UniversalDataEntry
const regex = /\{\/\* Greeting & AI Suggestions \*\/\}[\s\S]*?<\/div>\s*\{\/\* Adaptive Workspaces Grid \*\/\}/;
const replacement = `{/* Universal Data Collection Form */}
      <div className="shrink-0">
        <UniversalDataEntry 
          customers={customers} 
          products={products} 
          onRefreshDB={onRefreshDB} 
        />
      </div>

      {/* Adaptive Workspaces Grid */}`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/WorkspaceOS.tsx', code);
console.log("Patched WorkspaceOS");
