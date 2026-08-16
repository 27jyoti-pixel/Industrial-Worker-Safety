# 🛡️ Industrial Worker Safety

A full-stack **Industrial Worker Safety Management System** designed to help factories manage worker safety, accidents, compensation claims, safety complaints, hospitals, and worker information from a centralized platform.

The system provides separate experiences for different users, with a professional dashboard for monitoring safety-related information and dedicated modules for managing workers, accidents, claims, complaints, hospitals, and profile information.

---

## ✨ Key Features

- **Role-Based Access** — Different users receive access to the sections relevant to their role.
- **Safety Dashboard** — Centralized overview of worker-safety information and recent safety activity.
- **Worker Management** — View and manage worker information including employee details, factory information, contact details, and blood group.
- **Accident Reports** — Record, track, investigate, and monitor industrial accident reports.
- **Compensation Claims** — Manage worker compensation requests and track their approval progress.
- **Safety Complaints** — File, review, and track workplace safety hazards and complaints.
- **Hospital Management** — Find and view nearby hospitals and emergency medical services.
- **Profile Management** — View account, workplace, employee, and role information.
- **Authentication** — Login, registration, logout, and protected application access.
- **Responsive UI** — Designed to work across desktop and smaller-screen layouts.
- **Professional Safety-Focused UI** — Consistent visual system with accessible status indicators, cards, tables, forms, and navigation.
- **Status Tracking** — Clear visual states for items such as Approved, Resolved, Completed, Open, Medium, High, Critical, and other workflow states.

---

## 🏗️ Application Modules

### 📊 Dashboard

The dashboard provides a centralized view of important safety information.

Depending on the user's role, it can display relevant statistics and recent records such as:

- Worker information
- Recent accidents
- Compensation claims
- Safety complaints
- System activity

---

### 👷 Workers

The Workers module provides a structured view of registered workers.

Information can include:

- Worker name
- Employee ID
- Factory
- Phone number
- Blood group
- Email/contact information
- Worker-related actions

---

### ⚠️ Accident Reports

The Accident Reports module is used to manage industrial accidents.

It supports tracking information such as:

- Accident details
- Worker involved
- Factory
- Accident date
- Severity
- Status
- Investigation/resolution information

Typical status/severity indicators include:

- Minor
- Moderate
- High
- Critical
- Resolved
- Under Investigation

---

### 📄 Compensation Claims

The Compensation Claims module manages worker compensation requests.

It provides information such as:

- Claim number
- Worker
- Claim description
- Claim amount
- Claim status
- Approval progress
- Search/filter functionality

Example workflow states include:

- Submitted
- Under Review
- Approved
- Rejected
- Completed

---

### 🚨 Safety Complaints

The Safety Complaints module allows workplace safety hazards and complaints to be recorded and tracked.

It can be used for issues related to:

- Industrial machinery
- Chemicals
- Environmental hazards
- Workplace safety conditions
- Other safety-related concerns

Complaints can be tracked using severity and status indicators such as:

- Low
- Medium
- High
- Open
- Resolved
- Closed

---

### 🏥 Hospitals

The Hospitals module helps users find nearby hospitals and emergency medical services.

The interface can provide:

- Hospital information
- Location details
- Emergency service information
- Nearby hospital discovery
- Map/location support

---

### 👤 Profile

The Profile section provides account and workplace information.

It includes information such as:

- Full name
- Email address
- Factory unit
- Employee ID
- User role
- Workplace identity
- Account/security settings

---

## 🎨 UI Design

The application uses a professional industrial-safety visual language.

### Color Palette

| Purpose | Color |
|---|---|
| Primary | `#3E5C54` |
| Secondary | `#6B7A6F` |
| Accent | `#C9A66B` |
| Main Background | `#F4F4F4` |
| Card Background | `#FFFFFF` |
| Primary Text | `#1E1E1E` |
| Secondary Text | `#6C757D` |
| Border | `#E0E0E0` |
| Success | `#2A9D8F` |
| Warning | `#E9C46A` |
| Error | `#E63946` |
| Information | `#2196F3` |

The interface uses reusable components for navigation, cards, tables, forms, status badges, search, modals, and other common UI patterns.

---

## 🧩 Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- JavaScript / JSX

### Backend

The backend source code is maintained in the **root project directory** rather than in a separate `backend/` folder.

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT-based authentication

### Development Tools

- Git
- GitHub
- VS Code
- Nodemon
- npm

