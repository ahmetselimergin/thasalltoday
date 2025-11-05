# 📌 Trending Topics Feature

## 📋 Genel Bakış

Telegram kanallarındaki mesajlardan **en çok konuşulan konuları** otomatik olarak çıkaran NLP-benzeri bir analiz sistemi.

## 🎯 Özellikler

### 1️⃣ Keyword Extraction
- Mesajlardan **2-15 karakter** arası kelimeleri çıkarır
- **Stopwords** (yaygın kelimeler) filtrelenir
- **Coin sembolleri** filtrelenir (coin trendlerinden ayrı)
- **Minimum 3 mention** gerektirir

### 2️⃣ Phrase Detection (Bigrams)
- **2 kelimelik ifadeleri** yakalar ("BULL MARKET", "ATH SOON")
- Daha anlamlı trend tespiti
- **Minimum 2 mention** gerektirir

### 3️⃣ Smart Filtering
- ✅ **English stopwords** - THE, BE, TO, AND, vb.
- ✅ **Crypto stopwords** - CRYPTO, TOKEN, PRICE, vb.
- ✅ **Coin symbols** - BTC, ETH, SOL (coinler ayrı gösteriliyor)
- ✅ **Blacklist** - Yaygın kelimeler

## 🔍 Nasıl Çalışır?

### Backend Analiz Akışı

```
1. Telegram Kanallarından Mesajları Çek
   └─ Son 48 saatin mesajları
   └─ Kanal başına max 20 mesaj (normalizasyon)

2. Text Analysis
   ├─ Büyük harfe çevir
   ├─ Kelimeleri çıkar (regex: \b[A-Z]{2,15}\b)
   └─ 2-kelimelik ifadeleri bul (bigrams)

3. Filtering
   ├─ Stopwords filtreleme
   ├─ Coin symbols filtreleme
   └─ Blacklist kontrolü

4. Frequency Counting
   ├─ Her kelime için mention sayısı
   └─ Her phrase için mention sayısı

5. Sorting & Ranking
   ├─ Mention sayısına göre sırala
   ├─ Top 10 kelime
   ├─ Top 5 phrase
   └─ Toplam Top 10 döndür

6. Cache
   └─ 15 dakika cache (API yükünü azalt)
```

## 📊 Örnek Sonuçlar

### Output Formatı
```json
[
  {
    "topic": "HALVING",
    "type": "keyword",
    "mentions": 15
  },
  {
    "topic": "BULL MARKET",
    "type": "phrase",
    "mentions": 12
  },
  {
    "topic": "INSTITUTIONAL",
    "type": "keyword",
    "mentions": 10
  }
]
```

## 🎨 Frontend Display

### TrendingTopics Component

**Features:**
- ✅ **Top 3 vurgu** - Altın, gümüş, bronz renkler
- ✅ **Emoji icons** - Görsel zenginlik
- ✅ **Type badge** - Keyword vs Phrase ayrımı
- ✅ **Mention count** - Kaç kez geçtiği
- ✅ **Responsive grid** - Mobil uyumlu
- ✅ **Hover animasyonlar** - Modern UX
- ✅ **Last update time** - Şeffaflık

### UI Components

```
┌─────────────────────────────────────────────────┐
│  📌 Trending Topics                             │
│  Most discussed topics (last 48 hours)          │
│  • Last updated: 10:30:45                       │
├─────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │#1 🔥   │  │#2 ⚡   │  │#3 💡   │        │
│  │HALVING │  │MARKET  │  │BITCOIN │        │
│  │15 ment │  │12 ment │  │10 ment │        │
│  │keyword │  │keyword │  │keyword │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │#4 🎯 BULL MARKET│  │#5 ⭐ ADOPTION   │   │
│  │8 mentions       │  │7 mentions       │   │
│  │2-word phrase    │  │keyword          │   │
│  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────┘
```

## 🔧 API Endpoints

### GET /api/telegram/trending-topics

