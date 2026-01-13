# FinTrack - Personal Finance Tracker

A production-ready React frontend for managing personal finances with real-time analytics and secure JWT authentication.

## Features

- 🔐 JWT-based authentication with secure token management
- 📊 Interactive dashboard with charts and insights
- 💰 Account management and balance tracking
- 📋 Transaction categorization and filtering
- 📈 Monthly trends and expense analytics
- 📥 CSV export functionality
- 🎨 Modern dark theme with responsive design
- ⚡ Optimized performance with Vite

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios with interceptors
- **State Management**: Context API
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running on http://localhost:8080

### Installation

1. Extract the project files
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_API_URL=http://localhost:8080
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── context/          # Context API for global state
├── pages/            # Page components
├── services/         # API service layer
├── App.jsx           # Main app component
├── index.css         # Global styles
└── main.jsx          # Entry point
```

## API Integration

The frontend connects to a Spring Boot backend with the following endpoints:

### Public Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Protected Endpoints
- `GET /accounts` - Get all accounts
- `POST /accounts` - Create account
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `GET /transactions` - Get all transactions
- `POST /transactions` - Create transaction
- `GET /transactions/summary/monthly` - Get monthly summary
- `GET /transactions/dashboard` - Get dashboard data
- `GET /transactions/export/csv` - Export transactions as CSV

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically attached to all API requests via interceptor
5. If token is invalid (401/403), user is redirected to login

## Key Features

### Dashboard
- Real-time income and expense summary
- Monthly trend charts
- Category-wise expense breakdown
- Recent transactions table

### Account Management
- Create and manage multiple accounts
- Track account balances
- View account details

### Transaction Management
- Add income and expense transactions
- Categorize transactions
- Filter and search transactions
- Export transactions as CSV

### Categories
- Create custom expense categories
- Organize transactions by category
- View category breakdown

## Development

### Building for Production

```bash
npm run build
```

Output files will be in the `dist` directory.

### Deployment

The built app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Error Handling

The app includes comprehensive error handling:
- API error messages displayed to users
- Global 401/403 handling with auto-logout
- Form validation with error messages
- Loading states for async operations

## Styling

The app uses Tailwind CSS with a custom dark theme. Colors are defined as CSS variables in `index.css` for easy customization:

- Primary: Teal (#14b8a6)
- Secondary: Purple (#8b5cf6)
- Accent: Blue (#3b82f6)
- Success: Green (#10b981)
- Error: Red (#ef4444)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is provided as-is for educational and personal use.
