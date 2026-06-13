/**
 * Compress image before upload.
 * - Resizes to max dimension (default 1200px)
 * - Converts to WebP or JPEG at specified quality
 * - Keeps original format if WebP not supported
 *
 * @param {File} file - Original image file
 * @param {Object} [options]
 * @param {number} [options.maxWidth=1200] - Max width in pixels
 * @param {number} [options.maxHeight=1200] - Max height in pixels
 * @param {number} [options.quality=0.85] - Compression quality (0-1)
 * @returns {Promise<File>} Compressed file (WebP if supported, else JPEG)
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
  } = options;

  // Skip non-image files
  if (!file.type.startsWith('image/')) return file;

  // Skip GIF/SVG (no compression)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Only resize if image is larger than max dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height / width) * maxWidth);
          width = maxWidth;
        } else {
          width = Math.round((width / height) * maxHeight);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Use JPEG for maximum backend compatibility (WebP not always supported)
      const mimeType = 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: mimeType,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
}

/**
 * Batch compress multiple images
 */
export async function compressImages(files, options = {}) {
  const results = await Promise.allSettled(
    files.map(file => compressImage(file, options))
  );

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}
