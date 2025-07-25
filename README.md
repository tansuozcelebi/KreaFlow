# 🏖️ Yıllık İzin Onay Sistemi

React Flow tabanlı görsel yıllık izin onay süreci uygulaması. Bu uygulama, çalışanların izin taleplerini göndermelerini, amirlerin bu talepleri onaylamalarını ve tüm sürecin görsel akış ile takip edilmesini sağlar.

## ✨ Özellikler

### 🎯 Ana Özellikler
- ✅ **Görsel Akış**: React Flow ile etkileşimli onay süreci görselleştirmesi
- 📧 **Email Entegrasyonu**: Otomatik email bildirimleri (Nodemailer)
- 🔄 **Akıllı Süreç Yönetimi**: Amir → Üst Amir → Onay/Red akışı
- 📊 **Dashboard**: Tüm izin taleplerinin listesi ve detayları
- 🎨 **Modern UI**: Styled Components ile güzel tasarım
- 📱 **Responsive**: Mobil uyumlu tasarım

### 🔄 Onay Süreci
1. **Çalışan** izin talebini oluşturur
2. **Doğrudan Amir** talebi onaylar/reddeder
3. Onaylandıysa **Üst Amir**'e gider
4. **Üst Amir** final onayı verir
5. **Red durumunda** talep geri döner
6. **Email bildirimleri** her aşamada gönderilir

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 16+ 
- npm veya yarn

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Environment Variables Ayarlayın
`.env` dosyasını düzenleyin:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
PORT=3001

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Uygulamayı Başlatın

#### Tek komutla (önerilen):
```bash
npm run dev
```
Bu komut hem backend hem frontend'i aynı anda başlatır.

#### Ayrı ayrı çalıştırma:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm start
```

### 4. Uygulamaya Erişin
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📧 Email Konfigürasyonu

### Gmail Kullanımı
1. Gmail hesabınızda 2FA'yı aktif edin
2. Uygulama parolası oluşturun
3. `.env` dosyasında email ayarlarını güncelleyin

### Alternatif Email Servisleri
- SendGrid
- Mailgun
- Outlook/Hotmail
- AWS SES

## 🎮 Kullanım Kılavuzu

### Yeni İzin Talebi Oluşturma
1. Sol panelde formu doldurun
2. Çalışan bilgileri, tarihler, sebep girin
3. Amir ve üst amir email adreslerini ekleyin
4. "İzin Talebini Gönder" butonuna tıklayın

### Onay Süreci Takibi
1. "Onay Akışı" sekmesini seçin
2. Dropdown'dan izin talebini seçin
3. Görsel akışta mevcut durumu görün
4. Aktif düğümlerde "Onayla/Reddet" butonları

### İzin Talepleri Listesi
1. "İzin Talepleri" sekmesini seçin
2. Tüm taleplerin listesini görün
3. Detaylar için karta tıklayın
4. Süreç geçmişini inceleyin

## 🛠️ Teknoloji Stack

### Frontend
- **React 18**: UI framework
- **React Flow**: Görsel akış diyagramları
- **Styled Components**: CSS-in-JS styling
- **Axios**: HTTP client
- **Date-fns**: Tarih işlemleri

### Backend
- **Express.js**: Web framework
- **Nodemailer**: Email gönderimi
- **CORS**: Cross-origin requests
- **dotenv**: Environment variables

## 📁 Proje Yapısı

```
├── src/
│   ├── components/
│   │   ├── ApprovalFlow.js      # Ana akış bileşeni
│   │   ├── CustomNode.js        # Özel düğüm bileşeni
│   │   ├── Dashboard.js         # İzin talepleri listesi
│   │   ├── LeaveRequestForm.js  # İzin talep formu
│   │   └── RequestSelector.js   # Talep seçim dropdown'u
│   ├── services/
│   │   └── EmailService.js      # Email API servisi
│   ├── App.js                   # Ana uygulama
│   └── index.js                 # Giriş noktası
├── server/
│   └── server.js                # Express backend
├── public/
│   └── index.html               # HTML şablonu
├── package.json                 # Dependencies
└── README.md                    # Bu dosya
```

## 🎨 Özelleştirme

### Akış Düğümlerini Özelleştirme
`src/components/CustomNode.js` dosyasında düğüm tasarımını değiştirebilirsiniz.

### Email Şablonları
`server/server.js` dosyasında `emailTemplates` objesini düzenleyerek email tasarımını özelleştirebilirsiniz.

### Onay Süreci Kuralları
`src/components/ApprovalFlow.js` dosyasında `handleApproval` fonksiyonunu düzenleyerek iş kurallarını değiştirebilirsiniz.

## 🐛 Bilinen Sorunlar ve Çözümler

### Email Gönderilmiyor
- Gmail için uygulama parolası kullandığınızdan emin olun
- SMTP ayarlarını kontrol edin
- Firewall/antivirus yazılımlarını kontrol edin

### Port Çakışması
- 3000 veya 3001 portları kullanımdaysa farklı portlar seçin
- `.env` dosyasında PORT değişkenini güncelleyin

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız veya önerileriniz için:
- GitHub Issues açın
- Email: developer@company.com

---

**Not**: Bu uygulama demo amaçlıdır. Gerçek production kullanımı için güvenlik, performans ve ölçeklenebilirlik geliştirmeleri yapılmalıdır.
