"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function ScrollableContent({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const updateScrollState = () => {
      setCanScrollDown(
        main.scrollHeight - main.clientHeight - main.scrollTop > 2,
      );
    };

    updateScrollState();
    main.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(main);
    if (main.firstElementChild) resizeObserver.observe(main.firstElementChild);

    return () => {
      main.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <main
      ref={mainRef}
      id="main"
      className="page-content"
      data-can-scroll-down={canScrollDown ? "" : undefined}
    >
      {children}
    </main>
  );
}
