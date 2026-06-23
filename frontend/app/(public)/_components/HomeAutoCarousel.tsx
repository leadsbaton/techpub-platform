'use client'

import { Children, type ReactNode, useEffect, useRef, useState } from 'react'

export function HomeAutoCarousel({
  children,
  className = '',
  trackClassName = '',
  speed = 0.035,
}: {
  children: ReactNode
  className?: string
  trackClassName?: string
  speed?: number
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    active: false,
    dragged: false,
    startX: 0,
    startScrollLeft: 0,
  })
  const [isPaused, setIsPaused] = useState(false)
  const items = Children.toArray(children)
  const carouselItems = items.length > 1 ? [...items, ...items] : items

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || items.length <= 1) return undefined

    let frameId = 0
    let previousTime = performance.now()

    const tick = (time: number) => {
      const elapsed = time - previousTime
      previousTime = time

      if (!isPaused && !dragState.current.active) {
        scroller.scrollLeft += elapsed * speed

        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft -= scroller.scrollWidth / 2
        }
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isPaused, items.length, speed])

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
        className="no-scrollbar cursor-grab overflow-x-auto py-2 active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          dragState.current.active = false
          setIsPaused(false)
        }}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        onClickCapture={(event) => {
          if (dragState.current.dragged) {
            event.preventDefault()
            event.stopPropagation()
            dragState.current.dragged = false
          }
        }}
        onPointerDown={(event) => {
          const scroller = scrollerRef.current
          if (!scroller) return
          dragState.current = {
            active: true,
            dragged: false,
            startX: event.clientX,
            startScrollLeft: scroller.scrollLeft,
          }
          setIsPaused(true)
          scroller.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const scroller = scrollerRef.current
          const state = dragState.current
          if (!scroller || !state.active) return

          const delta = event.clientX - state.startX
          if (Math.abs(delta) > 4) {
            state.dragged = true
          }
          scroller.scrollLeft = state.startScrollLeft - delta
        }}
        onPointerUp={(event) => {
          const scroller = scrollerRef.current
          dragState.current.active = false
          scroller?.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => {
          dragState.current.active = false
        }}
      >
        <div className={`flex w-max gap-5 ${trackClassName}`}>
          {carouselItems.map((item, index) => (
            <div key={index} className="shrink-0 select-none">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
