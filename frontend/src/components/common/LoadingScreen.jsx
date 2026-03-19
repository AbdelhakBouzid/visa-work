function LoadingScreen({ fullScreen = false, label = 'جاري التحميل...' }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? 'min-h-screen' : 'min-h-[240px]'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
