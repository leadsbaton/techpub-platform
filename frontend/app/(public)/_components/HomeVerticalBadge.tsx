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
    <div className={`absolute right-4 top-0 z-10 w-[32px] md:right-5 md:w-[36px] ${className}`}>
      <div
        className="vertical-badge-stack flex w-full items-center justify-center px-1 pb-2 pt-3 text-center text-[0.72rem] font-extrabold uppercase leading-[1.18] tracking-normal text-white shadow-sm md:text-[0.82rem]"
        style={{ backgroundColor: color }}
      >
        {label}
      </div>
      <div
        className="mx-auto h-0 w-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent md:border-l-[18px] md:border-r-[18px] md:border-t-[18px]"
        style={{ borderTopColor: color }}
      />
    </div>
  )
}
