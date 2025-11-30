import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
    const get = () => {
        const index = queries.findIndex(q => window.matchMedia(q).matches);
        return index !== -1 ? values[index] : defaultValue;
    };

    const [value, setValue] = useState<number>(get);

    useEffect(() => {
        const handler = () => setValue(get);
        queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
        return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
    }, [queries]);

    return value;
};

const useMeasure = <T extends HTMLElement>() => {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
    await Promise.all(
        urls.map(
            src =>
                new Promise<void>(resolve => {
                    const img = new Image();
                    img.src = src;
                    img.onload = img.onerror = () => resolve();
                })
        )
    );
};

export interface MasonryItem {
    id: string;
    img: string;
    url?: string; // Optional now since we use lightbox
    height: number;
    title?: string; // Added for lightbox caption
}

interface GridItem extends MasonryItem {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface MasonryProps {
    items: MasonryItem[];
    ease?: string;
    duration?: number;
    stagger?: number;
    animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
    scaleOnHover?: boolean;
    hoverScale?: number;
    blurToFocus?: boolean;
    colorShiftOnHover?: boolean;
}

const MasonryGallery: React.FC<MasonryProps> = ({
    items,
    ease = 'power3.out',
    duration = 0.6,
    stagger = 0.05,
    animateFrom = 'bottom',
    scaleOnHover = true,
    hoverScale = 0.95,
    blurToFocus = true,
    colorShiftOnHover = false
}) => {
    const columns = useMedia(
        ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
        [5, 4, 3, 2],
        1
    );

    const [containerRef, { width }] = useMeasure<HTMLDivElement>();
    const [imagesReady, setImagesReady] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const getInitialPosition = (item: GridItem) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return { x: item.x, y: item.y };

        let direction = animateFrom;
        if (animateFrom === 'random') {
            const dirs = ['top', 'bottom', 'left', 'right'];
            direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
        }

        switch (direction) {
            case 'top':
                return { x: item.x, y: -200 };
            case 'bottom':
                return { x: item.x, y: window.innerHeight + 200 };
            case 'left':
                return { x: -200, y: item.y };
            case 'right':
                return { x: window.innerWidth + 200, y: item.y };
            case 'center':
                return {
                    x: containerRect.width / 2 - item.w / 2,
                    y: containerRect.height / 2 - item.h / 2
                };
            default:
                return { x: item.x, y: item.y + 100 };
        }
    };

    useEffect(() => {
        preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
    }, [items]);

    const grid = useMemo<GridItem[]>(() => {
        if (!width) return [];
        const colHeights = new Array(columns).fill(0);
        const gap = 16;
        const totalGaps = (columns - 1) * gap;
        const columnWidth = (width - totalGaps) / columns;

        return items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = col * (columnWidth + gap);

            const aspectRatio = child.height;
            const displayHeight = columnWidth * aspectRatio;

            const y = colHeights[col];

            colHeights[col] += displayHeight + gap;
            return { ...child, x, y, w: columnWidth, h: displayHeight };
        });
    }, [columns, items, width]);

    // Re-calculating grid height for container
    const containerHeight = useMemo(() => {
        if (!width) return 0;
        const colHeights = new Array(columns).fill(0);
        const gap = 16;
        const totalGaps = (columns - 1) * gap;
        const columnWidth = (width - totalGaps) / columns;

        items.forEach(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const aspectRatio = child.height;
            const displayHeight = columnWidth * aspectRatio;
            colHeights[col] += displayHeight + gap;
        });
        return Math.max(...colHeights);
    }, [columns, items, width]);


    const hasMounted = useRef(false);

    useLayoutEffect(() => {
        if (!imagesReady) return;

        grid.forEach((item, index) => {
            const selector = `[data-key="${item.id}"]`;
            const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

            if (!hasMounted.current) {
                const start = getInitialPosition(item);
                gsap.fromTo(
                    selector,
                    {
                        opacity: 0,
                        x: start.x,
                        y: start.y,
                        width: item.w,
                        height: item.h,
                        ...(blurToFocus && { filter: 'blur(10px)' })
                    },
                    {
                        opacity: 1,
                        ...animProps,
                        ...(blurToFocus && { filter: 'blur(0px)' }),
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: index * stagger
                    }
                );
            } else {
                gsap.to(selector, {
                    ...animProps,
                    duration,
                    ease,
                    overwrite: 'auto'
                });
            }
        });

        hasMounted.current = true;
    }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

    const handleMouseEnter = (id: string, element: HTMLElement) => {
        if (scaleOnHover) {
            gsap.to(`[data-key="${id}"]`, {
                scale: hoverScale,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay') as HTMLElement;
            if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
        }
    };

    const handleMouseLeave = (id: string, element: HTMLElement) => {
        if (scaleOnHover) {
            gsap.to(`[data-key="${id}"]`, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay') as HTMLElement;
            if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        }
    };

    // Lightbox Navigation
    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;

            if (e.key === 'Escape') setSelectedImageIndex(null);
            if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
            if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, items.length]);


    return (
        <>
            <div ref={containerRef} className="relative w-full" style={{ height: containerHeight }}>
                {grid.map((item, index) => (
                    <div
                        key={item.id}
                        data-key={item.id}
                        className="absolute box-content cursor-pointer"
                        style={{ willChange: 'transform, width, height, opacity' }}
                        onClick={() => setSelectedImageIndex(index)}
                        onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
                        onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
                    >
                        <div
                            className="relative w-full h-full bg-cover bg-center rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] overflow-hidden"
                            style={{ backgroundImage: `url(${item.img})` }}
                        >
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />

                            {colorShiftOnHover && (
                                <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center"
                        onClick={() => setSelectedImageIndex(null)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedImageIndex(null)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[101]"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[101]"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[101]"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Image Container */}
                        <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={items[selectedImageIndex].img}
                                alt={items[selectedImageIndex].title || "Gallery Image"}
                                className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                            {items[selectedImageIndex].title && (
                                <p className="absolute bottom-4 left-0 right-0 text-center text-white/90 text-sm md:text-base bg-black/50 backdrop-blur-md py-2 px-4 mx-auto max-w-fit rounded-full">
                                    {items[selectedImageIndex].title}
                                </p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MasonryGallery;
