import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ERROR_BOUNDARY_TEXTS } from '../../constants/texts.js';
import { AlertCircle } from 'lucide-react';

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
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#fafaf7',
          color: '#1f2937'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            maxWidth: '480px',
            width: '100%',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <AlertCircle size={48} color="#e05a47" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#e05a47', marginBottom: '0.75rem' }}>
              {ERROR_BOUNDARY_TEXTS.title}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {ERROR_BOUNDARY_TEXTS.description}
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                backgroundColor: '#e05a47',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(224, 90, 71, 0.3)'
              }}
            >
              {ERROR_BOUNDARY_TEXTS.retryButton}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
