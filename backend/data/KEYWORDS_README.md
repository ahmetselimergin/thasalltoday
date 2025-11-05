# 📚 Keywords Database Documentation

## 📋 Overview

`keywords.json` contains a comprehensive, categorized database of keywords used for:
- **Stopword filtering** (400+ words)
- **Sentiment analysis** (250+ keywords + emojis)
- **Topic categorization** (300+ domain-specific terms)
- **Trend detection optimization**

## 🎯 Purpose

This JSON database separates hardcoded keywords from the codebase, making it:
- ✅ **Maintainable** - Easy to update without touching code
- ✅ **Scalable** - Add new categories and languages
- ✅ **Collaborative** - Team members can contribute keywords
- ✅ **Version-controlled** - Track changes over time

## 📊 Structure

### 1. Stopwords
Words to **filter out** from trending topics analysis.

#### `english_common` (200+ words)
Common English words with no semantic value for crypto trends.

```json
["THE", "BE", "TO", "OF", "AND", "A", "IN", ...]
```

**Examples:** THE, IS, WAS, BEEN, HAVE, HAD

#### `crypto_general` (30+ words)
Generic crypto terms that don't add value.

```json
["CRYPTO", "COIN", "TOKEN", "BLOCKCHAIN", ...]
```

**Examples:** CRYPTO, CRYPTOCURRENCY, BLOCKCHAIN, DIGITAL

#### `crypto_actions` (30+ words)
Common trading actions (filtered because too generic).

```json
["TRADE", "TRADING", "BUY", "SELL", "HOLD", ...]
```

**Examples:** TRADE, BUY, SELL, HOLD, SWAP, STAKE

#### `crypto_metrics` (25+ words)
Common metrics and measurements.

```json
["PRICE", "VOLUME", "CAP", "SUPPLY", ...]
```

**Examples:** PRICE, VOLUME, MARKETCAP, TVL, APR

#### `crypto_content` (25+ words)
Content-related terms.

```json
["CHART", "ANALYSIS", "NEWS", "UPDATE", ...]
```

**Examples:** CHART, ANALYSIS, NEWS, REPORT, DATA

#### `social_media` (25+ words)
Social media and engagement terms.

```json
["READ", "MORE", "LINK", "CLICK", "JOIN", ...]
```

**Examples:** READ, FOLLOW, SHARE, SUBSCRIBE, CHANNEL

#### `web_tech` (20+ words)
Web and technical terms.

```json
["HTTPS", "HTTP", "WWW", "COM", "API", ...]
```

**Examples:** HTTPS, API, GITHUB, DOCS, URL

#### `time_references` (30+ words)
Time-related words.

```json
["TODAY", "TOMORROW", "YESTERDAY", "WEEK", ...]
```

**Examples:** TODAY, WEEK, MONTH, RECENTLY, UPCOMING

#### `intensifiers` (15+ words)
Emphasis words.

```json
["JUST", "VERY", "MUCH", "REALLY", ...]
```

**Examples:** VERY, MUCH, REALLY, EXTREMELY, ABSOLUTELY

#### `modal_verbs` (15+ words)
Modal auxiliary verbs.

```json
["SHOULD", "WOULD", "COULD", "MAY", ...]
```

**Examples:** SHOULD, WOULD, MUST, CAN, WILL

---

### 2. Sentiment Keywords

#### `positive.keywords` (70+ words)
Keywords indicating positive sentiment.

```json
["BULLISH", "BULL", "MOON", "PUMP", "RALLY", ...]
```

**Categories:**
- Market direction: BULLISH, MOON, PUMP, RALLY
- Performance: GAIN, PROFIT, WIN, STRONG
- Milestones: ATH, BREAKOUT, SURGE, BOOM
- Adoption: ADOPTION, GROWTH, EXPANSION
- Success: SUCCESS, LAUNCH, UPGRADE, PARTNERSHIP

#### `positive.emojis` (30+ emojis)
Emojis indicating positive sentiment.

```json
["🚀", "📈", "💎", "🔥", "💪", "✅", "🟢", ...]
```

**Categories:**
- Rockets & Movement: 🚀 ⬆️ 📈 📶
- Success: ✅ 🎯 🏆 👍 🙌
- Money: 💰 💵 💴 💶 💷
- Strength: 💪 🔥 💎 ⚡

#### `negative.keywords` (80+ words)
Keywords indicating negative sentiment.

```json
["BEARISH", "BEAR", "DUMP", "CRASH", "DROP", ...]
```

