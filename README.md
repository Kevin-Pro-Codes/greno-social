# Greno Social 🌿

A modern full-stack social platform and authentication system built with **React 19**, **Vite**, **Tailwind CSS**, and **Node.js / Express**.

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** 100% Tailwind CSS (v4) + React Icons *(No Bootstrap)*
- **Routing:** React Router DOM (v7)

### Backend
- **Runtime:** Node.js
- **Server Framework:** Express
- **Database:** SQLite3 / Better-SQLite3
- **Security & Auth:** bcrypt password hashing, CORS, Express sessions

---

## Project Structure

```text
greno-social/
├── backend/               # Express API and database logic
│   ├── root.js            # Server entrypoint
│   ├── routes/            # API endpoints & controllers
│   ├── resetdb.js         # Database migration/seed helper
│   └── package.json       # Backend dependencies & scripts
├── frontend/              # Client-side React application (Tailwind CSS)
│   ├── src/               # React components, pages, styles
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies & scripts
├── greno.bat              # Quick-start script for Windows
├── tailwind.config.js     # Tailwind CSS setup
└── README.md              # Project documentation
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [Git](https://git-scm.com/)

### 1. Installation

Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Running Locally

#### Option A: Quick Launch (Windows)
Double-click `greno.bat` or run:
```cmd
greno.bat
```

#### Option B: Manual Launch

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend application:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and visit:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000` (or configured port)

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory if required:

```env
PORT=5000
SESSION_SECRET=your_secret_key_here
```

---

## Available Scripts

| Location | Command | Description |
|---|---|---|
| `backend/` | `npm start` | Launches the backend server with `root.js` |
| `backend/` | `npm run resetdb` | Seeds or resets the database |
| `frontend/` | `npm run dev` | Starts Vite local development server |
| `frontend/` | `npm run build` | Compiles the production build |
| `frontend/` | `npm run preview` | Previews the production build locally |

---

## Author

- **Kevin** - [Kevin-Pro-Codes](https://github.com/Kevin-Pro-Codes)
