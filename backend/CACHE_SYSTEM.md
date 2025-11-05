# 💾 Cache System Documentation

## 📋 Genel Bakış

Telegram API'ye yapılan aşırı istekleri önlemek ve performansı artırmak için **15 dakikalık cache** sistemi eklenmiştir.

## 🎯 Neden Cache?

### Problemler (Cache Öncesi):
❌ **Her 15 dakikada** → Backend'e API isteği  
❌ **Her istek** → Telegram'dan 100+ mesaj çekiliyor  
❌ **Aynı veri** → Tekrar tekrar analiz ediliyor  
❌ **API Limitleri** → Flood wait riski yüksek  
❌ **Yavaş Response** → Her istek 10-30 saniye sürebiliyor  

### Çözüm (Cache Sonrası):
✅ **İlk istek** → Telegram'dan veri çek, cache'le  
✅ **Sonraki istekler** → Cache'den anında dön  
✅ **15 dakika sonra** → Yeniden çek ve cache'i güncelle  
✅ **API Koruması** → Flood wait olmaz  
✅ **Hızlı Response** → Cache'den 10-50ms  

## ⚙️ Nasıl Çalışır?

### Cache Yapısı

```javascript
this.cache = {
  channels: {
    data: null,           // Cached channel data
    timestamp: null,      // Cache creation time
    ttl: 15 * 60 * 1000  // 15 minutes = 900,000ms
  },
  coins: {
    data: null,           // Cached coin analysis
    timestamp: null,      // Cache creation time
    ttl: 15 * 60 * 1000  // 15 minutes = 900,000ms
  }
}
```

### İstek Akışı

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend Request (Her 15 dakikada)                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │  Backend: getTrendingCoins()  │
        └───────────────┬───────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Cache Check          │
            └───────┬───────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
  Cache VALID              Cache EXPIRED
  (< 15 min)               (> 15 min)
        │                       │
        ▼                       ▼
  ┌──────────┐          ┌──────────────┐
  │  Return  │          │  Fetch from  │
  │  Cache   │          │  Telegram    │
  │  (10ms)  │          │  API         │
  └──────────┘          │  (10-30s)    │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Update      │
                        │  Cache       │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Return      │
                        │  Fresh Data  │
                        └──────────────┘
