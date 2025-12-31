"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught error:", error);
    console.error("Error info:", errorInfo);
    console.error("Error stack:", error.stack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
          <h1>Something went wrong</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            <summary>Error details</summary>
            <p><strong>Error:</strong> {this.state.error?.message}</p>
            <p><strong>Stack:</strong></p>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
