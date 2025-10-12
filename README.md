# Sendo Frontend

Modern React application built with Vite and integrated with Base44 API.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/                 # Base44 API integration
│   ├── base44Client.js  # Configured Base44 client
│   ├── entities.js      # Entity definitions
│   └── integrations.js  # Third-party integrations
├── components/          # Reusable React components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── agent/          # Agent-related components
│   ├── marketplace/    # Marketplace components
│   └── ...
├── pages/              # Page/route components
│   ├── Home.jsx        # Home page
│   ├── Dashboard.jsx   # Dashboard
│   ├── Agent.jsx       # Agent page
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   └── utils.js        # Utilities (cn for classes)
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global Tailwind styles
```

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v7
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **API**: Base44 SDK
- **Animations**: Framer Motion

## 📝 Available Scripts

```bash
# Development
npm run dev        # Start development server

# Build
npm run build      # Production build
npm run preview    # Preview production build

# Code Quality
npm run lint       # Run ESLint
```

## 🔧 Configuration

### Path Aliases
- `@/` → `src/` - Used for absolute imports

### Environment Variables
Create a `.env` file at the root if needed:
```env
VITE_API_URL=your_api_url
```

## 🎨 Design System

The project uses **shadcn/ui** with "New York" style and Lucide icons. UI components are located in `src/components/ui/`.

To customize colors and theme, modify CSS variables in `src/index.css`.

## 🔗 Routing

Routes are defined in `src/pages/index.jsx`:
- `/` - Home page
- `/dashboard` - Dashboard
- `/agent` - Agent management
- `/marketplace` - Marketplace
- `/leaderboard` - Leaderboard
- `/waitlist` - Waitlist

## 🤝 Contributing

1. Create a branch for your feature
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

## 📞 Support

For more information and support about Base44, contact: app@base44.com