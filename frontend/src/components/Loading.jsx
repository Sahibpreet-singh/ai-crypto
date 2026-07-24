const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-surface-600" />
        <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
      <p className="text-gray-400 text-sm tracking-widest uppercase font-mono">
        Connecting to market...
      </p>
    </div>
  )
}

export default Loading