**Auth:** Required (JWT token)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "topic": "HALVING",
      "type": "keyword",
      "mentions": 15
    }
  ]
}
```

**Cache:** 15 minutes

## 📝 Keywords Database

### JSON-Based System
All keywords are now stored in **`backend/data/keywords.json`** for easy maintenance.

**Benefits:**
- ✅ **1000+ keywords** organized in categories
- ✅ **Easy updates** without touching code
- ✅ **Version controlled** and documented
- ✅ **Scalable** for multi-language support

### Categories

#### Stopwords (400+)
- **English Common** (200+): THE, BE, TO, OF, AND, etc.
- **Crypto General** (30+): CRYPTO, COIN, TOKEN, BLOCKCHAIN
- **Crypto Actions** (30+): TRADE, BUY, SELL, HOLD, STAKE
- **Crypto Metrics** (25+): PRICE, VOLUME, CAP, TVL, APR
- **Social Media** (25+): READ, FOLLOW, SHARE, SUBSCRIBE
- **Time References** (30+): TODAY, WEEK, MONTH, RECENTLY
- And more...

#### Sentiment Keywords (250+)
- **Positive** (100+): BULLISH, MOON, PUMP, RALLY, 🚀, 📈
- **Negative** (100+): BEARISH, DUMP, CRASH, SCAM, 📉, 🔴
- **Neutral** (20+): STABLE, CONSOLIDATION, SIDEWAYS

#### Topic Categories (300+)
- **Technology**: LAYER2, ZKEVM, DEFI, NFT
- **Finance**: INFLATION, FED, RECESSION, GDP
- **Regulation**: SEC, COMPLIANCE, KYC, AML
- **Events**: HALVING, AIRDROP, LISTING, CONFERENCE
- **Institutions**: BLACKROCK, GRAYSCALE, FIDELITY
- **Market Structure**: WHALE, LIQUIDITY, FUTURES

**Full Documentation:** [KEYWORDS_README.md](./data/KEYWORDS_README.md)

## 🎯 Filtreleme Kuralları

### Kelime için:
```javascript
if (
  stopwords.has(word) ||        // Yaygın kelime mi?
  knownCoinSymbols.has(word) || // Coin sembolü mü?
  coinBlacklist.has(word)       // Blacklist'te mi?
) {
  // Filtrele
}
```

### Phrase için:
```javascript
if (
  stopwords.has(word1) || stopwords.has(word2) ||
  knownCoinSymbols.has(word1) || knownCoinSymbols.has(word2) ||
  coinBlacklist.has(word1) || coinBlacklist.has(word2)
) {
  // Filtrele
}
```

## 📈 Performans

### Analiz Süresi
- **İlk çağrı**: ~25 saniye (Telegram API + analiz)
- **Cache hit**: ~15ms ⚡

### Veri İşleme
- **10 kanal** × **20 mesaj** = 200 mesaj
- **Ortalama**: 1000+ kelime analiz ediliyor
- **Output**: Top 10 topic

### Cache Stratejisi
- **TTL**: 15 dakika
- **Auto-refresh**: Frontend her 15 dakikada
- **API tasarrufu**: %60 azalma

## 💡 Kullanım Senaryoları

### 1. Trend Takibi
Kripto dünyasında ne konuşuluyor anında gör:
- "HALVING" → Bitcoin yarılanması yaklaşıyor
- "BULL MARKET" → Piyasa yükseliş trendinde
- "REGULATION" → Düzenleme haberleri gündemde

### 2. Sentiment Analysis
Topic'lerle birlikte coin sentiment'i kıyasla:
- Topic: "ADOPTION" ✅ + Coin: "BTC" 📈 = Pozitif trend
- Topic: "CRASH" ❌ + Coin: "ETH" 📉 = Negatif trend

### 3. Market Intelligence
Hangi konular popüler oluyor izle:
- Teknoloji: ZKEVM, LAYER2, DEFI
- Makro: INFLATION, FED, ETFS
- Events: CONFERENCE, LAUNCH, AIRDROP

## 🔍 İleri Seviye Özellikler (Gelecek)

### Planlanan İyileştirmeler:

1. **Trigrams (3-word phrases)**
   - "BULL MARKET CONFIRMED"
   - Daha spesifik trendler

2. **Sentiment per Topic**
   - Her topic için pozitif/negatif analiz
   - "CRASH" → %80 negatif

3. **Time-series Analysis**
   - Hangi topic yükselişte?
   - Hangi topic düşüşte?
   - Trend momentum

4. **Category Clustering**
   - Technology topics
   - Market topics
   - News topics
   - Event topics

5. **Multi-language Support**
   - Türkçe stopwords
   - Çince, Japonca, vb.

6. **Named Entity Recognition (NER)**
   - Person names: "VITALIK", "SATOSHI"
   - Company names: "COINBASE", "BINANCE"
   - Protocol names: "ETHEREUM", "SOLANA"

## 🐛 Troubleshooting

### Topic Görünmüyor
```
Sebep: Minimum mention threshold (3 mention)
Çözüm: Backend'de threshold'u düşür (2'ye)
```

### Alakasız Kelimeler
```
Sebep: Stopwords listesi eksik
Çözüm: backend/services/telegramService.js'te stopwords'e ekle
```

### Coin Sembolleri Görünüyor
```
Sebep: Coin filtreleme çalışmıyor
Çözüm: knownCoinSymbols Set'ini kontrol et
```

### Cache Çalışmıyor
```
Sebep: Backend restart oldu
Çözüm: Normal, 15 dakika sonra yeniden cache'lenecek
```

## 📊 Metrics & Analytics

### Backend Logs
```bash
# Başarılı topic extraction:
📌 Top trending topics: [
  { topic: 'HALVING', type: 'keyword', mentions: 15 },
  { topic: 'BULL MARKET', type: 'phrase', mentions: 12 }
]
💾 Cache set for 'topics' (TTL: 15 minutes)
```

### Cache Performance
```bash
# Cache HIT:
✅ Cache HIT for 'topics' (age: 240s)
Response time: 15ms ⚡

# Cache MISS:
❌ Cache MISS for 'topics' (expired or empty)
📱 Fetching REAL Telegram data...
Response time: 23,456ms
```

## 🎨 Styling Variables

### Color Scheme
```scss
// Top 3 topics
--gradient-primary: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); // Gold
--gradient-secondary: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%); // Silver
--gradient-tertiary: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%); // Bronze

// Other topics
--topic-color: rgba(1, 148, 254, 0.8); // Blue
```

## ✅ Feature Checklist

- [x] Backend: getTrendingTopics() fonksiyonu
- [x] Backend: Stopwords filtreleme
- [x] Backend: Coin filtreleme
- [x] Backend: Bigram phrase detection
- [x] Backend: Frequency analysis
- [x] Backend: Cache sistemi
- [x] Backend: API endpoint
- [x] Frontend: TrendingTopics component
- [x] Frontend: Responsive design
- [x] Frontend: Animasyonlar
- [x] Frontend: Last update time
- [x] Frontend: API entegrasyonu
- [x] Documentation

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Cache TTL:** 15 minutes  
**Last Updated:** November 5, 2025