**Categories:**
- Market direction: BEARISH, DUMP, CRASH, DROP
- Performance: LOSS, DECLINE, WEAK, LIQUIDATION
- Risk: SCAM, FRAUD, RUGPULL, EXPLOIT, HACK
- Problems: FAILURE, PROBLEM, BUG, ERROR
- Action: DELISTING, SUSPEND, HALT, COLLAPSE

#### `negative.emojis` (20+ emojis)
Emojis indicating negative sentiment.

```json
["📉", "🔻", "⬇️", "🔴", "❌", "⚠️", ...]
```

**Categories:**
- Decline: 📉 🔻 ⬇️ 
- Warning: ⚠️ 🚨 ⛔ 🛑
- Negative: ❌ 🔴 💔 😢 💀

#### `neutral.keywords` (20+ words)
Keywords indicating neutral/observational sentiment.

```json
["STABLE", "CONSOLIDATION", "SIDEWAYS", ...]
```

**Examples:** STABLE, RANGE, TESTING, MONITOR, PATTERN

---

### 3. Categories

Domain-specific keyword groups for **advanced topic detection**.

#### `technology` (40+ terms)
Blockchain technology and infrastructure.

```json
["LAYER2", "ZKEVM", "ROLLUP", "SHARDING", ...]
```

**Sub-categories:**
- Scaling: LAYER2, ROLLUP, SIDECHAIN, SHARDING
- Consensus: POS, POW, DPOS, VALIDATOR
- Applications: DEFI, NFT, DAO, DEX, DAPP
- Integration: BRIDGE, CROSS-CHAIN, ORACLE

#### `finance` (50+ terms)
Traditional finance and macro economics.

```json
["INFLATION", "FED", "INTEREST", "RECESSION", ...]
```

**Sub-categories:**
- Macro: INFLATION, FED, CENTRAL BANK, RECESSION
- Metrics: GDP, CPI, UNEMPLOYMENT
- Markets: STOCKS, BONDS, COMMODITIES, FOREX
- Correlation: GOLD, SILVER, OIL, DOLLAR

#### `regulation` (40+ terms)
Legal and regulatory topics.

```json
["SEC", "REGULATION", "COMPLIANCE", "BAN", ...]
```

**Sub-categories:**
- Authorities: SEC, CFTC, TREASURY, IRS
- Actions: BAN, SANCTION, LAWSUIT, RULING
- Compliance: KYC, AML, LICENSE, APPROVAL

#### `events` (40+ terms)
Important crypto events and milestones.

```json
["HALVING", "AIRDROP", "LISTING", "CONFERENCE", ...]
```

**Sub-categories:**
- Protocol: HALVING, FORK, MAINNET, UPGRADE
- Tokens: AIRDROP, LISTING, MIGRATION, SWAP
- Business: PARTNERSHIP, FUNDING, ACQUISITION
- Launches: ICO, IDO, PRESALE, LAUNCH

#### `institutions` (35+ terms)
Institutional players and adoption.

```json
["INSTITUTIONAL", "BLACKROCK", "GRAYSCALE", ...]
```

**Sub-categories:**
- Types: HEDGE FUND, BANK, PENSION, SOVEREIGN
- Companies: BLACKROCK, FIDELITY, GRAYSCALE
- Corporations: TESLA, PAYPAL, VISA, MICROSTRATEGY
- Banks: GOLDMAN, JPMORGAN, CITIGROUP

#### `market_structure` (40+ terms)
Market mechanics and trading.

```json
["WHALE", "LIQUIDITY", "ORDERBOOK", "FUTURES", ...]
```

**Sub-categories:**
- Participants: WHALE, RETAIL, INSTITUTIONAL
- Mechanisms: ORDERBOOK, LIQUIDITY, SLIPPAGE
- Products: FUTURES, OPTIONS, PERPETUAL, LEVERAGE
- Issues: MANIPULATION, WASH TRADING, MEV

---

### 4. Special Cases

