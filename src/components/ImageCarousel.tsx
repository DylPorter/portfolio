import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setWidth(containerRef.current.clientWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const goTo = useCallback((i: number) => {
    const wrapped = ((i % images.length) + images.length) % images.length;
    setIndex(wrapped);
    animate(x, -wrapped * width, { type: "tween", duration: 0.35, ease: "easeOut" });
  }, [images.length, width, x]);

  if (images.length === 0) return null;
  return (
    <div className="relative mb-6">
      <div ref={containerRef} className="overflow-hidden rounded-xl max-h-72">
        <motion.div
          className="flex"
          drag={images.length > 1 ? "x" : false}
          style={{ x }}
          dragConstraints={{ left: -(images.length - 1) * width, right: 0 }}
          dragElastic={0.15}
          dragTransition={{ power: 0.2, timeConstant: 150, bounceStiffness: 400, bounceDamping: 40 }}
          onDragEnd={(_, info) => {
            const threshold = width * 0.2;
            if (info.offset.x < -threshold) goTo(index + 1);
            else if (info.offset.x > threshold) goTo(index - 1);
            else goTo(index);
          }}
        >
          {images.map((img, i) => (
            <div key={i} className="flex-shrink-0" style={{ width: width || "100%" }}>
              <img className="w-full h-full object-cover object-[50%_0%]" alt={`${alt} screenshot ${i + 1}`} src={img} draggable={false} />
            </div>
          ))}
        </motion.div>
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(index - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <LuChevronLeft size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(index + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <LuChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
