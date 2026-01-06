"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import VkIcon from "@/components/VkIcon"

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showCounter, setShowCounter] = useState(true)
  const [showLightboxUI, setShowLightboxUI] = useState(true)
  const [lightboxDirection, setLightboxDirection] = useState<"next" | "prev" | null>(null)

  const [partySlide, setPartySlide] = useState(0)
  const [partySlideDirection, setPartySlideDirection] = useState<"next" | "prev" | null>(null)
  const [isPartyLightboxOpen, setIsPartyLightboxOpen] = useState(false)
  const [partyLightboxIndex, setPartyLightboxIndex] = useState(0)
  const [showPartyCounter, setShowPartyCounter] = useState(true)
  const [showPartyLightboxUI, setShowPartyLightboxUI] = useState(true)
  const [partyLightboxDirection, setPartyLightboxDirection] = useState<"next" | "prev" | null>(null)

  const [isMobileViewport, setIsMobileViewport] = useState(false)

  const carouselImages = ["/images/photo-1.jpg", "/images/photo-2.jpg", "/images/photo-3.jpg", "/images/photo-4.jpg"]
  const partyImages = [
    "/images/party-1.jpg",
    "/images/party-2.jpg",
    "/images/party-3.jpg",
    "/images/party-4.jpg",
    "/images/party-5.jpg",
  ]
  const AUTO_ADVANCE_MS = 10000

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const counterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const partyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const partyCounterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phoneLongPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lightboxTouchStartRef = useRef<{ x: number; y: number } | null>(null)
  const partyLightboxTouchStartRef = useRef<{ x: number; y: number } | null>(null)
  const lightboxUITimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const partyLightboxUITimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lightboxImgRef = useRef<HTMLImageElement | null>(null)
  const partyLightboxImgRef = useRef<HTMLImageElement | null>(null)
  const lightboxFrameRef = useRef<HTMLDivElement | null>(null)
  const partyLightboxFrameRef = useRef<HTMLDivElement | null>(null)

  const restartAutoAdvance = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isLightboxOpen) {
      intervalRef.current = setInterval(() => {
        setSlideDirection("next")
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
      }, AUTO_ADVANCE_MS)
    }
  }

  const restartPartyAutoAdvance = () => {
    if (partyIntervalRef.current) clearInterval(partyIntervalRef.current)
    if (!isPartyLightboxOpen) {
      partyIntervalRef.current = setInterval(() => {
        setPartySlideDirection("next")
        setPartySlide((prev) => (prev + 1) % partyImages.length)
      }, AUTO_ADVANCE_MS)
    }
  }

  const handlePhoneCopy = async () => {
    try {
      await navigator.clipboard.writeText("88006001305")
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 2000)
    } catch (err) {
      console.error("Failed to copy phone number:", err)
    }
  }

  const handlePhoneTouchStart = () => {
    phoneLongPressRef.current = setTimeout(() => {
      handlePhoneCopy()
    }, 550)
  }

  const handlePhoneTouchEnd = () => {
    if (phoneLongPressRef.current) {
      clearTimeout(phoneLongPressRef.current)
      phoneLongPressRef.current = null
    }
  }

  const nextSlide = () => {
    setSlideDirection("next")
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    restartAutoAdvance()
  }

  const prevSlide = () => {
    setSlideDirection("prev")
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
    restartAutoAdvance()
  }

  const nextPartySlide = () => {
    setPartySlideDirection("next")
    setPartySlide((prev) => (prev + 1) % partyImages.length)
    restartPartyAutoAdvance()
  }

  const prevPartySlide = () => {
    setPartySlideDirection("prev")
    setPartySlide((prev) => (prev - 1 + partyImages.length) % partyImages.length)
    restartPartyAutoAdvance()
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
    setShowCounter(true)
    setShowLightboxUI(true)
  }

  const openPartyLightbox = (index: number) => {
    setPartyLightboxIndex(index)
    setIsPartyLightboxOpen(true)
    setShowPartyCounter(true)
    setShowPartyLightboxUI(true)
  }

  const nextLightboxImage = () => {
    if (isMobileViewport) {
      setLightboxDirection("next")
    }
    setLightboxIndex((prev) => (prev + 1) % carouselImages.length)
    resetCounterTimer()
    resetLightboxUITimer()
  }

  const prevLightboxImage = () => {
    if (isMobileViewport) {
      setLightboxDirection("prev")
    }
    setLightboxIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
    resetCounterTimer()
    resetLightboxUITimer()
  }

  const nextPartyLightboxImage = () => {
    if (isMobileViewport) {
      setPartyLightboxDirection("next")
    }
    setPartyLightboxIndex((prev) => (prev + 1) % partyImages.length)
    resetPartyCounterTimer()
    resetPartyLightboxUITimer()
  }

  const prevPartyLightboxImage = () => {
    if (isMobileViewport) {
      setPartyLightboxDirection("prev")
    }
    setPartyLightboxIndex((prev) => (prev - 1 + partyImages.length) % partyImages.length)
    resetPartyCounterTimer()
    resetPartyLightboxUITimer()
  }

  const resetCounterTimer = () => {
    setShowCounter(true)
    if (counterTimeoutRef.current) {
      clearTimeout(counterTimeoutRef.current)
    }
    const hideDelay = isMobileViewport ? 3000 : 1000
    counterTimeoutRef.current = setTimeout(() => {
      setShowCounter(false)
    }, hideDelay)
  }

  const resetPartyCounterTimer = () => {
    setShowPartyCounter(true)
    if (partyCounterTimeoutRef.current) {
      clearTimeout(partyCounterTimeoutRef.current)
    }
    const hideDelay = isMobileViewport ? 3000 : 1000
    partyCounterTimeoutRef.current = setTimeout(() => {
      setShowPartyCounter(false)
    }, hideDelay)
  }

  const resetLightboxUITimer = useCallback(() => {
    setShowLightboxUI(true)
    if (lightboxUITimeoutRef.current) {
      clearTimeout(lightboxUITimeoutRef.current)
    }
    const hideDelay = isMobileViewport ? 3000 : 1000
    lightboxUITimeoutRef.current = setTimeout(() => {
      setShowLightboxUI(false)
    }, hideDelay)
  }, [isMobileViewport])

  const resetPartyLightboxUITimer = useCallback(() => {
    setShowPartyLightboxUI(true)
    if (partyLightboxUITimeoutRef.current) {
      clearTimeout(partyLightboxUITimeoutRef.current)
    }
    const hideDelay = isMobileViewport ? 3000 : 1000
    partyLightboxUITimeoutRef.current = setTimeout(() => {
      setShowPartyLightboxUI(false)
    }, hideDelay)
  }, [isMobileViewport])

  const toggleLightboxUI = () => {
    setShowLightboxUI((prev) => !prev)
    if (!showLightboxUI) {
      resetLightboxUITimer()
    }
  }

  const togglePartyLightboxUI = () => {
    setShowPartyLightboxUI((prev) => !prev)
    if (!showPartyLightboxUI) {
      resetPartyLightboxUITimer()
    }
  }

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (!lightboxTouchStartRef.current) return
    const deltaX = e.changedTouches[0].clientX - lightboxTouchStartRef.current.x
    const deltaY = e.changedTouches[0].clientY - lightboxTouchStartRef.current.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Only trigger swipe if horizontal movement is significant and greater than vertical
    if (absDeltaX > 50 && absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        prevLightboxImage()
      } else {
        nextLightboxImage()
      }
    } else if (absDeltaX < 10 && absDeltaY < 10) {
      // Tap detected - toggle UI
      toggleLightboxUI()
    }
    lightboxTouchStartRef.current = null
  }

  const handlePartyLightboxTouchStart = (e: React.TouchEvent) => {
    partyLightboxTouchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const handlePartyLightboxTouchEnd = (e: React.TouchEvent) => {
    if (!partyLightboxTouchStartRef.current) return
    const deltaX = e.changedTouches[0].clientX - partyLightboxTouchStartRef.current.x
    const deltaY = e.changedTouches[0].clientY - partyLightboxTouchStartRef.current.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (absDeltaX > 50 && absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        prevPartyLightboxImage()
      } else {
        nextPartyLightboxImage()
      }
    } else if (absDeltaX < 10 && absDeltaY < 10) {
      togglePartyLightboxUI()
    }
    partyLightboxTouchStartRef.current = null
  }

  const closeLightbox = () => {
    setCurrentSlide(lightboxIndex)
    setIsLightboxOpen(false)
  }

  const closePartyLightbox = () => {
    setPartySlide(partyLightboxIndex)
    setIsPartyLightboxOpen(false)
  }

  const getVisibleImageRect = (
    frameRef: React.RefObject<HTMLDivElement>,
    imgRef: React.RefObject<HTMLImageElement>,
  ): { left: number; top: number; right: number; bottom: number } | null => {
    if (!frameRef.current || !imgRef.current) return null

    const frameRect = frameRef.current.getBoundingClientRect()
    const nw = imgRef.current.naturalWidth
    const nh = imgRef.current.naturalHeight

    // If image hasn't loaded yet, don't compute
    if (!nw || !nh) return null

    // Compute scale for object-fit: contain
    const scale = Math.min(frameRect.width / nw, frameRect.height / nh)

    // Visible dimensions
    const vw = nw * scale
    const vh = nh * scale

    // Centered position
    const left = frameRect.left + (frameRect.width - vw) / 2
    const top = frameRect.top + (frameRect.height - vh) / 2

    return {
      left,
      top,
      right: left + vw,
      bottom: top + vh,
    }
  }

  const handleLightboxBackdropClick = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-lightbox-control="1"]')) return

    if (!isMobileViewport) {
      // Desktop: keep existing behavior - close immediately
      closeLightbox()
      return
    }

    const visibleRect = getVisibleImageRect(lightboxFrameRef, lightboxImgRef)
    if (!visibleRect) {
      // If we can't compute, don't close
      return
    }

    const x = e.clientX
    const y = e.clientY

    // Close if tap is outside the visible image bounds
    if (x < visibleRect.left || x > visibleRect.right || y < visibleRect.top || y > visibleRect.bottom) {
      closeLightbox()
    }
  }

  const handlePartyLightboxBackdropClick = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-lightbox-control="1"]')) return

    if (!isMobileViewport) {
      closePartyLightbox()
      return
    }

    const visibleRect = getVisibleImageRect(partyLightboxFrameRef, partyLightboxImgRef)
    if (!visibleRect) {
      return
    }

    const x = e.clientX
    const y = e.clientY

    if (x < visibleRect.left || x > visibleRect.right || y < visibleRect.top || y > visibleRect.bottom) {
      closePartyLightbox()
    }
  }

  useEffect(() => {
    if (isLightboxOpen) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      resetCounterTimer()
      resetLightboxUITimer()

      return () => {
        if (counterTimeoutRef.current) {
          clearTimeout(counterTimeoutRef.current)
        }
        if (lightboxUITimeoutRef.current) {
          clearTimeout(lightboxUITimeoutRef.current)
        }
      }
    } else {
      restartAutoAdvance()
    }
  }, [isLightboxOpen, resetLightboxUITimer])

  useEffect(() => {
    if (isPartyLightboxOpen) {
      if (partyIntervalRef.current) clearInterval(partyIntervalRef.current)
      resetPartyLightboxUITimer()
    } else {
      restartPartyAutoAdvance()
    }
    return () => {
      if (partyLightboxUITimeoutRef.current) {
        clearTimeout(partyLightboxUITimeoutRef.current)
      }
    }
  }, [isPartyLightboxOpen, resetPartyLightboxUITimer])

  useEffect(() => {
    restartAutoAdvance()
    restartPartyAutoAdvance()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (partyIntervalRef.current) clearInterval(partyIntervalRef.current)
    }
  }, [carouselImages.length, partyImages.length])

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 767px)")
    const onChange = () => setIsMobileViewport(mq.matches)
    onChange()
    mq.addEventListener?.("change", onChange)
    return () => mq.removeEventListener?.("change", onChange)
  }, [])

  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 250)
      return () => clearTimeout(timer)
    }
  }, [currentSlide, slideDirection])

  useEffect(() => {
    if (partySlideDirection) {
      const timer = setTimeout(() => setPartySlideDirection(null), 250)
      return () => clearTimeout(timer)
    }
  }, [partySlide, partySlideDirection])

  useEffect(() => {
    if (lightboxDirection) {
      const timer = setTimeout(() => setLightboxDirection(null), 250)
      return () => clearTimeout(timer)
    }
  }, [lightboxIndex, lightboxDirection])

  useEffect(() => {
    if (partyLightboxDirection) {
      const timer = setTimeout(() => setPartyLightboxDirection(null), 250)
      return () => clearTimeout(timer)
    }
  }, [partyLightboxIndex, partyLightboxDirection])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isBookingOpen) setIsBookingOpen(false)
        if (isLightboxOpen) closeLightbox()
        if (isPartyLightboxOpen) closePartyLightbox()
      }

      if (isLightboxOpen) {
        if (e.key === "ArrowLeft") {
          prevLightboxImage()
        } else if (e.key === "ArrowRight") {
          nextLightboxImage()
        }
      }
      if (isPartyLightboxOpen) {
        if (e.key === "ArrowLeft") {
          prevPartyLightboxImage()
        } else if (e.key === "ArrowRight") {
          nextPartyLightboxImage()
        }
      }
    }

    if (isBookingOpen || isLightboxOpen || isPartyLightboxOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isBookingOpen, isLightboxOpen, isPartyLightboxOpen, lightboxIndex, partyLightboxIndex])

  useEffect(() => {
    if (!isPartyLightboxOpen) return
    const handleMouseMove = () => {
      resetPartyCounterTimer()
      resetPartyLightboxUITimer()
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("pointermove", handleMouseMove)
    resetPartyCounterTimer()
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("pointermove", handleMouseMove)
      if (partyCounterTimeoutRef.current) clearTimeout(partyCounterTimeoutRef.current)
    }
  }, [isPartyLightboxOpen, resetPartyLightboxUITimer])

  useEffect(() => {
    if (isPartyLightboxOpen) {
      resetPartyCounterTimer()
    }
  }, [partyLightboxIndex, isPartyLightboxOpen])

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white md:hidden">
        <div className="flex items-center justify-between px-3 py-2 h-14">
          {/* Left: Logo only */}
          <img src="/images/logo.png" alt="Black Forest" className="h-10 w-auto object-contain" />

          {/* Right: Icon buttons row - VK, TG, Phone, Записаться */}
          <div className="flex items-center gap-1.5">
            {/* VK Icon */}
            <a
              href="https://vk.com/blackforestperm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ВКонтакте"
              className="h-10 w-10 inline-grid place-items-center rounded-lg bg-white/5 border border-white/15 text-white active:bg-white/20 transition-colors"
            >
              <VkIcon className="h-5 w-5" />
            </a>

            {/* Telegram Icon */}
            <a
              href="https://t.me/BlackForestPerm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="h-10 w-10 inline-grid place-items-center rounded-lg bg-white/5 border border-white/15 text-white active:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className="block h-5 w-5">
                <path
                  fill="currentColor"
                  stroke="none"
                  d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"
                />
              </svg>
            </a>

            {/* Phone Icon - tap to call, long-press to copy */}
            <a
              href="tel:+78006001305"
              aria-label="Позвонить"
              className="h-10 w-10 inline-grid place-items-center rounded-lg bg-white/5 border border-white/15 text-white active:bg-white/20 transition-colors"
              onTouchStart={handlePhoneTouchStart}
              onTouchEnd={handlePhoneTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>

            {/* Записаться button */}
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="h-10 px-3 rounded-lg bg-red-600 active:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              Записаться
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header - unchanged for md+ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white hidden md:block">
        <div className="container mx-auto px-8 flex items-center justify-between py-4">
          <div className="flex items-center gap-4 py-0">
            <img src="/images/logo.png" alt="Black Forest" className="h-16 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-semibold text-center">Black Forest</h1>
              <p className="text-sm text-card">Квест-пространство</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <a
                href="https://yandex.ru/maps/org/kvest_prostranstvo_black_forest/123968158934?si=1emw2m7e7mhbu86eebqyefwgd8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-base text-white no-underline hover:no-underline hover:text-gray-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none rounded px-1 leading-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>ул. Ленина, д. 10</span>
              </a>

              <a
                href="https://vk.com/blackforestperm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ВКонтакте"
                data-icon="vk"
                className="h-12 w-12 inline-grid place-items-center rounded-xl bg-white/5 border border-white/15 text-white hover:scale-110 hover:bg-[#0077FF]/10 hover:border-white/30 hover:text-[#0077FF] hover:shadow-md transition-all duration-200 ease-out cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none p-0"
              >
                <VkIcon className="h-9 w-9" />
              </a>

              <a
                href="https://t.me/BlackForestPerm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="h-12 w-12 inline-grid place-items-center rounded-xl bg-white/5 border border-white/15 text-white hover:scale-110 hover:bg-[#229ED9]/10 hover:border-white/30 hover:text-[#229ED9] hover:shadow-md transition-all duration-200 ease-out cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="block h-8 w-8"
                >
                  <path
                    fill="currentColor"
                    stroke="none"
                    d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"
                  />
                </svg>
              </a>

              <button
                type="button"
                onClick={handlePhoneCopy}
                className="text-lg font-medium hover:text-gray-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none rounded px-1 leading-none"
                title="Нажмите, чтобы скопировать"
              >
                8 (800)-600-13-05
              </button>
            </div>
            <Button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              Записаться
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header - different heights for mobile/desktop */}
      <div className="h-14 md:h-24" />

      {/* Hero Section - First Content Section */}
      <section className="container mx-auto px-4 md:px-8 my-0 py-4 md:py-2">
        <div className="flex flex-col gap-5 md:hidden">
          {/* Title first on mobile */}
          <h2 className="text-2xl font-bold text-black text-balance">Квест "Призрак Оперы"</h2>

          {/* Carousel second on mobile */}
          <div className="relative group">
            {!isLightboxOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => openLightbox(currentSlide)}
                  onTouchStart={(e) => {
                    const touch = e.touches[0]
                    e.currentTarget.dataset.touchStartX = String(touch.clientX)
                    e.currentTarget.dataset.touchStartY = String(touch.clientY)
                  }}
                  onTouchEnd={(e) => {
                    const startX = Number(e.currentTarget.dataset.touchStartX || 0)
                    const startY = Number(e.currentTarget.dataset.touchStartY || 0)
                    const endX = e.changedTouches[0].clientX
                    const endY = e.changedTouches[0].clientY
                    const deltaX = endX - startX
                    const deltaY = endY - startY
                    const absDeltaX = Math.abs(deltaX)
                    const absDeltaY = Math.abs(deltaY)

                    // Only trigger swipe if horizontal movement is significant and dominant
                    if (absDeltaX > 40 && absDeltaX > absDeltaY) {
                      e.preventDefault()
                      if (deltaX > 0) {
                        prevSlide()
                      } else {
                        nextSlide()
                      }
                    }
                  }}
                  className="h-[240px] overflow-hidden rounded-lg bg-gray-100 w-full cursor-pointer relative"
                  aria-label="View image in full size"
                >
                  <div
                    className="flex h-full w-full"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: slideDirection ? "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                      willChange: "transform",
                    }}
                  >
                    {carouselImages.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover object-center flex-shrink-0"
                      />
                    ))}
                  </div>
                </button>

                {/* Mobile Navigation Arrows - always visible */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all active:bg-black/80 h-11 w-11 inline-grid place-items-center"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all active:bg-black/80 h-11 w-11 inline-grid place-items-center"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index)
                        restartAutoAdvance()
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === currentSlide ? "bg-white w-6" : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[240px] w-full bg-white rounded-lg" aria-hidden="true" />
            )}
          </div>

          {/* Text description third on mobile */}
          <div>
            <p className="text-base text-gray-700 leading-relaxed">
              {
                "Скоро состоится премьера новой оперы в Париже, но случилось несчастье и вас, как великих детективов, попросили о помощи. Пропала главная актриса театра – Кристина Даэ, последний раз ее видели в своей гримерной. Задача – спасти солистку из лап призрака оперы, не попасться в его ловушки, и не стать жертвой смертельной удавки."
              }
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              <span className="font-bold text-black">Возрастное ограничение</span> — 14+
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mt-1">В сопровождении взрослых — 10+</p>
          </div>

          {/* Stats fourth on mobile */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 uppercase tracking-wide">Игроков:</span>
                <span className="text-base font-bold text-black">2-6</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 uppercase tracking-wide">Время:</span>
                <span className="text-base font-bold text-black">90 мин</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 uppercase tracking-wide">Сложность:</span>
                <span className="text-base font-bold text-black">3/4</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 uppercase tracking-wide">Страх:</span>
                <span className="text-base font-bold text-black">1/4 (без актёров) </span>
              </div>
            </div>
            <div className="text-center border-t border-gray-200 pt-2">
              <p className="text-gray-600 text-xs leading-relaxed">
                Стоимость для команды 2-4 чел. – от 3000 до 4500₽. Доплата за доп. игрока – 700₽
              </p>
            </div>
          </div>

          {/* CTA Button fifth on mobile */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 text-base font-semibold transition-all active:scale-95 w-full max-w-xs"
            >
              Записаться
            </Button>
          </div>
        </div>

        {/* Desktop layout - unchanged */}
        <div className="hidden md:grid grid-cols-12 gap-8 items-center py-1">
          {/* Left Half - Image Carousel */}
          <div className="relative group col-span-7 transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none will-change-transform">
            {!isLightboxOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => openLightbox(currentSlide)}
                  className="h-[380px] lg:h-[420px] overflow-hidden rounded-lg bg-gray-100 w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none relative"
                  aria-label="View image in full size"
                >
                  <div
                    className="flex h-full w-full"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: slideDirection ? "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                      willChange: "transform",
                    }}
                  >
                    {carouselImages.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover object-center flex-shrink-0"
                      />
                    ))}
                  </div>
                </button>

                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:brightness-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:brightness-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index)
                        restartAutoAdvance()
                      }}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer hover:brightness-125 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none ${
                        index === currentSlide ? "bg-white w-8" : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[380px] lg:h-[420px] w-full bg-white rounded-lg" aria-hidden="true" />
            )}
          </div>

          {/* Right Half - Product Description */}
          <div className="col-span-5 transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none will-change-transform">
            <h2 className="text-3xl font-bold mb-4 text-black">Квест "Призрак Оперы"</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {
                "Скоро состоится премьера новой оперы в Париже, но случилось несчастье и вас, как великих детективов, попросили о помощи. Пропала главная актриса театра – Кристина Даэ, последний раз ее видели в своей гримерной. Задача – спасти солистку из лап призрака оперы, не попасться в его ловушки, и не стать жертвой смертельной удавки.\n"
              }
            </p>
            <p className="text-base text-gray-600 leading-relaxed mt-3">
              <span className="font-bold text-black">Возрастное ограничение</span> — 14+
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mt-1">В сопровождении взрослых — 10+</p>
          </div>
        </div>
      </section>

      {/* Info Strip - desktop only */}
      <section className="container mx-auto px-8 py-2 hidden md:block">
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm">
          <div className="flex flex-nowrap items-center justify-center gap-6 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 uppercase tracking-wide">кол-во Игроков:</span>
              <span className="text-xl font-bold text-black">2-6</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 uppercase tracking-wide">Время:</span>
              <span className="text-xl font-bold text-black">90 мин</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 uppercase tracking-wide">Сложность:</span>
              <span className="text-xl font-bold text-black">3/4</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 uppercase tracking-wide">Страх:</span>
              <span className="text-xl font-bold text-black">1/4 (без актёров)</span>
            </div>
          </div>
          <div className="text-center border-t border-gray-200 pt-2">
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">
              Стоимость игры для команды от 2 до 4 человек – от 3000 до 4500 рублей. Доплата за каждого дополнительного
              игрока – 700 рублей
            </p>
          </div>
        </div>
      </section>

      {/* Center CTA Button - desktop only (mobile has it inside section) */}
      <section className="container mx-auto px-8 py-2 hidden md:block">
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            Записаться
          </Button>
        </div>
      </section>

      {/* Second Content Section - Party */}
      <section className="container mx-auto px-4 md:px-8 py-4 md:py-2">
        <div className="flex flex-col gap-5 md:hidden">
          {/* Title first on mobile */}
          <h2 className="text-2xl font-bold text-black">Праздник в квесте</h2>

          {/* Party Carousel second on mobile */}
          <div className="relative group">
            {!isPartyLightboxOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => openPartyLightbox(partySlide)}
                  onTouchStart={(e) => {
                    const touch = e.touches[0]
                    e.currentTarget.dataset.touchStartX = String(touch.clientX)
                    e.currentTarget.dataset.touchStartY = String(touch.clientY)
                  }}
                  onTouchEnd={(e) => {
                    const startX = Number(e.currentTarget.dataset.touchStartX || 0)
                    const startY = Number(e.currentTarget.dataset.touchStartY || 0)
                    const endX = e.changedTouches[0].clientX
                    const endY = e.changedTouches[0].clientY
                    const deltaX = endX - startX
                    const deltaY = endY - startY
                    const absDeltaX = Math.abs(deltaX)
                    const absDeltaY = Math.abs(deltaY)

                    // Only trigger swipe if horizontal movement is significant and dominant
                    if (absDeltaX > 40 && absDeltaX > absDeltaY) {
                      e.preventDefault()
                      if (deltaX > 0) {
                        prevPartySlide()
                      } else {
                        nextPartySlide()
                      }
                    }
                  }}
                  className="h-[240px] overflow-hidden rounded-lg bg-gray-100 w-full cursor-pointer relative"
                  aria-label="View party image in full size"
                >
                  <div
                    className="flex h-full w-full"
                    style={{
                      transform: `translateX(-${partySlide * 100}%)`,
                      transition: partySlideDirection ? "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                      willChange: "transform",
                    }}
                  >
                    {partyImages.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Party slide ${index + 1}`}
                        className="w-full h-full object-cover object-center flex-shrink-0"
                      />
                    ))}
                  </div>
                </button>

                <button
                  onClick={prevPartySlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all active:bg-black/80 h-11 w-11 inline-grid place-items-center"
                  aria-label="Previous party image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextPartySlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all active:bg-black/80 h-11 w-11 inline-grid place-items-center"
                  aria-label="Next party image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {partyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setPartySlide(index)
                        restartPartyAutoAdvance()
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === partySlide ? "bg-white w-6" : "bg-white/50"
                      }`}
                      aria-label={`Go to party slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[240px] w-full bg-white rounded-lg" aria-hidden="true" />
            )}
          </div>

          {/* Text description third on mobile */}
          <div>
            <p className="text-base text-gray-700 leading-relaxed mb-2">
              Хотите организовать праздник в квесте? Тогда мы вам поможем!
            </p>
            <p className="text-base text-gray-700 leading-relaxed mb-2">
              Для этого у нас есть зона отдыха, в которую входят:
            </p>
            <ul className="text-base text-gray-700 leading-relaxed list-disc list-inside space-y-0 mb-2">
              <li>Чайный столик</li>
              <li>Зона для дискотеки</li>
              <li>Настольные игры</li>
              <li>Музыка</li>
            </ul>
            <p className="text-base text-gray-700 leading-relaxed">
              В зону отдыха можно приходить со своей едой и напитками! Также мы поможем с заказом еды, аниматора или
              различных шоу для вашего мероприятия по приятной цене!
            </p>
          </div>

          {/* CTA Button fourth on mobile */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 text-base font-semibold transition-all active:scale-95 w-full max-w-xs"
            >
              Записаться
            </Button>
          </div>
        </div>

        {/* Desktop layout - unchanged */}
        <div className="hidden md:grid grid-cols-12 gap-8 items-center py-1">
          {/* Left Half - Text Content */}
          <div className="col-span-5 transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none will-change-transform">
            <h2 className="text-3xl font-bold mb-4 text-black">Праздник в квесте</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-0">
              Хотите организовать праздник в квесте? Тогда мы вам поможем!
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-0">
              Для этого у нас есть зона отдыха, в которую входят:
            </p>
            <ul className="text-lg text-gray-700 leading-relaxed list-disc list-inside space-y-0 mb-0">
              <li>Чайный столик (чай, сахар, кулер с горячей и холодной водой, микроволновка)</li>
              <li>Зона для дискотеки</li>
              <li>Настольные игры</li>
              <li>Музыка</li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed">
              В зону отдыха можно приходить со своей едой и напитками! Также мы поможем с заказом еды, аниматора или
              различных шоу для вашего мероприятия по приятной цене!
            </p>
          </div>

          {/* Right Half - Party Carousel */}
          <div className="relative group col-span-7 transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none will-change-transform">
            {!isPartyLightboxOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => openPartyLightbox(partySlide)}
                  className="h-[380px] lg:h-[420px] overflow-hidden rounded-lg bg-gray-100 w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none relative"
                  aria-label="View party image in full size"
                >
                  <div
                    className="flex h-full w-full"
                    style={{
                      transform: `translateX(-${partySlide * 100}%)`,
                      transition: partySlideDirection ? "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                      willChange: "transform",
                    }}
                  >
                    {partyImages.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Party slide ${index + 1}`}
                        className="w-full h-full object-cover object-center flex-shrink-0"
                      />
                    ))}
                  </div>
                </button>

                <button
                  onClick={prevPartySlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:brightness-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                  aria-label="Previous party image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPartySlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:brightness-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                  aria-label="Next party image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {partyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setPartySlide(index)
                        restartPartyAutoAdvance()
                      }}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer hover:brightness-125 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none ${
                        index === partySlide ? "bg-white w-8" : "bg-white/50"
                      }`}
                      aria-label={`Go to party slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[380px] lg:h-[420px] w-full bg-white rounded-lg" aria-hidden="true" />
            )}
          </div>
        </div>
      </section>

      {/* Second CTA - desktop only */}
      <section className="container mx-auto px-8 py-2 hidden md:block">
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            Записаться
          </Button>
        </div>
      </section>

      {/* Map Integration Section */}
      <section className="container mx-auto px-4 md:px-8 py-4 md:py-2 mt-8 md:mt-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="flex flex-col md:hidden">
            {/* Content first on mobile */}
            <div className="p-5 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2 text-black">Как нас найти</h2>
              <p className="mb-3 font-bold leading-6 text-lg text-black">Квест-пространство "Black Forest"</p>
              <div className="mb-4">
                <p className="text-base leading-relaxed">
                  <span className="font-bold text-black">Адрес:</span>{" "}
                  <span className="text-gray-700">г. Пермь, ул. Ленина, д. 10, вход со стороны улицы Пермская.</span>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="https://yandex.ru/maps/org/kvest_prostranstvo_black_forest/123968158934?si=1emw2m7e7mhbu86eebqyefwgd8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3 bg-black active:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 h-12"
                >
                  Открыть в Яндекс.Картах
                </a>
                <a
                  href="https://yandex.ru/maps/?rtext=~58.015400,56.257108&rtt=auto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3 bg-white active:bg-gray-50 text-black font-medium rounded-lg border border-gray-300 transition-colors duration-200 h-12"
                >
                  Построить маршрут
                </a>
              </div>
            </div>
            {/* Map second on mobile */}
            <div className="overflow-hidden h-[280px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab86529bd3f79b4370ece180cffd8bbf06b52f17c0c0a54a2d1d0ef22f6275c5d&amp;source=constructor"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Yandex Maps - Black Forest location"
              />
            </div>
          </div>

          {/* Desktop layout - unchanged */}
          <div className="hidden md:grid grid-cols-2 gap-0">
            <div className="order-1 overflow-hidden h-[420px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab86529bd3f79b4370ece180cffd8bbf06b52f17c0c0a54a2d1d0ef22f6275c5d&amp;source=constructor"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Yandex Maps - Black Forest location"
              />
            </div>
            <div className="order-2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 text-black">Как нас найти</h2>
              <p className="mt-2 mb-4 font-bold leading-7 text-2xl text-black">Квест-пространство "Black Forest"</p>
              <div className="mb-4">
                <p className="text-lg leading-relaxed">
                  <span className="font-bold text-black">Адрес:</span>{" "}
                  <span className="text-gray-700">г. Пермь, ул. Ленина, д. 10, вход со стороны улицы Пермская.</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://yandex.ru/maps/org/kvest_prostranstvo_black_forest/123968158934?si=1emw2m7e7mhbu86eebqyefwgd8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  Открыть в Яндекс.Картах
                </a>
                <a
                  href="https://yandex.ru/maps/?rtext=~58.015400,56.257108&rtt=auto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3 bg-white hover:bg-gray-50 text-black font-medium rounded-lg border border-gray-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  Построить маршрут
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy-to-clipboard toast notification */}
      {showCopyToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-black text-white px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <p className="text-sm font-medium text-center">Номер телефона скопирован</p>
        </div>
      )}

      {isBookingOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsBookingOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg w-full max-w-4xl h-[90vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsBookingOpen(false)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full inline-grid place-items-center p-0 leading-none shadow-lg transition-all hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none z-10"
              aria-label="Close booking modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
            <div className="w-full h-full rounded-lg overflow-hidden">
              <iframe
                src="https://api-mir-kvestov.ru/api/v3/quests/5266?city_id=61"
                className="w-full h-full border-0"
                title="Booking Widget"
                scrolling="yes"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Lightbox with mobile swipe and UI toggle */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-8 pointer-events-auto"
          onPointerDown={handleLightboxBackdropClick}
          onPointerMove={resetCounterTimer}
        >
          <div
            className="relative pointer-events-none flex items-center justify-center w-full h-full"
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white w-12 h-12 rounded-full inline-grid place-items-center p-0 leading-none shadow-lg transition-all hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none pointer-events-auto opacity-100"
              aria-label="Close lightbox"
              data-lightbox-control="1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>

            {/* Image Container */}
            <div
              className="relative max-w-[90vw] md:max-w-[80vw] max-h-[80vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              ref={lightboxFrameRef}
            >
              {isMobileViewport ? (
                <div className="max-w-full max-h-[80vh] overflow-hidden rounded-lg">
                  <div
                    className="flex h-full w-full"
                    style={{
                      transform: `translateX(-${lightboxIndex * 100}%)`,
                      transition: lightboxDirection ? "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                      willChange: "transform",
                    }}
                  >
                    {carouselImages.map((image, index) => (
                      <img
                        key={index}
                        ref={index === lightboxIndex ? lightboxImgRef : null}
                        src={image || "/placeholder.svg"}
                        alt={`Lightbox image ${index + 1}`}
                        className="max-w-full max-h-[80vh] object-contain flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <img
                  src={carouselImages[lightboxIndex] || "/placeholder.svg"}
                  alt={`Lightbox image ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                prevLightboxImage()
              }}
              className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none z-10 pointer-events-auto h-11 w-11 md:h-auto md:w-auto inline-grid place-items-center md:opacity-100 ${
                showLightboxUI ? "opacity-100" : "opacity-0 md:opacity-100"
              }`}
              aria-label="Previous image"
              data-lightbox-control="1"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextLightboxImage()
              }}
              className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none z-10 pointer-events-auto h-11 w-11 md:h-auto md:w-auto inline-grid place-items-center md:opacity-100 ${
                showLightboxUI ? "opacity-100" : "opacity-0 md:opacity-100"
              }`}
              aria-label="Next image"
              data-lightbox-control="1"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div
              className={`absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium transition-opacity duration-300 z-10 pointer-events-none ${
                showCounter && showLightboxUI ? "opacity-100" : showCounter ? "md:opacity-100 opacity-0" : "opacity-0"
              }`}
            >
              {lightboxIndex + 1} / {carouselImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Party Lightbox with mobile swipe and UI toggle */}
      {isPartyLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 pointer-events-auto"
          onPointerDown={handlePartyLightboxBackdropClick}
          onPointerMove={resetPartyCounterTimer}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handlePartyLightboxTouchStart}
            onTouchEnd={handlePartyLightboxTouchEnd}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                closePartyLightbox()
              }}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none z-20 h-12 w-12 inline-grid place-items-center p-0 pointer-events-auto opacity-100"
              aria-label="Close lightbox"
              data-lightbox-control="1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>

            {/* Image Container */}
            <div
              className="relative max-w-[90vw] md:max-w-[80vw] max-h-[80vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              ref={partyLightboxFrameRef}
            >
              {isMobileViewport ? (
                <div className="max-w-full max-h-[80vh] overflow-hidden rounded-lg">
                  <div
                    className="flex h-full w-full"
                    style={{
                      transform: `translateX(-${partyLightboxIndex * 100}%)`,
                      transition: partyLightboxDirection ? "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                      willChange: "transform",
                    }}
                  >
                    {partyImages.map((image, index) => (
                      <img
                        key={index}
                        ref={index === partyLightboxIndex ? partyLightboxImgRef : null}
                        src={image || "/placeholder.svg"}
                        alt={`Party lightbox image ${index + 1}`}
                        className="max-w-full max-h-[80vh] object-contain flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <img
                  src={partyImages[partyLightboxIndex] || "/placeholder.svg"}
                  alt={`Party lightbox image ${partyLightboxIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                prevPartyLightboxImage()
              }}
              className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none z-10 pointer-events-auto h-11 w-11 md:h-auto md:w-auto inline-grid place-items-center md:opacity-100 ${
                showPartyLightboxUI ? "opacity-100" : "opacity-0 md:opacity-100"
              }`}
              aria-label="Previous image"
              data-lightbox-control="1"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextPartyLightboxImage()
              }}
              className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none z-10 pointer-events-auto h-11 w-11 md:h-auto md:w-auto inline-grid place-items-center md:opacity-100 ${
                showPartyLightboxUI ? "opacity-100" : "opacity-0 md:opacity-100"
              }`}
              aria-label="Next image"
              data-lightbox-control="1"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div
              className={`absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium transition-opacity duration-300 z-10 pointer-events-none ${
                showPartyCounter && showPartyLightboxUI
                  ? "opacity-100"
                  : showPartyCounter
                    ? "md:opacity-100 opacity-0"
                    : "opacity-0"
              }`}
            >
              {partyLightboxIndex + 1} / {partyImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white mt-0 py-6">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-sm text-gray-600 mb-2">© 2025 Black Forest. Все права защищены.</p>
          <p className="text-xs text-gray-500">ИП Вагизов Денис Игоревич · ИНН 590201929805 · ОГРНИП 322595800108997</p>
        </div>
      </footer>
    </div>
  )
}
