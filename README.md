# Delivery App

Mobile delivery application with **React Native (frontend)** and **NestJS (backend)**.

## Project Structure

```
delivery-app
├── frontend   # React Native mobile app
└── backend    # NestJS API
```

## Backend Setup

1. Go to the backend folder

```
cd backend
```

2. Create your environment configuration

Linux / macOS:

```
cp .env.example .env
```

Windows:

```
copy .env.example .env
```

3. Edit `.env` and fill the required variables.

Example:

```
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
ADMIN_SECRET_KEY=your-admin-key
UPLOAD_PATH=./uploads
```

4. Install dependencies

```
npm install
```

5. Start the server

```
npm run start:dev
```

The backend will start on:

```
http://localhost:5000
```
