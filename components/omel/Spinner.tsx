interface SpinnerProps {
  containerClassName?: string;
  spinnerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ containerClassName, spinnerClassName, size = 'md' }: SpinnerProps = {}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={containerClassName || 'flex items-center justify-center min-h-screen'}>
      <div
        className={
          spinnerClassName ||
          `animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-gray-900`
        }
      ></div>
    </div>
  );
}
