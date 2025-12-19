/**
 * Responsive image handling utilities
 * Untuk memastikan gambar responsive di semua ukuran perangkat
 */

/**
 * Generate srcset untuk responsive images
 * Contoh: generateImageSrcSet('/doctor.jpg') 
 * Output: '/doctor-sm.jpg 400w, /doctor-md.jpg 800w, /doctor-lg.jpg 1200w'
 */
export const generateImageSrcSet = (imagePath) => {
  const withoutExt = imagePath.substring(0, imagePath.lastIndexOf('.'));
  const ext = imagePath.substring(imagePath.lastIndexOf('.'));

  return `
    ${withoutExt}-sm${ext} 400w,
    ${withoutExt}-md${ext} 800w,
    ${withoutExt}-lg${ext} 1200w,
    ${withoutExt}${ext} 1600w
  `.trim();
};

/**
 * Get responsive image sizes untuk lazy loading
 * Contoh: getImageSizes() 
 * Output: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
 */
export const getImageSizes = (sizes = null) => {
  if (sizes) return sizes;
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};

/**
 * Aspect ratio utilities untuk prevent layout shift
 */
export const aspectRatios = {
  square: 'aspect-square',      // 1:1
  video: 'aspect-video',         // 16:9
  portrait: 'aspect-[3/4]',      // 3:4
  doctorCard: 'aspect-[4/5]',    // 4:5
};

/**
 * Image container classes untuk responsive display
 */
export const imageContainerClasses = {
  small: 'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24',
  medium: 'h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40',
  large: 'h-40 w-40 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80',
  fullWidth: 'w-full h-auto',
};

/**
 * Hover effects untuk responsive devices
 * Hanya apply hover effects di desktop (avoid pada mobile touch devices)
 */
export const responsiveHoverClasses = `
  transition-transform duration-300 
  hover:scale-105 
  active:scale-100
`;

/**
 * Lazy loading image component (opsional untuk implementasi lebih lanjut)
 */
export const lazyLoadConfig = {
  loading: 'lazy',
  decoding: 'async',
  onError: 'handleImageError',
};
