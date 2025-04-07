# PSTUDY - Learning Management System
## Project Overview
A full-stack learning management system with:
- Node.js/Express backend API
- React/Vite frontend web application
- Chrome extension for quick access

## System Architecture
GundamPJ/
├── backend/       # Node.js API server
├── frontend/      # React web application
└── extension/     # Chrome extension


## 🖥️ Backend (Node.js/Express)

### Features
- JWT authentication
- Course/exam management
- Attendance tracking
- Statistics reporting
- PostgreSQL database (Prisma ORM)
- Redis caching

### Installation
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment
npx prisma migrate dev
npm start
```

## API Endpoints

- **POST** `/api/auth/login` - User login  
- **GET** `/api/courses` - List all courses  
- **POST** `/api/exams` - Create new exam  
- **GET** `/api/statistics/:userId` - Get user stats  

## 🌐 Frontend (React/Vite)

### Features
- Admin dashboard  
- Course management UI  
- Exam creation interface  
- Responsive design  
- Role-based access control  

### Installation

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Technologies
- React 19
- Vite
- Redux
- React Router
- SCSS

## 🔌 Chrome Extension
### Features
- Quick login/logout
- Student statistics dashboard
- Teacher attendance marking
- Course selection
### Installation
1. Open chrome://extensions
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the extension folder
### File Structure
extension/
├── js/
│   └── popup.js     # Main logic
├── manifest.json    # Extension config
└── popup.html      # UI
## 🛠️ Development Setup
### Requirements
- Node.js v18+
- PostgreSQL
- Redis
- Chrome (for extension)
### Environment Variables
Create .env files in both backend and frontend based on .env.example

## 🚀 Deployment
### Backend Production
```bash
cd backend
npm start
```
### Frontend Production
```bash
cd frontend
npm run dev
```
