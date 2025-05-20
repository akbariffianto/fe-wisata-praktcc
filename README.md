# Notes Application Frontend

A simple notes application frontend built with React and TailwindCSS.

## Technologies Used

- React.js
- TailwindCSS
- Axios for API requests
- React Router for navigation

## Features

- User Authentication
  - Login
  - Register
  - Logout
- Notes Management
  - Create notes
  - View notes
  - Update notes
  - Delete notes

## Project Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Project Structure

```
notes_fe/
├── src/
│   ├── auth/         # Authentication related components
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── NotesPage.jsx
│   └── utils/        # Utility functions and constants
└── README.md
```

## Environment Setup

Create a `.env` file in the root directory with:
```
VITE_API_URL=your_backend_api_url
```

## Notes

- The application uses JWT for authentication
- All API requests are made to the backend using Axios
- Responsive design implemented using TailwindCSS