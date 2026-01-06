// WebGIS Page - v2.0.0 - QGIS2Web Style Interface
import React from 'react';
import { MapViewer } from '@/components/Map/MapViewer';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("MapViewer Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong showing the map.</h2>
                    <div className="bg-red-50 p-4 rounded border border-red-200 text-left inline-block max-w-2xl overflow-auto">
                        <p className="font-mono text-sm text-red-800 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const WebGIS = () => {
    return (
        <ErrorBoundary>
            <MapViewer />
        </ErrorBoundary>
    );
};

export default WebGIS;
