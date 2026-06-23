'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import type { Post } from '@/lib/types/cms'
import { getPostHref } from '@/lib/utils/contentTypes'
import { getPostCardImageClass, getPostCardImageUrl } from '@/lib/utils/formatting'
import { SafeImage } from './SafeImage'

export function HomeHeroCarousel({ posts }: { posts: Post[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    active: false,
    dragged: false,
    startX: 0,
    startScrollLeft: 0,
  })
  const [isPaused, setIsPaused] = useState(false)
  const carouselPosts = posts.length > 1 ? [...posts, ...posts] : posts

  function scrollByPage(direction: -1 | 1) {
    const scroller = scrollerRef.current
    if (!scroller) return
    setIsPaused(true)
    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.86, 900),
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || posts.length <= 1) return undefined

    let frameId = 0
    let previousTime = performance.now()

    const tick = (time: number) => {
      const elapsed = time - previousTime
      previousTime = time

      if (!isPaused && !dragState.current.active) {
        scroller.scrollLeft += elapsed * 0.035

        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft -= scroller.scrollWidth / 2
        }
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isPaused, posts.length])

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        aria-label="Scroll previous"
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/62 text-2xl font-medium leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
        onClick={() => scrollByPage(-1)}
      >
        &lt;
      </button>
      <button
        type="button"
        aria-label="Scroll next"
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/62 text-2xl font-medium leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
        onClick={() => scrollByPage(1)}
      >
        &gt;
      </button>
      <div
        ref={scrollerRef}
        className="home-hero-carousel no-scrollbar min-w-0 cursor-grab overflow-x-auto pb-2 active:cursor-grabbing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        dragState.current.active = false
        setIsPaused(false)
      }}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
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
        <div className="flex w-max gap-3 pl-[max(16px,calc((100vw-972px)/2))] xl:gap-5">
          {carouselPosts.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={getPostHref(item)}
              draggable={false}
              onClick={(event) => {
                if (dragState.current.dragged) {
                  event.preventDefault()
                  dragState.current.dragged = false
                }
              }}
              className="group block h-[300px] w-[300px] shrink-0 select-none overflow-hidden rounded-[14px] shadow-[0px_4px_4px_0px_#00000040]"
            >
              <div className="relative h-[300px] w-[300px] overflow-hidden rounded-[14px]">
                <SafeImage
                  src={getPostCardImageUrl(item)}
                  alt={item.title}
                  fill
                  priority={index < 3}
                  sizes="(max-width: 1280px) 180px, 260px"
                  className={`${getPostCardImageClass(item)} pointer-events-none transition duration-300 group-hover:scale-[1.03]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="line-clamp-3 text-[0.9rem] font-medium leading-5 text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
