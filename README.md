# Managed FX Terminal | Professional Analytics Portal

## 🚀 Overview
The **Managed FX Terminal** is a high-performance, professional-grade analytics portal designed for International Forex Brokerage operations. Re-engineered for the **Apple 2026 Edition**, this project utilizes a secure 3-tier architecture to provide a premium, intuitive user experience while maintaining rigorous security standards for financial data.

---

## 🛠 Advanced Tech Stack
*   **Frontend:** HTML5, CSS3 (Liquid Glass UI), Modern JavaScript (ES6+), Chart.js.
*   **Backend:** Node.js (v24+), Express.js (Service-Oriented).
*   **Database:** PostgreSQL with **Prisma ORM** for type-safe data management.
*   **Security:** 
    *   **JWT (JSON Web Tokens)** for secure session management.
    *   **Bcrypt.js** for industrial-strength password hashing.
    *   **Helmet.js** for securing HTTP headers & CSP.
    *   **Express Rate Limit** to mitigate brute-force and DDoS attacks.

---

## 🏛 Professional Architecture
The project follows a modular, service-based directory structure for maximum scalability and maintainability:

```text
├── public/                 # Static Assets (UI, Styles, Logic)
├── src/
│   ├── config/             # Database & Environment Configurations
│   ├── controllers/        # Business Logic (Auth, Leads, Finances)
│   ├── middleware/         # Security & RBAC Authorization
│   ├── routes/             # API Endpoint Definitions
│   └── app.js              # Express Application Setup
├── prisma/                 # Database Schema & Migrations
└── server.js               # Clean Application Entry Point
```

---

## 🔐 Security & Access Control
Implemented a robust **3-Tier Role-Based Access Control (RBAC)** system:

| Role | Permissions | UI Access |
| :--- | :--- | :--- |
| **Admin** | Full system control, User management, Read/Write leads | Full Sidebar + Admin Tab |
| **Agent** | Read all data, Create new leads | Full Sidebar |
| **Guest** | View-only access to charts and tables | Restricted Sidebar (Read-only) |

### Security Features:
*   **Password Protection:** All credentials are salt-hashed using Bcrypt before storage.
*   **Session Security:** stateless authentication via signed JWTs.
*   **API Shielding:** Rate limiting enforced on all endpoints (100 req / 15 min).
*   **CSP Compliance:** Strict Content Security Policy headers enforced via Helmet.

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v24 or higher)
- PostgreSQL instance running locally

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/dashboard_db"
JWT_SECRET="your_secure_random_secret"
```

### 4. Database Initialization
```bash
npx prisma migrate dev --name init
npm run seed
```

### 5. Running the Application
```bash
npm start
```
Access the terminal at `http://localhost:3000`.

---

## 🎓 Assignment Info
Developed as a technical submission for the **Opofinance AI Training Program**.

**Lead Developer: Alireza | Copyright 2026 Opo**
