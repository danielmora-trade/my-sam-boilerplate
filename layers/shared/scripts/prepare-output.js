const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'nodejs', 'node_modules', 'shared');

// Ensure output directory exists
console.log(outputDir, fs.existsSync(outputDir));
if (fs.existsSync(outputDir)) {
  // Create package.json for the module
  const packageJson = {
    name: 'shared',
    version: '1.0.0',
    main: 'index.js',
    type: 'commonjs'
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('✅ Package.json created in output directory');
}