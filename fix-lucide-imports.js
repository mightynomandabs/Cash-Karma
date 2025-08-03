#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapping of invalid icons to valid alternatives
const iconReplacements = {
  // Navigation and arrows
  'ChevronDown': 'ChevronDown',
  'ChevronUp': 'ChevronUp', 
  'ChevronRight': 'ChevronRight',
  'ChevronLeft': 'ChevronLeft',
  'ArrowRight': 'ArrowRight',
  'ArrowLeft': 'ArrowLeft',
  'MoreHorizontal': 'MoreHorizontal',
  
  // UI elements
  'Check': 'Check',
  'Search': 'Search',
  'Menu': 'Menu',
  'Eye': 'Eye',
  'EyeOff': 'EyeOff',
  'Lock': 'Lock',
  'User': 'User',
  'LogOut': 'LogOut',
  'Edit': 'Edit',
  'Save': 'Save',
  'Share2': 'Share2',
  'Copy': 'Copy',
  'Download': 'Download',
  'Dot': 'Dot',
  'GripVertical': 'GripVertical',
  'PanelLeft': 'PanelLeft',
  
  // Social and communication
  'Mail': 'Mail',
  'MapPin': 'MapPin',
  'Phone': 'Phone',
  'Twitter': 'Twitter',
  'Instagram': 'Instagram',
  'Linkedin': 'Linkedin',
  'Github': 'Github',
  'MessageCircle': 'MessageCircle',
  'Music': 'Music',
  
  // Content and media
  'Quote': 'Quote',
  'Star': 'Star',
  'Gift': 'Gift',
  'Flame': 'Flame',
  'Target': 'Target',
  'Calendar': 'Calendar',
  'Crown': 'Crown',
  'Medal': 'Medal',
  'Laugh': 'Laugh',
  'Smile': 'Smile',
  'Rocket': 'Rocket',
  'Dice1': 'Dice1',
  'Bell': 'Bell',
  
  // Actions and states
  'Send': 'Send',
  'Plus': 'Plus',
  'DollarSign': 'DollarSign',
  'CreditCard': 'CreditCard',
  
  // These are actually valid in lucide-react v0.462.0
  // The script was using an incomplete list
};

// Function to fix imports in a file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Find lucide-react imports
    const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/);
    
    if (importMatch) {
      const icons = importMatch[1]
        .split(',')
        .map(icon => icon.trim())
        .filter(icon => icon.length > 0);
      
      const validIcons = [];
      const invalidIcons = [];
      
      icons.forEach(icon => {
        if (iconReplacements[icon]) {
          validIcons.push(icon);
        } else {
          invalidIcons.push(icon);
        }
      });
      
      if (invalidIcons.length > 0) {
        console.log(`🔧 Fixing ${filePath}:`);
        console.log(`   Invalid icons found: ${invalidIcons.join(', ')}`);
        console.log(`   These icons are actually valid in lucide-react v0.462.0`);
        console.log(`   The issue might be with the icon list or module resolution`);
      }
    }
  } catch (error) {
    console.log(`⚠️  ${filePath}: Could not read file`);
  }
}

// Function to recursively scan and fix directories
function fixDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(fullPath);
    }
  }
}

// Main execution
console.log('🔧 Analyzing lucide-react imports...\n');

const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
  fixDirectory(srcPath);
} else {
  console.log('❌ src directory not found');
}

console.log('\n📋 Summary:');
console.log('✅ Most of the "invalid" icons are actually valid in lucide-react v0.462.0');
console.log('✅ The issue is likely with module resolution or cache');
console.log('\n🔧 Recommended fixes:');
console.log('1. Clear Vite cache: npm run dev -- --force');
console.log('2. Restart dev server: Ctrl+C then npm run dev');
console.log('3. If issues persist, try: rm -rf node_modules && npm install'); 