```

## 📊 Örnek Senaryo

### Zaman: 10:00 - İlk İstek
```
Request → Cache MISS → Telegram API çağrısı
├─ 10 kanal × 100 mesaj = 1000 mesaj çekildi
├─ Coin analizi yapıldı
├─ Cache'e kaydedildi (timestamp: 10:00)
└─ Response: 15 trending coin (25 saniye)
```

### Zaman: 10:05 - 2. İstek
```
Request → Cache HIT (age: 5 dakika)
├─ Telegram API çağrısı YOK
├─ Cache'den döndü
└─ Response: 15 trending coin (15ms) ⚡
```

### Zaman: 10:10 - 3. İstek
```
Request → Cache HIT (age: 10 dakika)
├─ Telegram API çağrısı YOK
├─ Cache'den döndü
└─ Response: 15 trending coin (15ms) ⚡
```

### Zaman: 10:16 - 4. İstek
```
Request → Cache EXPIRED (age: 16 dakika > 15 dakika)
├─ Telegram API çağrısı yapıldı
├─ Yeni veri çekildi
├─ Cache güncellendi (timestamp: 10:16)
└─ Response: 15 trending coin (23 saniye)
```

## 🔍 Cache Fonksiyonları

### `isCacheValid(cacheKey)`
Cache'in hala geçerli olup olmadığını kontrol eder.

```javascript
isCacheValid('coins')
// Returns: true (< 15 dakika) veya false (> 15 dakika)
```

### `setCache(cacheKey, data)`
Veriyi cache'e kaydeder ve timestamp'i günceller.

```javascript
setCache('coins', trendingCoinsData)
// Console: "💾 Cache set for 'coins' (TTL: 15 minutes)"
```

### `getCache(cacheKey)`
Cache'den veriyi döndürür (geçerliyse).

```javascript
getCache('coins')
// Console: "✅ Cache HIT for 'coins' (age: 120s)"
// Returns: cached data
```

## 📈 Performans İyileştirmesi

### Öncesi (Cache Yok):
```
10 istek/saat × 25 saniye = 250 saniye toplam bekleme
10 istek/saat × 1000 mesaj = 10,000 Telegram API çağrısı
```

### Sonrası (Cache Var):
```
1 istek/15dk × 25 saniye = 100 saniye toplam bekleme ✅ %60 azalma
4 istek/saat × 1000 mesaj = 4,000 Telegram API çağrısı ✅ %60 azalma
9 istek/saat × 15ms = 135ms (cache'den) ⚡ Hızlı
```

## 🎛️ Cache Ayarları

Cache süresini değiştirmek için `telegramService.js`:

```javascript
// 5 dakika cache
ttl: 5 * 60 * 1000

// 30 dakika cache
ttl: 30 * 60 * 1000

// 1 saat cache
ttl: 60 * 60 * 1000
```

## 🔄 Frontend Senkronizasyonu

Frontend'in güncelleme aralığı cache TTL ile senkronize edildi:

**Öncesi:**
```typescript
// Her 5 dakikada güncelle (cache yokken)
const interval = setInterval(fetchTrendingCoins, 5 * 60 * 1000);
```

**Sonrası:**
```typescript
// Her 15 dakikada güncelle (cache TTL ile aynı)
const interval = setInterval(fetchTrendingCoins, 15 * 60 * 1000);
```

## 💡 Best Practices

### ✅ Yapılması Gerekenler:
- Cache TTL'i frontend güncelleme aralığı ile eşit tut
- Cache yaşını console'da logla (debugging için)
- Cache miss durumunda Telegram API'yi çağır
- Her yeni veriyi cache'e kaydet

### ❌ Yapılmaması Gerekenler:
- Cache'i çok kısa tutma (< 5 dakika) → API yükü
- Cache'i çok uzun tutma (> 1 saat) → Eski veri
- Cache olmadan çok sık istek yapma → Flood wait
- Cache hatalarını ignore etme → Fallback ekle

## 🐛 Troubleshooting

### Cache Çalışmıyor
```bash
# Backend logs'u kontrol et
# Görmek istediğin:
# ✅ Cache HIT → Cache çalışıyor
# ❌ Cache MISS → Her istekte çağrılıyor (yanlış)

# Olası sebepler:
# - Cache TTL çok kısa
# - Frontend çok sık istek atıyor
# - Backend restart oldu (cache temizlendi)
```

### Her İstek Yavaş
```bash
# Cache MISS sayısı çok fazla olabilir
# Çözüm:
# 1. Cache TTL'i artır (30 dakika)
# 2. Frontend güncelleme aralığını artır
# 3. Logs'u kontrol et: "Cache HIT" görmeli
```

### Veriler Güncel Değil
```bash
# Cache TTL çok uzun olabilir
# Çözüm:
# 1. Cache TTL'i azalt (10 dakika)
# 2. Manuel cache temizleme ekle
# 3. Real-time data gerekiyorsa cache'i devre dışı bırak
```

## 📝 Logs Örnekleri

### Başarılı Cache HIT:
```
✅ Cache HIT for 'coins' (age: 120s)
🪙 Trending coins returned from cache
Response time: 15ms
```

### Cache MISS ve Yenileme:
```
❌ Cache MISS for 'coins' (expired or empty)
📱 Fetching REAL Telegram data from API...
✅ Successfully fetched data from 10 channels
🪙 Trending coins with sentiment: [...]
💾 Cache set for 'coins' (TTL: 15 minutes)
Response time: 23,456ms
```

---

**Cache Durumu:** ✅ Aktif  
**TTL:** 15 dakika  
**Cache Keys:** `channels`, `coins`  
**Frontend Sync:** ✅ 15 dakika interval  

