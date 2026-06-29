const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walk(dirPath, callback) : callback(dirPath);
  });
}

walk('d:/Techency/Techency Website/Frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Replace imports from public folder
    const importRegex = /import\s+(\w+)\s+from\s+['"](\.\.\/)+public\/([^'"]+)['"];/g;
    content = content.replace(importRegex, (match, p1, p2, p3) => {
      changed = true;
      return `const ${p1} = "/${p3}";`;
    });
    
    // Handle commented out imports just in case
    const commentRegex = /\/\/\s*import\s+(\w+)\s+from\s+['"](\.\.\/)+public\/([^'"]+)['"];/g;
    content = content.replace(commentRegex, (match, p1, p2, p3) => {
      changed = true;
      return `// const ${p1} = "/${p3}";`;
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
