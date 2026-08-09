type resetErrorBoundaryType = (...args: any[]) => void;

type Props = {
    error: Error;
    resetErrorBoundary: resetErrorBoundaryType;
};

function Fallback({ error, resetErrorBoundary }: Readonly<Props>) {
    return (
        <>
            <div className="section1">Fallback to RWDEx</div>
            <p>Something went wrong: {error.message}</p>
            <button onClick={resetErrorBoundary}>Try again</button>
        </>
    );
}

export default Fallback;