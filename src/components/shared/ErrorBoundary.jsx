import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0D12] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#131720] border border-[#C7B59F]/40 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-lg font-bold font-mono text-[#E8DFD1]">
              MANGENESIS System Recovery
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              An operational view error occurred. The application state has been preserved.
            </p>
            <div className="p-3 rounded-lg bg-[#0B0D12] border border-[#262F3D] text-[11px] font-mono text-rose-300 text-left overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/command-center';
              }}
              className="w-full py-2.5 rounded-xl bg-[#C7B59F] hover:bg-[#E8DFD1] text-[#0B0D12] text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw size={14} />
              <span>Reload Command Center</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
