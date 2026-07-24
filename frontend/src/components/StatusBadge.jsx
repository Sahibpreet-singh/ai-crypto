const StatusBadge = ({ live = true }) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`relative flex h-2 w-2`}
      >
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            live ? 'bg-positive' : 'bg-negative'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            live ? 'bg-positive' : 'bg-negative'
          }`}
        />
      </span>
      <span className={`text-xs font-mono font-medium tracking-wider uppercase ${
        live ? 'text-positive' : 'text-negative'
      }`}>
        {live ? 'Live' : 'Offline'}
      </span>
    </div>
  )
}

export default StatusBadge
