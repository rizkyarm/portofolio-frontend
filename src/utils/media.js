/**
 * Transform S3/MinIO local URL → proxy endpoint
 * 
 * http://localhost:9000/my-bucket/profile/avatars/xxx.png?sign=...
 *   → https://backend/api/v1/files/proxy/profile%2Favatars%2Fxxx.png?sign=...
 */
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '') || '';

export function getFileUrl(s3Url) {
  if (!s3Url) return '';

  // If already a proxy URL or external URL, return as-is
  if (s3Url.includes('/api/v1/files/proxy/')) return s3Url;
  if (!s3Url.includes('localhost') && !s3Url.includes('my-bucket')) return s3Url;

  // Extract key from S3 URL: "profile/avatars/xxx.png"
  const key = s3Url
    .replace('http://localhost:9000/my-bucket/', '')
    .split('?')[0]; // Remove S3 presigned params

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
