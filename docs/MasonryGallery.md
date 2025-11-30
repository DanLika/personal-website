# Masonry Gallery Component - Usage Guide

## Features
- ✅ Responsive masonry layout (1/2/3 columns)
- ✅ Smooth entrance animations with Framer Motion
- ✅ Lightbox with keyboard navigation (←/→/Esc)
- ✅ Lazy loading for performance
- ✅ Hover effects with neon glow
- ✅ Optional captions

## Basic Usage

```tsx
import { MasonryGallery } from "@/components/ui/MasonryGallery";

const images = [
  { 
    src: "/rabbooking-dashboard.jpg", 
    alt: "Dashboard View",
    caption: "Main dashboard with booking overview"
  },
  { 
    src: "/rabbooking-mobile.jpg", 
    alt: "Mobile App" 
  },
  { 
    src: "/rabbooking-calendar.jpg", 
    alt: "Calendar Feature",
    caption: "Interactive calendar for scheduling"
  }
];

<MasonryGallery 
  images={images}
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap={4}
  enableLightbox={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `Array<{src, alt, caption?}>` | Required | Array of image objects |
| `columns` | `{mobile?, tablet?, desktop?}` | `{1, 2, 3}` | Number of columns per breakpoint |
| `gap` | `number` | `4` | Gap between images (Tailwind spacing) |
| `enableLightbox` | `boolean` | `true` | Enable/disable lightbox feature |
| `className` | `string` | `""` | Additional CSS classes |

## Example: Case Study Page

```tsx
export const RabBookingCaseStudy = () => {
  const projectImages = [
    { src: "/rabbooking/hero.jpg", alt: "Hero", caption: "Landing page" },
    { src: "/rabbooking/dashboard.jpg", alt: "Dashboard" },
    { src: "/rabbooking/mobile-1.jpg", alt: "Mobile View 1" },
    { src: "/rabbooking/mobile-2.jpg", alt: "Mobile View 2" },
    { src: "/rabbooking/calendar.jpg", alt: "Calendar", caption: "Booking calendar" },
    { src: "/rabbooking/settings.jpg", alt: "Settings" }
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Project Gallery
      </h2>
      <MasonryGallery 
        images={projectImages}
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      />
    </section>
  );
};
```

## Keyboard Shortcuts (Lightbox)
- `Escape` - Close lightbox
- `←` Left Arrow - Previous image
- `→` Right Arrow - Next image

## Customization

### Different Column Layouts
```tsx
// 2 columns on all devices
<MasonryGallery 
  images={images}
  columns={{ mobile: 2, tablet: 2, desktop: 2 }}
/>

// 1 mobile, 3 tablet, 4 desktop
<MasonryGallery 
  images={images}
  columns={{ mobile: 1, tablet: 3, desktop: 4 }}
/>
```

### Disable Lightbox
```tsx
<MasonryGallery 
  images={images}
  enableLightbox={false}
/>
```

### Custom Gap
```tsx
// Larger gap
<MasonryGallery 
  images={images}
  gap={8}
/>

// Smaller gap
<MasonryGallery 
  images={images}
  gap={2}
/>
```
