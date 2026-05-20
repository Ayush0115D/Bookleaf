export default function LoadingSpinner({ fullScreen = true }) {
  return (
    <div className={`${fullScreen ? 'flex items-center justify-center min-h-screen' : 'flex items-center justify-center py-20'} bg-surface-dark transition-colors duration-200`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-navy-600"></div>
          <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-transparent border-t-gold-500 animate-spin"></div>
        </div>
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}
