# Log Ingestion and Querying System

## Overview
This project is a full-stack log ingestion and querying system built with Node.js (Express) for the backend and React for the frontend. It allows users to ingest log entries, view them in a table, and filter/search logs by level, message, and date range.

## Features
- **Backend**
  - REST API to accept (`POST /logs`) and query (`GET /logs`) log entries
  - Logs are persisted in a single JSON file (`backend/logs.json`)
  - Supports filtering by level, message search, and date range
- **Frontend**
  - Table view of logs with real-time filters
  - Add new logs via a simple form
  - Timestamps displayed as `DD-MM-YYYY HH:MM AM/PM`

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Backend
1. Open a terminal and navigate to the `backend` directory:
   ```sh
   cd backend
   npm install
   npm start
   ```
   The backend server will run at `http://localhost:4000`.

### Frontend
1. Open a new terminal and navigate to the `frontend` directory:
   ```sh
   cd frontend
   npm install
   npm start
   ```
   The React app will run at `http://localhost:3000` (or another port if 3000 is in use).

## Usage
- Use the form at the top of the page to add new log entries.
- Use the filter inputs to search logs by level, message, or date range.
- All data is stored in `backend/logs.json`.

- **Error Handling:** Basic error messages are shown for failed API requests.
