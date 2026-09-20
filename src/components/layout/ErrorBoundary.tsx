import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('Waypoint ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('waypoint-storage');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-soft-lg text-center">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-semibold mb-2">Something went off track</h1>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Waypoint encountered an unexpected state. Don't worry — your data is safe and you can restore the working demo baseline in one click.
            </p>

            {this.state.error && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-6 text-left overflow-auto max-h-28 text-xs font-mono text-rose-300">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-colors focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <RotateCcw className="w-4 h-4" />
                Reset demo state
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl text-sm transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
