interface ProgressBarProps {
  progress: number;
}
export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-[#11114e] h-2 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
