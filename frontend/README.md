# Academic Task Manager Frontend

A modern React frontend for the WhatsApp-based academic task management system. This web application allows students to view, manage, and organize their academic tasks in a user-friendly interface.

## Features

- 📅 View tasks by date with an interactive date navigator
- ✅ Mark tasks as complete with checkboxes
- 🔄 Create, edit, and delete tasks
- 🎨 Color-coded task priorities (High, Medium, Low)
- 📱 Responsive design for desktop and mobile devices
- 🔗 Integration with the WhatsApp bot backend

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository (if not already done)
2. Navigate to the frontend directory:
   ```
   cd WhatsApp-bot-project/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Running the Development Server

To start the development server:

```
npm run dev
```

or

```
yarn dev
```

The application will be available at http://localhost:3000

### Building for Production

To create a production build:

```
npm run build
```

or

```
yarn build
```

## Project Structure

```
frontend/
├── public/
│   └── whatsapp-icon.svg
├── src/
│   ├── components/
│   │   ├── DateNavigator.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Modal.jsx
│   │   ├── TaskForm.jsx
│   │   └── TaskList.jsx
│   ├── pages/
│   │   ├── NotFoundPage.jsx
│   │   └── TaskPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Integration with WhatsApp Bot

This frontend is designed to work with the WhatsApp bot backend. The bot sends a link to this web application when a user sends "show tasks" in the WhatsApp chat. The link includes the date parameter, which automatically shows tasks for that specific date.

## Customization

- The application uses CSS variables for easy theme customization (see `src/styles/index.css`)
- WhatsApp-inspired design with the signature green colors
- Easily adaptable for different academic contexts 