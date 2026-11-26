"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  images: string[];
  className?: string;
  onCtaClick?: () => void;
  ctaClassName?: string;
}

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  images,
  className,
  onCtaClick,
  ctaClassName,
}) => {
  return (
    <section
      className={cn(
        "w-full bg-[#FAF8F4] px-4 py-12 text-center",
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <div className="mb-4 inline-flex items-center rounded-md border border-[#DFDBD0] bg-white px-3 py-1 text-[12px] font-medium text-[#475467]">
          {tagline}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#141A23]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] text-[#475467] leading-relaxed">
          {description}
        </p>
        <div className="mt-6">
          <Button variant="primary" size="lg" onClick={onCtaClick} className={ctaClassName}>
            {ctaText}
          </Button>
        </div>

        <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {images.slice(0, 4).map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`SHG enterprise showcase ${index + 1}`}
              width={360}
              height={240}
              loading="lazy"
              className="h-40 w-full rounded-lg border border-[#DFDBD0] object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
