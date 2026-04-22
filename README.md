# Managed FX Terminal | Professional Analytics Portal

## 🚀 Overview
The **Managed FX Terminal** is a high-performance, professional-grade analytics portal designed for International Forex Brokerage operations. Re-engineered for the **Apple 2026 Edition**, this project utilizes a secure 3-tier architecture to provide a premium, intuitive user experience while maintaining rigorous security standards for financial data.

---

## 🔑 Quick Access (Reviewer Credentials)
Use these accounts to test the Role-Based Access Control (RBAC):

| Account | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `a.saeidinejad@fx.dashboard` | `Password123` |
| **Guest** | `guest@fx.dashboard` | `Guest123` |

---

## 🛡 Permissions Matrix
Detailed access control per role:

| Role | Permissions | Access Level |
| :--- | :--- | :--- |
| **Guest** | View-only access to charts, tables, and leads. | Restricted (Read-only) |
| **Agent** | Manage leads (Add/Edit/Delete) + View all data. | Standard (Read/Write Leads) |
| **Admin** | All Agent powers + User Management (Role assignment). | Full System Control |

---

## 🏛 Architecture & Security
The system is built on a **Service-Oriented 3-Tier Architecture**:
*   **Backend:** Node.js (v24+) with Express.js.
*   **Database:** PostgreSQL with **Prisma ORM** for type-safe operations.
*   **Security:** 
    *   **Bcrypt.js** for industrial-strength password hashing.
    *   **JWT (JSON Web Tokens)** for secure, stateless session management.
    *   **Helmet.js** for HTTP header shielding.

---

## ⚙️ Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file:
```env
PORT=3000
DATABASE_URL="postgresql://dashboard_user@localhost:5432/dashboard_db"
JWT_SECRET="your_secure_random_secret"
```

### 3. Database & Seeding
```bash
npx prisma migrate dev --name init
npm run seed
```

### 4. Running
```bash
npm start
```

---

**Developed by Alireza | Copyright 2026 Opo**
