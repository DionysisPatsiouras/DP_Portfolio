"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Project = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
  preview: "evelyn" | "transport" | "apoechos" | "myhome" | "tsakmaki";
};

type Props = {
  projects: Project[];
  label: string;
  openLabel: string;
  selectLabel: string;
  previousLabel: string;
  nextLabel: string;
};

export default function ProjectsCarousel({
  projects,
  label,
  openLabel,
  selectLabel,
  previousLabel,
  nextLabel,
}: Props) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swiped = useRef(false);
  const activeProject = projects[active];

  function relativePosition(index: number) {
    const distance = (index - active + projects.length) % projects.length;
    return distance > Math.floor((projects.length - 1) / 2)
      ? distance - projects.length
      : distance;
  }

  function move(direction: number) {
    setActive((current) => (current + direction + projects.length) % projects.length);
  }

  return (
    <div
      className="projects-carousel"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      <div
        className="projects-stage"
        onTouchStart={(event) => {
          swiped.current = false;
          touchStartX.current = event.touches[0]?.clientX ?? null;
          touchStartY.current = event.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || touchStartY.current === null) return;
          const touch = event.changedTouches[0];
          const distanceX = touch.clientX - touchStartX.current;
          const distanceY = touch.clientY - touchStartY.current;
          if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY)) {
            swiped.current = true;
            move(distanceX < 0 ? 1 : -1);
          }
          touchStartX.current = null;
          touchStartY.current = null;
        }}
        onTouchCancel={() => {
          touchStartX.current = null;
          touchStartY.current = null;
        }}
        onClickCapture={(event) => {
          if (swiped.current) {
            event.preventDefault();
            event.stopPropagation();
            swiped.current = false;
          }
        }}
      >
        {projects.map((project, index) => {
          const position = relativePosition(index);
          const isActive = position === 0;
          const isVisible = Math.abs(position) <= 2;
          const preview = (
            <span className={`project-preview project-preview-${project.preview}`}>
              <Image
                src={project.image}
                alt={isActive ? project.imageAlt : ""}
                fill
                sizes="(max-width: 700px) 82vw, 520px"
                loading={index === 0 ? "eager" : "lazy"}
                className="project-preview-image"
              />
              {project.preview === "transport" && (
                <span className="project-preview-title" aria-hidden="true">
                  TRANSPORTATION SERVICES
                </span>
              )}
            </span>
          );

          return (
            <a
              key={project.id}
              className="project-slide"
              data-position={position}
              data-visible={isVisible}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${isActive ? openLabel : selectLabel}: ${project.title}`}
              aria-hidden={!isVisible}
              tabIndex={Math.abs(position) <= 1 ? 0 : -1}
              onClick={(event) => {
                if (!isActive) {
                  event.preventDefault();
                  setActive(index);
                }
              }}
            >
              {preview}
            </a>
          );
        })}
      </div>

      <p className="project-caption" aria-live="polite">
        {activeProject.title}
      </p>
      <div className="projects-controls">
        <button className="projects-arrow" type="button" aria-label={previousLabel} onClick={() => move(-1)}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m12.5 4-6 6 6 6" />
          </svg>
        </button>
        <div className="projects-dots" aria-label={label}>
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className="projects-dot"
              aria-label={`${selectLabel}: ${project.title}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
        <button className="projects-arrow" type="button" aria-label={nextLabel} onClick={() => move(1)}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m7.5 4 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
