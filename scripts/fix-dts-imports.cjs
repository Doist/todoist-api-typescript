#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Post-build script to fix TypeScript declaration file imports by adding .js extensions.
 * This is required because when package.json has "type": "module", TypeScript treats
 * .d.ts files as ESM modules, which require explicit file extensions for relative imports.
 */

const TYPES_DIR = path.join(__dirname, '../dist/types');

function fixImportsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix relative imports - add .js extension if missing
    content = content.replace(
        /from\s+['"](\.[^'"]*?)['"];?/g,
        (match, importPath) => {
            // Skip if already has extension or is directory import
            if (path.extname(importPath) || importPath.endsWith('/')) {
                return match;
            }

            // Check if this is a directory import (look for index file)
            const fullPath = path.resolve(path.dirname(filePath), importPath);
            const indexPath = path.join(fullPath, 'index.d.ts');

            if (fs.existsSync(indexPath)) {
                // Directory import - add /index.js
                modified = true;
                return match.replace(importPath, importPath + '/index.js');
            } else {
                // File import - add .js
                modified = true;
                return match.replace(importPath, importPath + '.js');
            }
        }
    );

    // Fix export statements as well
    content = content.replace(
        /export\s+(?:\*|\{[^}]*\})\s+from\s+['"](\.[^'"]*?)['"];?/g,
        (match, importPath) => {
            // Skip if already has extension or is directory import
            if (path.extname(importPath) || importPath.endsWith('/')) {
                return match;
            }

            // Check if this is a directory import (look for index file)
            const fullPath = path.resolve(path.dirname(filePath), importPath);
            const indexPath = path.join(fullPath, 'index.d.ts');

            if (fs.existsSync(indexPath)) {
                // Directory import - add /index.js
                modified = true;
                return match.replace(importPath, importPath + '/index.js');
            } else {
                // File import - add .js
                modified = true;
                return match.replace(importPath, importPath + '.js');
            }
        }
    );

    // Fix dynamic import() type expressions
    content = content.replace(
        /import\(['"](\.[^'"]*?)['"]\)/g,
        (match, importPath) => {
            // Skip if already has extension or is directory import
            if (path.extname(importPath) || importPath.endsWith('/')) {
                return match;
            }

            // Check if this is a directory import (look for index file)
            const fullPath = path.resolve(path.dirname(filePath), importPath);
            const indexPath = path.join(fullPath, 'index.d.ts');

            if (fs.existsSync(indexPath)) {
                // Directory import - add /index.js
                modified = true;
                return match.replace(importPath, importPath + '/index.js');
            } else {
                // File import - add .js
                modified = true;
                return match.replace(importPath, importPath + '.js');
            }
        }
    );

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed imports in: ${path.relative(process.cwd(), filePath)}`);
    }
}

function walkDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkDirectory(filePath);
        } else if (file.endsWith('.d.ts')) {
            fixImportsInFile(filePath);
        }
    }
}

function main() {
    if (!fs.existsSync(TYPES_DIR)) {
        console.log('Types directory does not exist, skipping declaration file fixing');
        return;
    }

    console.log('Fixing TypeScript declaration file imports by adding .js extensions...');
    walkDirectory(TYPES_DIR);
    console.log('Declaration file import fixing completed');
}

main();
