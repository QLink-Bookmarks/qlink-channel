import * as React from "react";

import { reportError } from "@/lib/error-reporting";

type ErrorBoundaryBaseProps = {
  area: string;
  children: React.ReactNode;
  resetKeys?: unknown[];
  fallback: (params: { error: Error; reset: () => void }) => React.ReactNode;
};

type ErrorBoundaryBaseState = {
  error: Error | null;
};

class ErrorBoundaryBase extends React.Component<ErrorBoundaryBaseProps, ErrorBoundaryBaseState> {
  state: ErrorBoundaryBaseState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    reportError(error, {
      area: this.props.area,
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryBaseProps) {
    if (!this.state.error) {
      return;
    }

    const prevResetKeys = prevProps.resetKeys ?? [];
    const nextResetKeys = this.props.resetKeys ?? [];

    if (
      prevResetKeys.length !== nextResetKeys.length ||
      prevResetKeys.some((value, index) => value !== nextResetKeys[index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      });
    }

    return this.props.children;
  }
}

export { ErrorBoundaryBase };
