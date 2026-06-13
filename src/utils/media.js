/**
 * Transform S3/MinIO local URL → proxy endpoint
 * Handles multiple URL formats from backend
 */
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '') || '';

export function getFileUrl(s3Url) {
  if (!s3Url) return '';

  // Already a full external URL (not local) → return as-is
  if (s3Url.startsWith('https://') && !s3Url.includes('localhost')) return s3Url;
  if (s3Url.includes('/api/v1/files/proxy/')) return s3Url;

  let key = '';

  // Pattern 1: "http://localhost:9000/my-bucket/path/file.png?sign=..."
  if (s3Url.includes('localhost:9000/my-bucket/')) {
    key = s3Url
      .replace(/https?:\/\/localhost:9000\/my-bucket\//, '')
      .split('?')[0];
  }
  // Pattern 2: "http://localhost:9000/storage/path/file.png"
  else if (s3Url.includes('localhost:9000/storage/')) {
    key = s3Url
      .replace(/https?:\/\/localhost:9000\/storage\//, '')
      .split('?')[0];
  }
  // Pattern 3: relative "/storage/path/file.png"
  else if (s3Url.startsWith('/storage/')) {
    key = s3Url.replace('/storage/', '').split('?')[0];
  }
  // Pattern 4: "https://minio-server/my-bucket/..."
  else if (s3Url.includes('/my-bucket/')) {
    key = s3Url.split('/my-bucket/')[1]?.split('?')[0] || '';
  }
  else {
    // Unknown format — return as-is
    return s3Url;
  }

  if (!key) return s3Url;

  // Encode slashes to %2F
  return `${API_BASE}/api/v1/files/proxy/${key.replace(/\//g, '%2F')}`;
}

/**
 * Transform all media URLs in a project object
 */
export function transformProjectMedia(project) {
  if (!project) return project;
  
  return {
    ...project,
    thumbnail: getFileUrl(project.thumbnail),
    images: (project.images || []).map(img => 
      typeof img === 'string' ? getFileUrl(img) : { ...img, url: getFileUrl(img.url) }
    ),
  };
}
