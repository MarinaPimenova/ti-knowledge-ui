import type { FallbackProps } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
    // Safely extract message regardless of what was thrown
    const errorMessage = error instanceof Error ? error.message : String(error);

    return (
        <div className="error-fallback">
            <div className="section1">Fallback to TI</div>

            <p>Fallback: Something went wrong: {errorMessage}</p>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}

export default Fallback;