import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializePerformanceMonitoring } from './lib/performance'
import { initializeConsoleControl } from './lib/console-control'

// Initialize performance monitoring
initializePerformanceMonitoring();

// Initialize console control for development
initializeConsoleControl();

createRoot(document.getElementById("root")!).render(<App />);
