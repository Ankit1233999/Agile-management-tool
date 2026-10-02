# Agile Management Tool - Backend API

This is the backend for the Agile Management Tool, built using Node.js, Express, and MongoDB.

## Base URL
`/api`

## Endpoints

### 1. Authentication (`/api/auth`)
* `POST /register` - Register a new user
* `POST /login` - Login user and get JWT token

### 2. Projects (`/api/projects`)
* `GET /` - Get all projects for the logged-in user (Protected)
* `POST /` - Create a new project (Protected)

### 3. Tasks (`/api/tasks`)
* `POST /` - Create a new task (Protected)
* `GET /project/:projectId` - Get all tasks for a specific project (Protected)
* `PATCH /:id/status` - Update task status (Protected)

### 4. Sprints (`/api/sprints`)
* `POST /` - Create a new sprint (Protected)
* `GET /project/:projectId` - Get all sprints for a specific project (Protected)