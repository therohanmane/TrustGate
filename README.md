# TrustGate - Controlled Digital Asset Release System

TrustGate is a secure digital vault that monitors your activity and releases your critical digital assets to trusted contacts only when you become inactive.

## 🚀 Features

- **Secure Asset Storage**: AES-256 encryption for files.
- **Inactivity Monitoring**: Customizable dead man's switch.
- **Trusted Contacts**: Assign beneficiaries with granular access levels.
- **Activity Logs**: detailed audit trail of all actions.
- **Modern UI**: Dark/Neon specialized design for cybersecurity aesthetic.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or cloud URI)

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustgate
JWT_SECRET=your_secret_key
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup

Open a new terminal:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 🎨 Design System

- **Colors**: Dark Background (`#0a0a0a`), Neon Blue (`#00f3ff`), Neon Purple (`#bc13fe`).
- **Components**: Glassmorphism cards, Gradient buttons, Animated transitions.

## 📂 Project Structure

- `client/`: React Frontend
  - `src/components/ui`: Reusable UI components (Button, Card, Input)
  - `src/pages`: Application pages (Landing, Login, Dashboard)
- `server/`: Node.js Backend
  - `models/`: Mongoose Schemas (User, Asset, Contact)
  - `routes/`: API Endpoints

---
© 2026 TrustGate Project
