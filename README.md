# TrustGate — Controlled Digital Asset Release System

> **Built by [PaviqLabs](https://paviqlabs.com)** — India's premier digital security studio.

TrustGate is a secure digital vault that monitors your activity and releases your critical digital assets to trusted contacts only when you become inactive.

## 🚀 Features

- **Secure Asset Storage** — AES-256 encryption for all files via Firebase Cloud Storage
- **Inactivity Monitoring** — Customizable dead man's switch with Node-Cron scheduling
- **Trusted Contacts** — Assign beneficiaries with granular access permissions
- **RBAC** — Role-Based Access Control for admin & user separation
- **Activity Logs** — Detailed audit trail of all actions
- **Fully Responsive UI** — Mobile-first design, works on all devices (320px → 4K)
- **Docker Ready** — Containerized with Docker Compose for easy deployment
- **CI/CD** — GitHub Actions pipeline for automated builds

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, CSS3, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB (Atlas Cloud) |
| **Storage** | Firebase Cloud Storage (local disk fallback) |
| **Auth** | JWT, bcrypt, RBAC |
| **Scheduling** | Node-Cron |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

## 📦 Quick Start

### Prerequisites
- Node.js v20+
- MongoDB (local or Atlas URI)

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
# Fill in your values
```

### 3. Run in development
```bash
npm run dev
```
- Frontend → http://localhost:5173
- Backend  → http://localhost:5000

### 4. Run with Docker
```bash
docker-compose up --build
```

## 📂 Project Structure

```
TrustGate/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # Sidebar, Navbar, UI components
│   │   ├── pages/            # Landing, Login, Signup, Dashboard
│   │   └── utils/            # API client
│   ├── Dockerfile
│   └── nginx.conf
├── server/                   # Node.js backend
│   ├── config/               # Firebase, env validation
│   ├── middleware/            # Auth, RBAC, rate limiter, validator
│   ├── models/               # User, Asset, Contact, OtpStore
│   ├── routes/               # auth, users, assets, contacts, safety, logs
│   ├── utils/                # encryption, mailer, inactivityJob, firebaseStorage
│   └── Dockerfile
├── .github/workflows/ci.yml  # GitHub Actions CI/CD
└── docker-compose.yml
```

## 🔐 Environment Variables

See [`server/.env.example`](server/.env.example) for all required variables including Firebase setup.

---

<div align="center">
  <strong>© 2026 TrustGate</strong> — Empowering Indian families to secure their digital legacy.<br/>
  Built with ❤️ by <a href="https://paviqlabs.com"><strong>PaviqLabs</strong></a>
</div>
