# 👕 Sign My Shirt

Dijital mezuniyet gömleği uygulaması. Arkadaşlarınla paylaş, gömleğine imza topla!

![Sign My Shirt Preview](preview.png)

## ✨ Özellikler

- 🎨 Gerçekçi uzun kollu gömlek tasarımı
- ✍️ Sürükle-bırak ile mesajları taşıma
- 🔄 Firebase ile gerçek zamanlı senkronizasyon
- 📱 Mobil uyumlu (responsive) tasarım
- 🔗 Kolay paylaşılabilir linkler
- 🏫 Okul logosu ekleme desteği
- 🎨 8 farklı kalem rengi

## 🚀 Kurulum

### 1. Projeyi klonla

```bash
git clone https://github.com/kullaniciadin/sign-my-shirt.git
cd sign-my-shirt
npm install
```

### 2. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/)'a git
2. "Add project" ile yeni proje oluştur
3. Firestore Database'i etkinleştir (test mode)
4. Project Settings > Your apps > Web app ekle
5. Config bilgilerini kopyala

### 3. Environment Variables

Proje kök dizininde `.env` dosyası oluştur:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Güvenlik Kuralları

Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Gömlekler - herkes okuyabilir, oluşturabilir
    match /shirts/{shirtId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      
      // İmzalar - herkes okuyabilir ve ekleyebilir
      match /signatures/{signatureId} {
        allow read: if true;
        allow create: if true;
        allow update: if true;
        allow delete: if false; // Silme kapalı
      }
    }
  }
}
```

### 5. Çalıştır

```bash
npm start
```

Tarayıcıda `http://localhost:3000` adresinde açılacak.

## 📁 Proje Yapısı

```
sign-my-shirt/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Home.jsx          # Ana sayfa - gömlek oluşturma
│   │   └── SignMyShirt.jsx   # Gömlek görüntüleme/imzalama
│   ├── firebase/
│   │   ├── config.js         # Firebase config
│   │   └── hooks.js          # Firebase hooks & functions
│   ├── App.js                # Router
│   └── index.js              # Entry point
├── .env                      # Environment variables (oluşturman gerek)
├── .gitignore
├── package.json
└── README.md
```

## 🌐 Deploy (Vercel)

1. [Vercel](https://vercel.com)'e GitHub ile giriş yap
2. "Import Project" > GitHub reposunu seç
3. Environment Variables ekle (Firebase config)
4. Deploy!

## 🛠️ Teknolojiler

- **React** - Frontend framework
- **Firebase Firestore** - Realtime database
- **React Router** - Routing
- **nanoid** - Unique ID generation

## 📱 Kullanım

1. Ana sayfada ismini gir
2. Okul adı ve mezuniyet yılını seç (opsiyonel)
3. "Gömleğimi Oluştur" butonuna tıkla
4. Oluşan linki arkadaşlarınla paylaş
5. Arkadaşların gömleğine mesaj yazabilir!

## 🎨 Özelleştirme

### Gömlek Rengini Değiştirme

`SignMyShirt.jsx` dosyasında SVG gradient'ını düzenle:

```jsx
<linearGradient id="shirtFabric" ...>
  <stop offset="0%" stopColor="#YENI_RENK" />
  ...
</linearGradient>
```

### Okul Logosu Ekleme

Firebase'e logo URL'i ekle veya `updateSchoolLogo` fonksiyonunu kullan.

## 🤝 Katkıda Bulunma

1. Fork'la
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit et (`git commit -m 'Add amazing feature'`)
4. Push et (`git push origin feature/amazing-feature`)
5. Pull Request aç

## 📄 Lisans

MIT License - istediğin gibi kullanabilirsin!

## 💖 Teşekkürler

Mezuniyet sezonu için yapıldı! 🎓

---

**Sorular?** Issue aç veya [email] ile ulaş.
