import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  title?: string;
  onReset?: () => void;
  scope?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error(`[TeamSync ErrorBoundary:${this.props.scope || 'Global'}]`, error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleGoHome = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function' && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      if (this.props.fallback && typeof this.props.fallback !== 'function') {
        return this.props.fallback;
      }

      const isDynamicImportError =
        this.state.error?.message?.toLowerCase().includes('dynamically imported') ||
        this.state.error?.message?.toLowerCase().includes('failed to fetch');

      return (
        <div className="w-full min-h-[320px] rounded-2xl bg-[#090D1A] border border-blue-900/30 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-950/50">
            {isDynamicImportError ? <RefreshCw className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-bold text-white tracking-tight font-display mb-2">
            {this.props.title || (isDynamicImportError ? 'New Version Available' : 'Something went wrong')}
          </h3>
          <p className="text-sm text-neutral-400 max-w-md font-sans mb-6">
            {isDynamicImportError
              ? 'A fresh update of TeamSync was just published. Please reload the page to synchronize latest assets.'
              : 'An unexpected issue occurred while rendering this workspace element. Your saved data is safe.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold text-xs flex items-center gap-2 hover:bg-blue-600/30 transition-all active:scale-95"
            >
              Try Again
            </button>
            <button
              onClick={this.handleGoHome}
              className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 border border-white/10 font-semibold text-xs flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              Return Home
            </button>
          </div>

          {/* Safe Technical Accordion for debugging */}
          {this.state.error && (
            <div className="mt-6 w-full max-w-lg text-left">
              <button
                type="button"
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                className="text-[11px] font-mono text-neutral-500 hover:text-neutral-400 flex items-center gap-1.5 mx-auto transition-colors"
              >
                <ShieldAlert className="w-3 h-3" />
                {this.state.showDetails ? 'Hide Diagnostic Info' : 'Show Diagnostic Info'}
              </button>
              {this.state.showDetails && (
                <div className="mt-3 p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-red-300 overflow-x-auto max-h-36">
                  <p className="font-semibold text-red-400">{this.state.error.name}: {this.state.error.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
