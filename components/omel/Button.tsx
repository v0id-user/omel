interface ButtonProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}
const variantClasses = {
  primary: 'bg-[#010103] text-[#f3f4f6] ring-[#6c7688]',
  secondary: 'bg-[#1f2937] text-white ring-[#4b5563]',
  danger: 'bg-red-600 text-white ring-red-800',
};

export const OButton = ({
  isLoading,
  children,
  variant = 'primary',
  className,
  type = 'button',
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] rounded-lg shadow-[0_1px_rgba(255,255,255,0.07)_inset,0_1px_3px_rgba(0,0,0,0.2)] ring-1 ${variantClasses[variant]} text-sm py-2 px-4 before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-b before:from-white/20 before:opacity-50 hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-lg after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay hover:drop-shadow-2xs
    ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      disabled={isLoading}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
