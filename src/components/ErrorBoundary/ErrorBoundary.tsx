'use client';

import React, { Component, ReactNode } from 'react';
import { Stack, Typography, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';

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

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
      // Sentry.captureException(error, { extra: errorInfo });
    } else {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Stack
          direction="column"
          align="center"
          justify="center"
          spacing="lg"
          className="min-h-screen bg-spotify-dark text-white px-8"
        >
          <Stack direction="column" align="center" spacing="md" className="max-w-2xl text-center">
            <Typography variant="heading" size="2xl" weight="bold" color="primary">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body" size="lg" color="secondary">
              We encountered an unexpected error. Don't worry, your data is safe.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Stack
                direction="column"
                spacing="sm"
                className="mt-4 p-4 bg-spotify-grey rounded-lg text-left w-full"
              >
                <Typography variant="body" size="sm" color="muted" className="font-mono">
                  {this.state.error.toString()}
                </Typography>
                {this.state.error.stack && (
                  <Typography
                    variant="caption"
                    size="sm"
                    color="muted"
                    className="font-mono whitespace-pre-wrap"
                  >
                    {this.state.error.stack}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>
          <Stack direction="row" spacing="md">
            <Button
              text="Try Again"
              variant={ButtonVariant.Primary}
              size={ButtonSize.Large}
              onClick={this.handleReset}
            />
            <Button
              text="Go Home"
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Large}
              onClick={this.handleGoHome}
            />
          </Stack>
        </Stack>
      );
    }

    return this.props.children;
  }
}


