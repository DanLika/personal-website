import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleGalleryProps {
    images: string[];
    title?: string;
}

const SimpleGallery: React.FC<SimpleGalleryProps> = ({ images, title }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Handle opening with CSS transition
    useEffect(() => {
        if (selectedImageIndex !== null) {
            // Small delay to ensure DOM is ready before triggering CSS transition
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        }
    }, [selectedImageIndex]);

    // Handle closing with CSS transition
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setIsVisible(false);
        // Wait for CSS transition to complete before unmounting
        setTimeout(() => {
            setSelectedImageIndex(null);
            setIsClosing(false);
        }, 200);
    }, []);

    const handleNext = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
        }
    }, [selectedImageIndex, images.length]);

    const handlePrev = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
        }
    }, [selectedImageIndex, images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
            if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, images.length, handleClose]);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (selectedImageIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedImageIndex]);

    const isOpen = selectedImageIndex !== null || isClosing;

    return (
        <>
            {/* Simple CSS Grid Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((src, index) => (
                    <motion.div
                        key={`${title}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg group"
                        onClick={() => setSelectedImageIndex(index)}
                    >
                        <img
                            src={src}
                            alt={`${title || 'Gallery'} - ${index + 1}`}
                            title={`${title || 'Gallery'} - Image ${index + 1}`}
                            width={400}
                            height={300}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </motion.div>
                ))}
            </div>

            {/* Lightbox - CSS-only transitions for zoom compatibility */}
            {createPortal(
                isOpen ? (
                    <div
                        className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ease-out ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                            // GPU layer isolation without transform conflicts
                            contain: 'layout style paint',
                            willChange: 'opacity',
                        }}
                        onClick={handleClose}
                    >
                        {/* Backdrop - separate layer for blur */}
                        <div
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                            style={{
                                transform: 'translate3d(0, 0, 0)', // Force GPU layer
                            }}
                        />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 z-20"
                            style={{ transform: 'translate3d(0, 0, 0)' }}
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 z-20"
                            style={{ transform: 'translate3d(0, 0, 0)' }}
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 z-20"
                            style={{ transform: 'translate3d(0, 0, 0)' }}
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Image Container */}
                        <div
                            className={`relative w-full h-full flex flex-col items-center justify-center p-4 md:p-10 z-10 transition-all duration-200 ease-out ${
                                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{
                                transform: 'translate3d(0, 0, 0)', // Force own GPU layer
                                willChange: 'opacity',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedImageIndex !== null && (
                                <img
                                    src={images[selectedImageIndex]}
                                    alt={`${title || 'Gallery'} - ${selectedImageIndex + 1}`}
                                    title={`${title || 'Gallery'} - Image ${selectedImageIndex + 1}`}
                                    width={1200}
                                    height={900}
                                    loading="eager"
                                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                    style={{ transform: 'translate3d(0, 0, 0)' }}
                                />
                            )}
                            <p
                                className="absolute bottom-4 left-0 right-0 text-center text-white/90 text-sm md:text-base bg-black/50 backdrop-blur-md py-2 px-4 mx-auto max-w-fit rounded-full"
                                style={{ transform: 'translate3d(0, 0, 0)' }}
                            >
                                {title} - {(selectedImageIndex ?? 0) + 1} / {images.length}
                            </p>
                        </div>
                    </div>
                ) : null,
                document.body
            )}
        </>
    );
};

export default SimpleGallery;