---

## 📁 Project Structure

The project contains a separate frontend application and the backend source code in the root project directory.

```text
Industrial-Worker-Safety/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
├── src/
│   └── Backend source code
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> `node_modules` directories and `.env` files are intentionally not included in the repository because they should not be committed to GitHub.

---

## 🔐 Authentication & Authorization

The application uses authenticated access to protect safety-management functionality.

The authentication flow includes:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Authentication
  │
  ▼
User Role
  │
  ├── Worker
  │
  └── Admin / Authorized User
  │
  ▼
Role-based Application Access
```

Protected application sections include worker, accident, claim, complaint, hospital, dashboard, and profile functionality according to the user's role.

---

## 🗄️ Database

The backend uses **MongoDB** as the database and can connect to **MongoDB Atlas** for cloud-hosted database storage.

The database stores application information such as:

- Users
- Workers
- Factories
- Accident reports
- Compensation claims
- Safety complaints
- Hospitals
- Related safety-management records

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- MongoDB Atlas account

---

### 1. Clone the Repository

```bash
git clone https://github.com/27jyoti-pixel/Industrial-Worker-Safety.git
cd Industrial-Worker-Safety
```

---

### 2. Install Backend Dependencies

The backend package is located in the root project directory.

From the project root:

```bash
npm install
```

---

### 3. Install Frontend Dependencies

Open another terminal and move into the frontend directory:

```bash
cd frontend
npm install
```

---

## ⚙️ Environment Variables

The backend environment file is located in the **root project directory**.

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Use the actual environment variable names required by the implementation.

> **Never commit `.env` files or database credentials to GitHub.**

---

## ▶️ Running the Application

### Start Backend

From the project root:

```bash
npm run dev
```

The backend will run using the configured development server.

### Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Open the local frontend URL shown by Vite in the terminal.

---

## 🔄 Application Flow

```text
                    ┌──────────────────┐
                    │       User       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Login / Register │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Authentication  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Dashboard     │
                    └────────┬─────────┘
                             │
          ┌──────────────────┼───────────────────┐
          │                  │                   │
          ▼                  ▼                   ▼
      Workers        Accident Reports     Safety Complaints
          │                  │                   │
          └──────────────────┼───────────────────┘
                             │
                    ┌────────┴────────────┐
                    ▼                     ▼
            Compensation Claims       Hospitals
                    │
                    ▼
                  Profile
```

---

## 📌 Safety Status System

The application uses consistent visual status indicators throughout the platform.

| Category | Examples |
|---|---|
| 🟢 Success | Approved, Resolved, Completed, Active |
| 🟡 Warning | Medium, Open, Pending, Under Review |
| 🔴 Critical | High, Critical, Rejected, Severe |
| ⚪ Neutral | Closed, Other/default states |

This makes important safety and workflow states easier to identify quickly.

---

## 🛠️ Development Principles

- **Modular architecture** — Frontend components and backend functionality are organized into reusable modules.
- **Reusable UI components** — Common elements such as cards, tables, search bars, modals, selects, sidebars, and status badges are shared across pages.
- **Role-based access** — Users only see functionality appropriate for their role.
- **Consistent UI** — Shared colors, typography, spacing, status indicators, and interaction patterns are used throughout the application.
- **Responsive design** — The interface is designed for different screen sizes.
- **Secure configuration** — Sensitive credentials are stored in environment variables.
- **Maintainable codebase** — API logic, authentication, UI components, and application pages are kept separated.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Real-time safety alerts
- Emergency notification system
- Worker attendance and safety-compliance tracking
- Advanced safety analytics
- Accident trend visualization
- Automated safety-risk detection
- Mobile application for workers
- Push notifications
- Document/report generation
- Advanced admin analytics
- AI-assisted accident and complaint analysis

---

## 📸 Screenshots

Project screenshots can be added here as the final repository is updated.

Recommended screenshots:

```text
screenshots/
├── dashboard.png
├── workers.png
├── accident-reports.png
├── compensation-claims.png
├── safety-complaints.png
├── hospitals.png
└── profile.png
```

Example:

```markdown
![Dashboard](screenshots/dashboard.png)
```

---

## 👨‍💻 Project

**Industrial Worker Safety Management System**

Built as a full-stack application to provide a centralized digital platform for managing industrial worker safety and related workplace processes.

---

## 📄 License

This project is developed for educational and project purposes.

Add your preferred license here if the project is being distributed publicly.