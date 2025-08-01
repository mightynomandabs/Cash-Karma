import React from 'react';

interface DropsErrorBoundaryProps {
  children: React.ReactNode;
}

interface DropsErrorBoundaryState {
  hasError: boolean;
}

class DropsErrorBoundary extends React.Component<DropsErrorBoundaryProps, DropsErrorBoundaryState> {
  constructor(props: DropsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DropsErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Drops component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Recent Drops</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">Something went wrong loading the drops.</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DropsErrorBoundary; 