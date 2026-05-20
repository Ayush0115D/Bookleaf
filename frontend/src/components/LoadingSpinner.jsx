export default function LoadingSpinner({ fullScreen = true }) {
  return (
    <div className={`${fullScreen ? 'flex items-center justify-center min-h-screen' : 'flex items-center justify-center py-20'} bg-surface`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
