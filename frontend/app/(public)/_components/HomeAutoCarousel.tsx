'use client'

import { Children, type ReactNode, useEffect, useRef, useState } from 'react'

export function HomeAutoCarousel({
  children,
  className = '',
  trackClassName = '',
  speed = 0.035,
  autoScroll = true,
}: {
  children: ReactNode
  className?: string
  trackClassName?: string
  speed?: number
  autoScroll?: boolean
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const items = Children.toArray(children)
  const carouselItems = autoScroll && items.length > 1 ? [...items, ...items] : items

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!autoScroll || !scroller || items.length <= 1) return undefined

    let frameId = 0
    let previousTime = performance.now()

    const tick = (time: number) => {
      const elapsed = time - previousTime
      previousTime = time

      if (!isPaused) {
        scroller.scrollLeft += elapsed * speed
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft -= scroller.scrollWidth / 2
        }
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [autoScroll, isPaused, items.length, speed])

  function scrollByPage(direction: -1 | 1) {
    const scroller = scrollerRef.current
    if (!scroller) return
    setIsPaused(true)
    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.86, 900),
      behavior: 'smooth',
    })
  }

  return (
    <div className={`group relative ${className}`}>
      <button
        type="button"
        aria-label="Scroll previous"
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/62 text-2xl font-medium leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] md:left-4"
        onClick={() => scrollByPage(-1)}
      >
        &lt;
      </button>
      <button
        type="button"
        aria-label="Scroll next"
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/62 text-2xl font-medium leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] md:right-4"
        onClick={() => scrollByPage(1)}
      >
        &gt;
      </button>

      <div
        ref={scrollerRef}
        className="no-scrollbar overflow-x-auto py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div className={`flex w-max gap-5 ${trackClassName}`}>
          {carouselItems.map((item, index) => (
            <div key={index} className="shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
