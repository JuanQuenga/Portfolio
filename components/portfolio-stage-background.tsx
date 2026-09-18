"use client";

import { useEffect, useRef, type RefObject } from "react";

export function PortfolioStageBackground({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const backdrop = backdropRef.current;
    const image = imageRef.current;
    if (!scrollContainer || !backdrop || !image) return;

    let animationFrame: number | null = null;
    let currentOffset = 0;
    let targetOffset = 0;

    const calculateTargetOffset = () => {
      const scrollRange =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const progress = scrollRange > 0 ? scrollContainer.scrollTop / scrollRange : 0;
      const imageTravel = Math.max(
        0,
        image.offsetHeight - scrollContainer.clientHeight,
      );

      return progress * imageTravel * -0.78;
    };

    const updateParallax = () => {
      targetOffset = calculateTargetOffset();
      currentOffset += (targetOffset - currentOffset) * 0.13;

      if (Math.abs(targetOffset - currentOffset) < 0.1) {
        currentOffset = targetOffset;
      }

      backdrop.style.setProperty("--background-scroll", `${currentOffset}px`);

      if (currentOffset === targetOffset) {
        animationFrame = null;
        return;
      }

      animationFrame = window.requestAnimationFrame(updateParallax);
    };

    const requestParallaxUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateParallax);
    };

    targetOffset = calculateTargetOffset();
    currentOffset = targetOffset;
    backdrop.style.setProperty("--background-scroll", `${currentOffset}px`);
    scrollContainer.addEventListener("scroll", requestParallaxUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestParallaxUpdate);

    return () => {
      scrollContainer.removeEventListener("scroll", requestParallaxUpdate);
      window.removeEventListener("resize", requestParallaxUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [scrollContainerRef]);

  return (
    <>
      <div
        ref={backdropRef}
        className="portfolio-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
        data-liquid-glass-background
        aria-hidden="true"
      >
        <div ref={imageRef} className="portfolio-backdrop__image">
          <img
            src="/images/mackinac-vertical.webp"
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="portfolio-backdrop__overlay" />
        <div className="portfolio-backdrop__atmosphere" />
        <div className="portfolio-backdrop__vignette" />
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[12] h-32 bg-gradient-to-b from-void to-transparent" />
    </>
  );
}
