# Tour Recommendation Application

A tour recommendation application built with React and TailwindCSS.

## Technologies Used

- React.js
- TailwindCSS
- React Router for navigation

## Features

- User Authentication
  - Login
  - Logout
- Tour Management
  - View tour recommendations
  - Add new tour recommendations
  - Filter tours by category, budget, and likes
  - Rate and comment on tours
  - Bookmark favorite tours
- Detailed Tour View
  - View tour details
  - See ratings and reviews
  - Add comments
  - Save to bookmarks

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
react-notes-cc/
├── src/
│   ├── components/   # Reusable components
│   │   ├── BlogCard.jsx
│   │   └── FilterDropdown.jsx
│   ├── pages/       # Page components
│   │   ├── LoginPage.jsx
│   │   ├── TourPage.jsx
│   │   ├── DetailTour.jsx
│   │   └── InputTourPages.jsx
│   └── routes/      # Routing configuration
│       └── RouterApp.jsx
└── README.md
```

## Features Details

### Tour Listing
- Display tour cards with images and basic information
- Filter tours by:
  - Category (Nature, Culture, Culinary)
  - Budget range
  - Number of likes

### Tour Details
- View detailed information about each tour
- See ratings and location
- Read and add comments
- Save tours to bookmarks

### Tour Input
- Add new tour recommendations
- Upload tour images
- Set tour details including:
  - Name
  - Location
  - Description
  - Budget
  - Rating (1-5 scale)

## Notes

- Responsive design implemented using TailwindCSS
- Modern UI with card-based layout
- Interactive elements with hover effects
- Form validation for tour inputs