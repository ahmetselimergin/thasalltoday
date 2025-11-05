import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing coins.json
const existingCoinsPath = path.join(__dirname, '../data/coins.json');
const existingData = JSON.parse(fs.readFileSync(existingCoinsPath, 'utf8'));

// Read new crypto list
const newCoinsPath = '/Users/ahmetselim/Downloads/crypto_list_cleaned.json';
const newCoins = JSON.parse(fs.readFileSync(newCoinsPath, 'utf8'));

console.log(`📊 Existing coins: ${existingData.coins.length}`);
console.log(`📊 New coins to process: ${newCoins.length}`);

// Create a map of existing coins by symbol for quick lookup
const existingSymbols = new Set(existingData.coins.map(c => c.symbol.toUpperCase()));

// Process new coins
let addedCount = 0;
let skippedCount = 0;

newCoins.forEach(coin => {
  const symbol = coin.ticker.toUpperCase();
  
  // Skip if already exists
  if (existingSymbols.has(symbol)) {
    skippedCount++;
    return;
  }
  
  // Extract name parts for aliases
  const nameParts = coin.name
    .replace(/\(.*?\)/g, '') // Remove parentheses content
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
    .split(/\s+/)
    .filter(part => part.length > 2)
    .map(part => part.toUpperCase());
  
  // Create aliases array (unique values, exclude the symbol itself)
  const aliases = [...new Set(nameParts)].filter(alias => alias !== symbol);
  
  // Add to existing data
  existingData.coins.push({
    symbol: symbol,
    name: coin.name,
    aliases: aliases
  });
  
  existingSymbols.add(symbol);
  addedCount++;
});

// Sort coins alphabetically by symbol
existingData.coins.sort((a, b) => a.symbol.localeCompare(b.symbol));

// Write updated coins.json
fs.writeFileSync(existingCoinsPath, JSON.stringify(existingData, null, 2), 'utf8');

console.log(`✅ Successfully merged coins!`);
console.log(`   📈 Added: ${addedCount} new coins`);
console.log(`   ⏭️  Skipped: ${skippedCount} duplicates`);
console.log(`   🎯 Total coins: ${existingData.coins.length}`);

