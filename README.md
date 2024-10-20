# Budget Tracker Web App
This is a full-stack budget tracker web application developed using Next.js for the front-end, and Prisma for seamless database management. The app allows users to efficiently track their income and expenses, providing insightful visualizations to help manage their budgets


## Key Technologies:
- __Next.js__: <small>*Fast and scalable front-end framework with server-side rendering.*</small>
- __Prisma__: <small>*Type-safe ORM for easy database management.*</small>
- __Clerk__: <small>*Simplified user authentication and management.*</small>
- __Tailwind CSS__: <small>*Utility-first CSS framework for responsive design.*</small>
- __Shadcn-ui__: <small>*Pre-designed React components for consistent UI.*</small>
- __TanStack Query__: <small>*Efficient data fetching and state management.*</small>
- __Recharts__: <small>*Composable React components for interactive charts.*</small>


## Features:
- User registration and authentication 
- View budgets over different time periods
- Support for multiple currencies
- Categorize income and expenses
- Data visualization through charts


## Getting Started (dev):
1. Create .env.local file
2. Use dev database source in /prisma/schema.prisma file
3. `yarn install`
4. `npx prisma migrate dev`
5. `yarn run dev`
