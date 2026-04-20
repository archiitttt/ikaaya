/**
 * Optimize Cloudinary image URLs for faster loading
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary')) {
    return url;
  }

  const {
    width = 800,
    height = 800,
    quality = 'auto', // auto, 80, 90, etc
    format = 'auto', // auto, webp, jpg, png
    crop = 'fill'
  } = options;

  // Insert transformation parameters after /upload/
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    const transformation = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
  }

  return url;
};

/**
 * Get optimized URL for product images
 * Larger size for product detail pages
 */
export const getProductImageUrl = (url) => {
  return optimizeCloudinaryUrl(url, {
    width: 1000,
    height: 1000,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  });
};

/**
 * Get optimized URL for product cards/thumbnails
 * Smaller size for list views
 */
export const getCardImageUrl = (url) => {
  return optimizeCloudinaryUrl(url, {
    width: 500,
    height: 500,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  });
};

/**
 * Get optimized URL for featured/category images
 */
export const getFeaturedImageUrl = (url) => {
  return optimizeCloudinaryUrl(url, {
    width: 600,
    height: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  });
};
