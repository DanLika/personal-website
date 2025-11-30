import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleGalleryProps {
    images: string[];
    title?: string;
}

const SimpleGallery: React.FC<SimpleGalleryProps> = ({ images, title }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
        }
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'Escape') setSelectedImageIndex(null);
            if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
            if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, images.length]);

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
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </motion.div>
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

                        {/* Image */}
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
                                src={images[selectedImageIndex]}
                                alt={`${title || 'Gallery'} - ${selectedImageIndex + 1}`}
                                className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                            <p className="absolute bottom-4 left-0 right-0 text-center text-white/90 text-sm md:text-base bg-black/50 backdrop-blur-md py-2 px-4 mx-auto max-w-fit rounded-full">
                                {title} - {selectedImageIndex + 1} / {images.length}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SimpleGallery;
