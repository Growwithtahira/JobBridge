---
description: How to run the development environment
---

To enhance your development experience, you can run the backend and frontend servers simultaneously.

### 1. Start the Backend Server
This runs the Express API server with nodemon for hot reloading.

```bash
# In the root project directory
npm run dev
```

### 2. Start the Frontend Server
This runs the Vite development server. Open a **new terminal** window/tab for this.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies if not already done
npm install

# Start the dev server
npm run dev
```

### Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000 (or whatever port is configured in .env or default)
