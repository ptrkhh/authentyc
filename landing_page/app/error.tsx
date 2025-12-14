'use client'

/**
 * Next.js Error Boundary
 *
 * Catches React errors during render and provides a recovery UI.
 * This prevents the entire page from crashing when a component error occurs.
 */

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorBoundaryProps) {
  console.error('[error-boundary] Component error:', error);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#dc2626'
        }}>
          Something went wrong
        </h1>

        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          An unexpected error occurred while rendering this page. Please try again.
        </p>

        <button
          onClick={reset}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          Try again
        </button>

        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.5rem',
            textAlign: 'left'
          }}>
            <p style={{
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              color: '#7f1d1d',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
