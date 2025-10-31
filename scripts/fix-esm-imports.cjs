#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Post-build script to fix ESM imports by adding .js extensions.
 * This is required because ESM requires explicit file extensions for relative imports.
 */

const ESM_DIR = path.join(__dirname, '../dist/esm');

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
            const indexPath = path.join(fullPath, 'index.js');

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
            const indexPath = path.join(fullPath, 'index.js');

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
        } else if (file.endsWith('.js')) {
            fixImportsInFile(filePath);
        }
    }
}

function main() {
    if (!fs.existsSync(ESM_DIR)) {
        console.log('ESM directory does not exist, skipping import fixing');
        return;
    }

    console.log('Fixing ESM imports by adding .js extensions...');
    walkDirectory(ESM_DIR);
    console.log('ESM import fixing completed');
}

main();