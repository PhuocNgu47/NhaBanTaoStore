# Apple E-Commerce Project Instructions

## Project Overview
Vietnamese Apple products e-commerce website with admin panel and role-based authorization.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM v6
- Axios
- React Hook Form + Zod
- Swiper
- React Toastify
- JWT Authentication

## Project Structure
```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── layouts/         # Layout components
├── features/        # Redux slices
├── hooks/           # Custom hooks
├── services/        # API services
├── utils/           # Utility functions
├── routes/          # Route configurations
├── assets/          # Static assets
└── constants/       # Constants and configs
```

## Roles
- **admin**: Full access to admin dashboard
- **user**: Customer access only

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
