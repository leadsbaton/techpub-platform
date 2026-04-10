export function HomeVerticalBadge({
  label,
  color,
  className = '',
}: {
  label: string
  color: string
  className?: string
}) {
  return (
    <div className={`absolute right-3 top-0 z-10 h-[132px] w-[28px] md:right-4 md:h-[138px] md:w-[30px] ${className}`}>
      <div
        className="vertical-badge flex h-[108px] w-full items-center justify-center px-0.5 py-3 text-center text-[0.55rem] font-extrabold uppercase tracking-[0.18em] text-white shadow-sm md:h-[112px] md:text-[0.58rem]"
        style={{ backgroundColor: color }}
      >
        {label}
      </div>
      <div
        className="mx-auto h-0 w-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent md:border-l-[15px] md:border-r-[15px] md:border-t-[26px]"
        style={{ borderTopColor: color }}
      />
    </div>
  )
}
