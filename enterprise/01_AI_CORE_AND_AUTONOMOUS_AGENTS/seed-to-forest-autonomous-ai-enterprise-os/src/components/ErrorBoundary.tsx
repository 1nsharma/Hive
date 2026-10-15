import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { resetPersistentState } from '../utils/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    resetPersistentState();
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-mono flex items-center justify-center p-4">
          <div className="bg-[#ECEBE8] border-2 border-[#141414] max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3 text-[#8b3a0f]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 className="text-base font-bold font-serif text-[#141414]">
                Seed to Forest: Runtime Exception Recovered
              </h2>
            </div>

            <p className="text-xs text-[#575653] font-sans leading-relaxed">
              An unexpected render or runtime error was intercepted by the system safety boundary. You can restore safe defaults or reload the workspace below.
            </p>

            {this.state.error && (
              <div className="bg-white p-3 border border-[#141414] text-[11px] overflow-x-auto text-red-700 font-mono">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="bg-white hover:bg-[#F4F3F0] text-[#141414] px-4 py-2 border border-[#141414] text-xs font-bold transition"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="bg-[#141414] hover:bg-black text-[#E4E3E0] px-4 py-2 border border-[#141414] text-xs font-bold transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Local State & Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}



