import React from "react";
import Image from "next/image";

interface StudentBannerProps {
  className?: string;
}

export function StudentBanner({ className = "" }: StudentBannerProps) {
  return (
    <div className={`w-full mb-6 ${className}`}>
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100/90 bg-[#0d0d0d] shadow-xs flex items-center justify-center">
        <Image
          src="/banner.jpeg"
          alt="Adeniji Samuel Oluwasegun - EKSU SU Welfare Director (07)"
          width={949}
          height={330}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1100px"
          className="w-full h-auto object-contain max-h-[160px] sm:max-h-[210px] md:max-h-[260px] block transition-transform duration-300 hover:scale-[1.005]"
        />
      </div>
    </div>
  );
}
