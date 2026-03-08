# Jeeja Fashion - Smart Showroom AI Solution

This is a comprehensive web application for managing the AI-Powered Smart Showroom for Jeeja Fashion.

## Features

- **Employee Monitoring**: Face ID (Mock), Working hours tracking, Mobile usage detection, Performance analytics.
- **Customer Analytics**: Footfall counting, Zone-wise distribution, Heatmaps (Mock), Wait time analysis.
- **Centralized Dashboard**: Real-time overview of store performance, alerts, and live feeds.
- **Live Camera Feeds**: Integrated view of surveillance cameras (Mock feeds).
- **Role-Based Access Control**:
  - **Owner/Admin**: Full access.
  - **Store Manager**: Monitoring & Analytics.
  - **Supervisor**: Zone-level monitoring.
  - **Security**: Live feeds & Alerts.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, Chart.js.
- **Backend**: Next.js API Routes.
- **Database**: MongoDB (via Mongoose).
- **Authentication**: JWT-based auth.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or cloud URI)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Environment Variables:
   - The project uses `.env.local` with default settings for local development.
   - Ensure MongoDB is running at `mongodb://localhost:27017/jeeja_fashion`.

3. Seed the Database:
   - On the first run, go to the Dashboard.
   - Click the **"Reset / Seed Data"** button in the top right corner to populate the database with mock users, employees, and analytics data.

4. Run the Development Server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials (Mock Data)

After seeding, use the following credentials:

- **Owner**: `admin@jeeja.com` / `password123`
- **Store Manager**: `manager@jeeja.com` / `password123`
- **Security**: `security@jeeja.com` / `password123`

## Project Structure

- `/app`: App router pages and API endpoints.
- `/components`: Reusable UI components (Sidebar, Header, Charts).
- `/lib`: Database connection helper.
- `/models`: Mongoose schemas (User, Employee, Attendance, Analytics).
