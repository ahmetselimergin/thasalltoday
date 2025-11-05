# Coins Database

Bu klasör, Telegram mesajlarından coin algılaması için kullanılan veritabanını içerir.

## 📁 Dosyalar

### `coins.json`
**1572 kripto para birimi** tanımlarını içerir (Bitcoin, Ethereum, Solana ve 1500+ altcoin).

## 🔧 Yapı

```json
{
  "coins": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "aliases": ["BITCOIN", "₿", "BTCUSD"]
    }
  ],
  "blacklist": ["THE", "AND", "FOR", ...]
}
```

### Coin Nesnesi
- **symbol**: Ana coin sembolü (büyük harf, örn: `BTC`)
- **name**: Coin'in tam adı (örn: `Bitcoin`)
- **aliases**: Alternatif isimler ve semboller (array)

### Blacklist
Coin olarak algılanmaması gereken yaygın kelimeler.

## ➕ Yeni Coin Ekleme

1. `coins.json` dosyasını aç
2. `coins` array'ine yeni obje ekle:

```json
{
  "symbol": "NEWCOIN",
  "name": "New Coin Name",
  "aliases": ["ALTERNATIVE1", "ALT2"]
}
```

3. Alfabetik sırayı korumaya gerek yok
4. Backend'i restart et

## 🔍 Algılama Nasıl Çalışır?

### 1. Dollar Sign ($) Algılama
```
Mesaj: "Buy $FET now!"
Algılanan: FET ✅
```

### 2. Büyük Harf Algılama
```
Mesaj: "RENDER looks bullish"
Algılanan: RENDER ✅
```

### 3. Alias Eşleştirme
```
Mesaj: "Bitcoin to the moon!"
Algılanan: BTC ✅ (alias: BITCOIN)
```

### 4. Blacklist Filtreleme
```
Mesaj: "BUY NOW FOR THE BEST"
Algılanan: Hiçbiri ❌ (blacklist)
```

## 📊 Özellikler

- ✅ **1572 coin** tanımı (sürekli güncelleniyor)
- ✅ **Dinamik algılama** ($ işareti, büyük harf)
- ✅ **Alias desteği** (Bitcoin → BTC, Ethereum → ETH)
- ✅ **Blacklist koruması** (THE, AND, etc. filtrelenir)
- ✅ **Noise reduction** (minimum 2 mention)
- ✅ **Top 15** en çok bahsedilen coin gösterilir
- ✅ **Otomatik merge** sistemi ile kolay güncelleme

## 🔄 Güncelleme

JSON dosyası her seferinde runtime'da yüklenir. 
Backend restart edildiğinde otomatik güncellenir.

## 💡 İpuçları

1. **Popular Coins First**: Popüler coinleri üste ekle (BTC, ETH, SOL, etc.)
2. **Complete Aliases**: Tüm alternatifleri ekle (BITCOIN, ₿)
3. **Blacklist Check**: Coin symbol'ü yaygın kelime değilse ekle
4. **Test After Adding**: Backend'i restart et ve test et

## 📝 Örnekler

### ✅ İyi Coin Tanımı
```json
{
  "symbol": "FET",
  "name": "Fetch.ai",
  "aliases": ["FETCH", "FETCHAI", "FETCH.AI"]
}
```

### ❌ Kötü Coin Tanımı
```json
{
  "symbol": "FOR",  // Blacklist'te var!
  "name": "ForCoin",
  "aliases": []
}
```

## 🚀 Gelecek İyileştirmeler

- [ ] CoinGecko API entegrasyonu (otomatik coin listesi)
- [ ] Real-time price bilgisi
- [ ] Market cap bazlı filtreleme
- [ ] Coin category'leri (DeFi, Gaming, etc.)

---

**Son Güncelleme**: 2025  
**Coin Sayısı**: **1572** (sürekli artıyor)  
**Bakım**: Otomatik merge scripti ile kolay güncelleme  
**Merge Script**: `node scripts/merge-coins.js`

