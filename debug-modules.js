#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Known valid lucide-react icons (partial list)
const validLucideIcons = [
  'CheckCircle', 'XCircle', 'AlertCircle', 'Play', 'X', 'RefreshCw',
  'Wallet', 'TrendingUp', 'Loader2', 'Sparkles', 'Heart', 'Coins', 'Users', 'Trophy',
  'Gauge', 'Clock', 'Zap', 'HardDrive', 'Wifi', 'Activity',
  'History', 'ExternalLink', 'Cookie', 'Shield', 'Settings',
  'Info', 'Circle', 'Square', 'Pause', 'StopCircle', 'PauseCircle',
  'RotateCcw', 'Trash2', 'Eraser', 'Ban', 'MinusCircle'
];

// Function to check if an icon is valid
function isValidIcon(iconName) {
  return validLucideIcons.includes(iconName);
}

// Function to scan a file for lucide-react imports
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/);
    
    if (importMatch) {
      const icons = importMatch[1]
        .split(',')
        .map(icon => icon.trim())
        .filter(icon => icon.length > 0);
      
      const invalidIcons = icons.filter(icon => !isValidIcon(icon));
      
      if (invalidIcons.length > 0) {
        console.log(`❌ ${filePath}:`);
        console.log(`   Invalid icons: ${invalidIcons.join(', ')}`);
        return false;
      } else {
        console.log(`✅ ${filePath}: All icons valid`);
        return true;
      }
    }
  } catch (error) {
    console.log(`⚠️  ${filePath}: Could not read file`);
  }
  return true;
}

// Function to recursively scan directories
function scanDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let allValid = true;
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      allValid = scanDirectory(fullPath) && allValid;
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      allValid = scanFile(fullPath) && allValid;
    }
  }
  
  return allValid;
}

// Main execution
console.log('🔍 Scanning for lucide-react import issues...\n');

const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
  const allValid = scanDirectory(srcPath);
  
  console.log('\n📊 Summary:');
  if (allValid) {
    console.log('✅ All lucide-react imports appear to be valid');
  } else {
    console.log('❌ Found invalid lucide-react imports');
  }
} else {
  console.log('❌ src directory not found');
}

console.log('\n🔧 Debugging Commands:');
console.log('1. Clear Vite cache: npm run dev -- --force');
console.log('2. Clear node_modules: rm -rf node_modules && npm install');
console.log('3. Check TypeScript: npx tsc --noEmit');
console.log('4. Check for conflicts: npm ls --depth=0');
console.log('5. Restart dev server: Ctrl+C then npm run dev'); 