import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureException } from '../lib/errorMonitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureException(error, { componentStack: errorInfo.componentStack || undefined });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-amber-50/50 border border-amber-200 my-8">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold mb-3">
            !
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">Something unexpected occurred</h3>
          <p className="text-xs text-stone-600 max-w-md mb-4">
            Our team has been automatically alerted via our telemetry monitor. Please refresh or try again.
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl bg-[#175741] text-white text-xs font-bold hover:bg-[#124533] transition-colors"
          >
            Reload PetJanu
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
