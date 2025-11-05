# 🚀 Render Deployment Guide

Bu rehber projenizi Render'a nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Önkoşullar

- GitHub hesabınız olmalı
- Render.com hesabınız olmalı (ücretsiz)
- MongoDB Atlas veya başka bir MongoDB database
- Telegram API credentials

## 🎯 Deploy Adımları

### 1. GitHub'a Push

```bash
git add .
git commit -m "Add Render deployment config"
git push origin main
```

### 2. Render Dashboard'a Git

[Render.com](https://render.com) → Dashboard → **New Blueprint**

### 3. Repository Bağla

- GitHub repository'nizi seçin: `thasalltoday`
- Render otomatik olarak `render.yaml` dosyasını bulacak

### 4. Environment Variables Ekle

Backend için şu değişkenleri ekleyin:

#### Backend Environment Variables

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thasalltoday
JWT_SECRET=your-super-secret-jwt-key-change-this
TELEGRAM_API_ID=your-telegram-api-id
TELEGRAM_API_HASH=your-telegram-api-hash
TELEGRAM_SESSION=your-telegram-session-string
TELEGRAM_PHONE=+905xxxxxxxxx
```

#### Frontend Environment Variables

```
VITE_API_URL=https://thasalltoday-backend.onrender.com
```

**⚠️ ÖNEMLİ**: Backend deploy olduktan sonra gerçek URL'yi buraya yazın!

### 5. Deploy Başlat

- **"Apply"** butonuna basın
- Render otomatik olarak:
  1. ✅ Kodu çekecek
  2. ✅ `npm install` çalıştıracak
  3. ✅ Build edecek
  4. ✅ Deploy edecek

### 6. URL'leri Güncelle

Deploy bittikten sonra:

1. Backend URL'inizi kopyalayın: `https://thasalltoday-backend.onrender.com`
2. Frontend'in `VITE_API_URL` değişkenini güncelleyin
3. Frontend otomatik yeniden deploy olacak

## 🔄 Otomatik Deploy

**Her `git push` yaptığınızda:**

✅ Render otomatik olarak değişiklikleri algılar  
✅ Build işlemini başlatır  
✅ Başarılı olursa deploy eder  
✅ Hata varsa sizi bilgilendirir

```bash
# Değişiklik yap
git add .
git commit -m "Update feature"
git push

# Render otomatik olarak deploy edecek!
```

## 📊 Monitoring

Render Dashboard'dan:

- **Logs**: Gerçek zamanlı log izleme
- **Metrics**: CPU, Memory kullanımı
- **Events**: Deploy geçmişi
- **Shell**: Container'a SSH erişimi

## 🔍 Health Check

Backend health check endpoint'i:

```
GET https://thasalltoday-backend.onrender.com/api/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-11-05T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## ⚡ Free Plan Limitleri

- **750 saat/ay** ücretsiz
- **15 dakika inaktivite** sonra sleep mode
- İlk istek 30-60 saniye gecikebilir (cold start)

### Cold Start'ı Önleme (Opsiyonel)

UptimeRobot gibi bir servis kullanarak her 10 dakikada bir health check yapabilirsiniz:

```
https://uptimerobot.com
→ Add Monitor
→ Type: HTTP(s)
→ URL: https://thasalltoday-backend.onrender.com/api/health
→ Interval: 10 minutes
```

## 🐛 Troubleshooting

### Build Hatası

```bash
# Logs'u kontrol et
Render Dashboard → Service → Logs

# Local'de test et
cd backend
npm install
npm start
```

### Environment Variables Eksik

```bash
# Render Dashboard'dan kontrol et
Service → Environment → Add Environment Variable
```

### CORS Hatası

Backend `server.js` dosyasında Render URL'lerini ekledik:

```javascript
origin.endsWith('.onrender.com')
```

### Database Bağlantı Hatası

MongoDB Atlas'ta:
1. **Network Access** → IP whitelist'e `0.0.0.0/0` ekle
2. **Database Access** → User credentials kontrol et

## 🎉 Deploy Tamamlandı!

- **Frontend**: `https://thasalltoday-frontend.onrender.com`
- **Backend**: `https://thasalltoday-backend.onrender.com`
- **API Health**: `https://thasalltoday-backend.onrender.com/api/health`

## 📝 Notlar

- ✅ Otomatik HTTPS sertifikası (SSL)
- ✅ Otomatik deploy (git push)
- ✅ Free plan ile test edebilirsiniz
- ✅ Upgrade ile cold start'tan kurtulabilirsiniz

---

**Need Help?**
- [Render Docs](https://render.com/docs)
- [Render Community](https://community.render.com)

