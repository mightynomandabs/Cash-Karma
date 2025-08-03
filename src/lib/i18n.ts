import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Configure i18next with appropriate logging levels
i18next
  .use(initReactI18next)
  .init({
    // Debug settings - only log in development and when explicitly enabled
    debug: import.meta.env.DEV && import.meta.env.VITE_I18N_DEBUG === 'true',
    
    // Logging levels
    logLevel: import.meta.env.DEV ? 'warn' : 'error', // Only warnings and errors in dev, only errors in prod
    
    // Fallback language
    fallbackLng: 'en',
    
    // Default namespace
    defaultNS: 'common',
    
    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Resource loading
    resources: {
      en: {
        common: {
          // Add your translations here
        }
      }
    },
    
    // Performance optimizations
    react: {
      useSuspense: false, // Disable suspense for better performance
    },
    
    // Custom logger to control console output
    logger: {
      type: 'logger',
      logger: {
        type: 'console',
        options: {
          // Customize what gets logged
          debug: import.meta.env.DEV && import.meta.env.VITE_I18N_DEBUG === 'true',
          warn: true,
          error: true,
          info: false, // Disable info messages
        }
      }
    }
  });

// Custom logger implementation to filter messages
const customLogger = {
  type: 'logger',
  logger: {
    type: 'console',
    options: {
      debug: false, // Disable debug messages
      warn: true,   // Keep warnings
      error: true,  // Keep errors
      info: false,  // Disable info messages
    }
  }
};

// Function to update logging level dynamically
export const setI18nLogLevel = (level: 'debug' | 'info' | 'warn' | 'error') => {
  i18next.options.logLevel = level;
  
  // Update debug mode
  i18next.options.debug = level === 'debug';
  
  console.log(`i18next logging level set to: ${level}`);
};

// Function to enable/disable debug mode
export const setI18nDebugMode = (enabled: boolean) => {
  i18next.options.debug = enabled;
  console.log(`i18next debug mode: ${enabled ? 'enabled' : 'disabled'}`);
};

// Environment-based configuration
if (import.meta.env.PROD) {
  // Production: minimal logging
  setI18nLogLevel('error');
  setI18nDebugMode(false);
} else if (import.meta.env.DEV) {
  // Development: controlled logging
  const debugEnabled = import.meta.env.VITE_I18N_DEBUG === 'true';
  setI18nLogLevel(debugEnabled ? 'debug' : 'warn');
  setI18nDebugMode(debugEnabled);
}

export default i18next; 