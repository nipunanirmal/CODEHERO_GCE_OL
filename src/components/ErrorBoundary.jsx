import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-red-100">
                        <div className="bg-red-500 text-white p-8">
                            <h1 className="text-3xl font-black tracking-tight">System Critical Error 💀</h1>
                            <p className="opacity-90 font-bold mt-2">The application encountered a fatal exception.</p>
                        </div>
                        <div className="p-8">
                            <div className="mb-6">
                                <h3 className="text-red-900 font-bold uppercase tracking-wider text-xs mb-2">Error Message</h3>
                                <div className="bg-red-50 text-red-900 p-4 rounded-xl font-mono font-bold text-lg border border-red-100">
                                    {this.state.error && this.state.error.toString()}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Stack Trace</h3>
                                <pre className="bg-slate-900 text-slate-50 p-6 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </div>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="mt-8 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors w-full"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
