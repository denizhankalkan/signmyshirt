# 👕 Sign My Shirt

A digital graduation shirt signing platform. Create your virtual shirt, share the link, and collect messages from friends and classmates.

![Sign My Shirt Preview](preview.png)

## Overview

Sign My Shirt transforms the traditional graduation shirt signing experience into a digital format. Users create personalized shirts, share unique links, and allow others to leave messages — all synchronized in real-time.

## Features

- **Realistic Shirt Design** — SVG-based long-sleeve shirt with collar, cuffs, buttons, and pocket details
- **Drag & Drop** — Reposition messages anywhere on the shirt
- **Real-time Sync** — Firebase-powered instant updates across all devices
- **Mobile Responsive** — Optimized for both desktop and mobile experiences
- **Shareable Links** — Unique URL for each shirt
- **School Logo Support** — Dedicated area for custom school branding
- **Color Selection** — 8 pen color options for signatures

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend framework |
| Firebase Firestore | Real-time database |
| React Router v6 | Client-side routing |
| nanoid | Unique ID generation |

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account

### Installation

```bash
git clone https://github.com/yourusername/sign-my-shirt.git
cd sign-my-shirt
npm install
```

### Firebase Setup

1. Navigate to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database (start in test mode)
4. Go to Project Settings > Your apps > Add web app
5. Copy the configuration object

### Environment Configuration

Create a `.env` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Firestore Security Rules

Apply the following rules in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shirts/{shirtId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      
      match /signatures/{signatureId} {
        allow read: if true;
        allow create: if true;
        allow update: if true;
        allow delete: if false;
      }
    }
  }
}
```

### Run Development Server

```bash
npm start
```

Application will be available at `http://localhost:3000`

## Project Structure

```
sign-my-shirt/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Home.jsx              # Landing page & shirt creation
│   │   └── SignMyShirt.jsx       # Main shirt view & signing
│   ├── firebase/
│   │   ├── config.js             # Firebase initialization
│   │   └── hooks.js              # Custom hooks & database operations
│   ├── App.js                    # Route configuration
│   └── index.js                  # Application entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Import the project
3. Add environment variables in project settings
4. Deploy

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Usage

1. Enter your name on the homepage
2. Optionally add school name and graduation year
3. Click "Create My Shirt"
4. Share the generated link with friends
5. Recipients can add their messages to your shirt

## Customization

### Shirt Color

Modify the SVG gradient in `SignMyShirt.jsx`:

```jsx
<linearGradient id="shirtFabric" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stopColor="#YOUR_COLOR_1" />
  <stop offset="50%" stopColor="#YOUR_COLOR_2" />
  <stop offset="100%" stopColor="#YOUR_COLOR_3" />
</linearGradient>
```

### School Logo

Use the `updateSchoolLogo` function from hooks:

```javascript
import { updateSchoolLogo } from './firebase/hooks';

await updateSchoolLogo(shirtId, 'https://your-logo-url.png');
```

## API Reference

### Hooks

| Function | Parameters | Description |
|----------|------------|-------------|
| `useShirt(shirtId)` | `string` | Subscribe to shirt data |
| `useSignatures(shirtId)` | `string` | Subscribe to signatures collection |
| `createShirt(name, year, school)` | `string, number, string` | Create new shirt document |
| `addSignature(shirtId, data)` | `string, object` | Add signature to shirt |
| `updateSignaturePosition(shirtId, sigId, x, y)` | `string, string, number, number` | Update signature coordinates |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

MIT License 

## Contact

Denizhan Kalkan — denizhankalkan@outlook.com

Project Link: [https://github.com/denizhankalkan/sign-my-shirt](https://github.com/denizhankalkan/signmyshirt)
