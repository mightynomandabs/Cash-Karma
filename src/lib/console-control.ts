// Console logging control utilities
interface ConsoleControlOptions {
  suppressInfo?: boolean;
  suppressDebug?: boolean;
  suppressWarnings?: boolean;
  suppressErrors?: boolean;
  filterMessages?: string[];
  preserveErrors?: boolean;
}

class ConsoleController {
  private originalConsole: Console;
  private options: ConsoleControlOptions;
  private isEnabled: boolean = false;

  constructor(options: ConsoleControlOptions = {}) {
    this.originalConsole = { ...console };
    this.options = {
      suppressInfo: true,
      suppressDebug: true,
      suppressWarnings: false,
      suppressErrors: false,
      filterMessages: ['languageChanged', 'initialized'],
      preserveErrors: true,
      ...options
    };
  }

  // Enable console filtering
  enable(): void {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    
    // Override console methods
    if (this.options.suppressInfo) {
      console.info = this.createFilteredMethod('info');
    }
    
    if (this.options.suppressDebug) {
      console.debug = this.createFilteredMethod('debug');
    }
    
    if (this.options.suppressWarnings) {
      console.warn = this.createFilteredMethod('warn');
    }
    
    if (this.options.suppressErrors) {
      console.error = this.createFilteredMethod('error');
    }
    
    // Override console.log to filter specific messages
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      const message = args.join(' ');
      
      // Check if message should be filtered
      if (this.shouldFilterMessage(message)) {
        return;
      }
      
      // Preserve original logging
      originalLog.apply(console, args);
    };
    
    console.log('Console filtering enabled');
  }

  // Disable console filtering
  disable(): void {
    if (!this.isEnabled) return;
    
    this.isEnabled = false;
    
    // Restore original console methods
    console.info = this.originalConsole.info;
    console.debug = this.originalConsole.debug;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.log = this.originalConsole.log;
    
    console.log('Console filtering disabled');
  }

  // Create a filtered console method
  private createFilteredMethod(level: 'info' | 'debug' | 'warn' | 'error') {
    return (...args: any[]) => {
      const message = args.join(' ');
      
      // Always preserve errors if configured
      if (level === 'error' && this.options.preserveErrors) {
        this.originalConsole.error.apply(console, args);
        return;
      }
      
      // Check if message should be filtered
      if (this.shouldFilterMessage(message)) {
        return;
      }
      
      // Use original method
      this.originalConsole[level].apply(console, args);
    };
  }

  // Check if a message should be filtered
  private shouldFilterMessage(message: string): boolean {
    if (!this.options.filterMessages) return false;
    
    return this.options.filterMessages.some(filter => 
      message.includes(filter)
    );
  }

  // Add custom filter
  addFilter(filter: string): void {
    if (!this.options.filterMessages) {
      this.options.filterMessages = [];
    }
    this.options.filterMessages.push(filter);
  }

  // Remove custom filter
  removeFilter(filter: string): void {
    if (!this.options.filterMessages) return;
    
    this.options.filterMessages = this.options.filterMessages.filter(f => f !== filter);
  }

  // Get current filters
  getFilters(): string[] {
    return this.options.filterMessages || [];
  }

  // Update options
  updateOptions(newOptions: Partial<ConsoleControlOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }
}

// Global console controller instance
export const consoleController = new ConsoleController();

// Environment-based initialization
export const initializeConsoleControl = (): void => {
  if (import.meta.env.DEV) {
    // In development, enable filtering by default
    consoleController.enable();
    
    // Add common i18next message filters
    consoleController.addFilter('languageChanged');
    consoleController.addFilter('initialized');
    consoleController.addFilter('i18next');
    
    console.log('Console control initialized for development');
  }
};

// Utility functions for manual control
export const enableConsoleFiltering = () => consoleController.enable();
export const disableConsoleFiltering = () => consoleController.disable();
export const addConsoleFilter = (filter: string) => consoleController.addFilter(filter);
export const removeConsoleFilter = (filter: string) => consoleController.removeFilter(filter);

// Development helper to temporarily show all logs
export const showAllLogs = (): void => {
  consoleController.disable();
  console.log('All console logs temporarily enabled');
  
  // Re-enable after 5 seconds
  setTimeout(() => {
    consoleController.enable();
    console.log('Console filtering re-enabled');
  }, 5000);
};

// Development helper to show filtered logs
export const showFilteredLogs = (): void => {
  console.log('Current console filters:', consoleController.getFilters());
};

export default consoleController; 