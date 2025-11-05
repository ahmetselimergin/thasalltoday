# 🔍 Production Debug Checklist

## Sorun: Trending Topics gösterilmiyor

### ✅ Kontrol Edilenler:
- [x] Component kodu var (`frontend/src/components/trendingTopics/main.tsx`)
- [x] API endpoint var (`backend/routes/telegramRoutes.js`)
- [x] Import yapılmış (`frontend/src/pages/TelegramTrends.tsx`)
- [x] Local build'de component var (`dist/assets/index-nLwA7SSg.js`)
- [x] Git'e commit edilmiş
- [x] Push yapıldı

### ❌ Sorunlar:
- Network tab'da `/trending-topics` API çağrısı YOK
- Component render olmuyor

## 🐛 Debugging Steps

### 1. Console Errors
```
F12 → Console tab
→ Kırmızı error var mı?
→ getTrendingTopics ile ilgili hata var mı?
```

### 2. Component Mount Check
```javascript
// Console'a yaz:
document.querySelector('.trending-topics-container')
// Sonuç: null → Component render olmamış
// Sonuç: <div> → Component var ama gizli
```

### 3. React DevTools
```
F12 → React DevTools (eklenti gerekli)
→ Component tree'de TrendingTopics var mı?
```

### 4. Vercel Build Log
```
1. https://vercel.com/dashboard
2. thasalltoday → Deployments
3. Son deployment → Logs
4. "Building..." kısmında error var mı?
5. TypeScript compile error?
```

## 🔧 Olası Çözümler

### A. Vercel Build Cache Temizle
```
Vercel Dashboard
→ Settings
→ Clear Build Cache
→ Redeploy
```

### B. Environment Variables
```
Vercel Dashboard
→ Settings → Environment Variables
→ VITE_API_URL doğru mu?
```

### C. TypeScript Compile Error
```bash
# Local'de test et:
cd frontend
npm run build

# Error varsa düzelt
```

### D. Import Path Hatası
Kontrol et: `TelegramTrends.tsx`
```typescript
import TrendingTopics from '../components/trendingTopics/main';
```

Path doğru mu? Büyük/küçük harf?

### E. Conditional Render
Kontrol et: Component bir condition içinde mi?
```typescript
// ❌ YANLIŞ (gösterilmez):
{loading && <TrendingTopics />}

// ✅ DOĞRU:
<TrendingTopics />
```

## 🎯 Hızlı Test

### Local Test
```bash
cd frontend
npm run dev
# http://localhost:5173/application/telegram
# Trending Topics görünüyor mu?
```

Eğer local'de **gösteriliyorsa** → Vercel deploy problemi
Eğer local'de **gösterilmiyorsa** → Code problemi

## 📞 Support Info

**Deployment URL**: https://thasalltoday-d59g9lsu3-asease42s-projects.vercel.app
**Backend URL**: Render deployment
**Last Commit**: "Force rebuild for TrendingTopics component"
**Date**: 2025-11-05

