# WhatsApp Bot Project

A full-stack application that provides WhatsApp automation and management capabilities through a modern web interface.

## Project Overview

This project consists of two main components:
1. Backend (Node.js/Express)
2. Frontend (React/Vite)

The application allows users to:
- Connect and manage WhatsApp sessions
- Send automated messages
- Monitor message status
- Manage contacts and groups
- View message history and analytics

## Project Structure

```
WhatsApp-bot-project/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Main application file
│   ├── package.json
│   └── server.js
│
└── frontend/               # Frontend application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── styles/         # CSS styles
    │   ├── App.jsx         # Main application component
    │   └── main.jsx        # Entry point
    ├── public/             # Static assets
    ├── package.json
    └── vite.config.js
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- WhatsApp Business API access
- MongoDB (for data storage)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   WHATSAPP_API_KEY=your_whatsapp_api_key
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

### WhatsApp Integration
- Session management
- Message sending and receiving
- Media file handling
- Group management
- Contact management

### User Interface
- Real-time message updates
- Contact and group management interface
- Message history and analytics dashboard
- Session status monitoring
- User authentication and authorization

### Security
- JWT-based authentication
- Secure API endpoints
- Environment variable configuration
- Input validation and sanitization

## API Documentation

The backend provides the following main API endpoints:

- `/api/auth/*` - Authentication routes
- `/api/messages/*` - Message management
- `/api/contacts/*` - Contact management
- `/api/groups/*` - Group management
- `/api/sessions/*` - WhatsApp session management

Detailed API documentation is available in the backend documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the project maintainers.