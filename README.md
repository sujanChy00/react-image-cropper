# React Image Cropper

A modern, responsive image cropping application built with React and TypeScript. This project provides a user-friendly interface for cropping and manipulating images with a clean, accessible design.

## Features

- Interactive image cropping with real-time preview
- Support for multiple aspect ratios
- Round and square cropping shapes
- Responsive design that works on all devices
- Dark/light theme support
- Drag and drop file upload
- Support for JPG, PNG, and GIF formats
- Modern, accessible UI components

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form
- **Toast Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```sh
git clone <repository-url>
```

2. Navigate to project directory:

```sh
cd mindful-cropper
```

3. Install dependencies:

```sh
npm install
```

4. Start development server:

```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ImageCropper/   # Image cropping components
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Route components
└── main.tsx          # Application entry point
```

## Environment Setup

The project uses TypeScript for type safety and Vite for fast development and optimized builds. Key configurations can be found in:

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.js` - ESLint configuration

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