#### `preserve` (20+ terms)
Acronyms and abbreviations to **keep as-is** (don't filter).

```json
["AI", "ML", "API", "ATH", "TVL", "FOMO", "FUD", ...]
```

**Purpose:** These are meaningful as standalone topics.

#### `ignore_as_topics` (10+ terms)
Internet slang to **ignore** (not useful for trends).

```json
["LMAO", "LOL", "OMG", "WTF", "BTW", ...]
```

**Purpose:** Filter out chat/comment noise.

---

## 🔧 Usage in Code

### Loading the Database

```javascript
import fs from 'fs';
import path from 'path';

const keywordsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/keywords.json'), 'utf8')
);
```

### Using Stopwords

```javascript
// Combine all stopword categories
const stopwords = new Set([
  ...keywordsData.stopwords.english_common,
  ...keywordsData.stopwords.crypto_general,
  ...keywordsData.stopwords.crypto_actions,
  // ... add more as needed
]);

// Filter words
const word = "BITCOIN";
if (!stopwords.has(word)) {
  // This is a valid topic
}
```

### Using Sentiment Keywords

```javascript
// Get positive keywords
const positiveKeywords = [
  ...keywordsData.sentiment.positive.keywords,
  ...keywordsData.sentiment.positive.emojis
];

// Analyze sentiment
if (positiveKeywords.some(kw => text.includes(kw))) {
  sentiment = 'positive';
}
```

### Using Categories

```javascript
// Check if a topic is technology-related
const technologyKeywords = new Set(keywordsData.categories.technology);

if (technologyKeywords.has(topic)) {
  category = 'technology';
}
```

---

## 📈 Statistics

| Category | Count | Purpose |
|----------|-------|---------|
| **Stopwords (Total)** | **400+** | Filter noise |
| - English Common | 200+ | Basic filtering |
| - Crypto Specific | 200+ | Domain filtering |
| **Sentiment Keywords** | **250+** | Emotion detection |
| - Positive | 100+ | Bullish signals |
| - Negative | 100+ | Bearish signals |
| - Neutral | 20+ | Observation |
| - Emojis | 50+ | Visual sentiment |
| **Categories** | **300+** | Topic classification |
| **Special Cases** | **30+** | Edge case handling |
| **TOTAL** | **1000+** | Comprehensive coverage |

---

## ✏️ How to Update

### Adding New Stopwords

1. Open `keywords.json`
2. Find appropriate category in `stopwords`
3. Add to array in UPPERCASE
4. Save and restart backend

```json
{
  "stopwords": {
    "crypto_general": [
      "CRYPTO",
      "BLOCKCHAIN",
      "NEW_WORD_HERE"  // ← Add here
    ]
  }
}
```

### Adding Sentiment Keywords

```json
{
  "sentiment": {
    "positive": {
      "keywords": [
        "BULLISH",
        "NEW_POSITIVE_WORD"  // ← Add here
      ]
    }
  }
}
```

### Creating New Category

```json
{
  "categories": {
    "my_new_category": [
      "KEYWORD1",
      "KEYWORD2",
      "KEYWORD3"
    ]
  }
}
```

Then update code to use it:

```javascript
const myCategory = keywordsData.categories.my_new_category;
```

---

## 🌍 Multi-Language Support (Future)

Structure supports multiple languages:

```json
{
  "stopwords": {
    "english_common": ["THE", "IS", "WAS"],
    "turkish_common": ["VE", "BU", "VEYA"],
    "spanish_common": ["EL", "LA", "Y"]
  }
}
```

---

## 🧪 Testing

### Verify Stopwords Coverage

```javascript
const text = "THE BITCOIN MARKET IS BULLISH TODAY";
const words = text.split(' ');
const validTopics = words.filter(w => !stopwords.has(w));
// Result: ["BITCOIN", "BULLISH"] ✅
```

### Test Sentiment Detection

```javascript
const text = "BITCOIN PUMP 🚀 MOON";
const hasPositive = positiveKeywords.some(kw => text.includes(kw));
// Result: true ✅ (found: PUMP, 🚀, MOON)
```

---

## 📝 Best Practices

### ✅ Do's
- Keep keywords in UPPERCASE
- Group by semantic meaning
- Add comments for non-obvious terms
- Test after adding new keywords
- Update metadata version

### ❌ Don'ts
- Don't add duplicate keywords
- Don't mix languages in same category
- Don't add very rare terms (< 0.1% usage)
- Don't forget to update documentation
- Don't add emojis to keyword arrays

---

## 🔄 Maintenance

### Weekly
- Review new trending topics
- Check for missing stopwords
- Add emerging terminology

### Monthly
- Analyze false positives/negatives
- Update sentiment keywords
- Refine categories

### Quarterly
- Major version bump
- Restructure if needed
- Add new languages

---

## 📊 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-05 | Initial release with 1000+ keywords |

---

## 🤝 Contributing

To add keywords:

1. Identify the right category
2. Ensure keyword is UPPERCASE
3. Check for duplicates
4. Test with sample data
5. Update this README if adding new category
6. Increment version in metadata

---

## 📖 Related Documentation

- [CACHE_SYSTEM.md](./CACHE_SYSTEM.md) - Caching strategy
- [TRENDING_TOPICS.md](../TRENDING_TOPICS.md) - Topic detection algorithm
- [coins.json](./coins.json) - Cryptocurrency database
- [README.md](./README.md) - Coins database docs

---

**Maintained by:** ThatsAllToday Team  
**Last Updated:** November 5, 2025  
**Status:** ✅ Production Ready

