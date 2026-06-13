# Backend TODO — Menyesuaikan Perubahan Frontend

> Dibuat: 13 Juni 2026 | Frontend: `portfolio-frontend`

---

## 1. Endpoint File Proxy (`/api/v1/files/proxy/:path`)

**Tujuan:** Frontend mengubah URL MinIO lokal (`http://localhost:9000/my-bucket/...`) menjadi proxy endpoint agar bisa diakses dari production.

**Contoh request:**
```
GET /api/v1/files/proxy/profile%2Favatars%2Fxxx.png?X-Amz-Algorithm=...
```

**Yang harus dilakukan:**
- [ ] Decode `%2F` → `/` pada path
- [ ] Fetch file dari MinIO menggunakan SDK atau HTTP
- [ ] Return response dengan Content-Type yang sesuai (image/png, image/webp, dll)
- [ ] Forward query params (presigned URL) ke MinIO

**Contoh implementasi Next.js:**
```typescript
// app/api/v1/files/proxy/[...path]/route.ts
export async function GET(req: Request) {
  const url = new URL(req.url);
  const encodedPath = url.pathname.split('/api/v1/files/proxy/')[1];
  const filePath = decodeURIComponent(encodedPath); // %2F → /
  const minioUrl = `http://localhost:9000/my-bucket/${filePath}${url.search}`;
  const response = await fetch(minioUrl);
  return new Response(response.body, {
    headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream' },
  });
}
```

---

## 2. Multi-Image Upload (`POST/PUT /admin/projects`)

**Tujuan:** Frontend sekarang mengirim multiple images (`images[]`) selain thumbnail.

**FormData yang dikirim:**
```
thumbnail:       [File]           (gambar utama, 1 file)
images[0]:       [File]           (gambar tambahan)
images[1]:       [File]           (gambar tambahan)
existing_images: '["url1","url2"]' (JSON, hanya saat edit)
title:           "Project Name"
...
```

**Yang harus dilakukan:**
- [ ] Terima field `images[]` dari FormData
- [ ] Upload semua images ke MinIO (selain thumbnail)
- [ ] Simpan URL images di database (sebagai JSON array)
- [ ] Saat edit, terima `existing_images` (JSON) untuk mempertahankan gambar yang tidak dihapus
- [ ] Hapus gambar dari MinIO jika dihapus oleh user (ada di existing_images sebelumnya tapi tidak di existing_images baru)

---

## 3. Return `images[]` di Response API

**Tujuan:** Frontend ImageCarousel butuh array `images` untuk swipe.

**Endpoint yang perlu diupdate:**
- [ ] `GET /api/v1/projects` — tambah field `images` (array of URLs)
- [ ] `GET /api/v1/projects/:slug` — tambah field `images` (array of URLs)

**Response structure:**
```json
{
  "data": {
    "id": 1,
    "title": "Project Name",
    "thumbnail": "http://localhost:9000/my-bucket/thumb.webp",
    "images": [
      "http://localhost:9000/my-bucket/projects/slide1.webp",
      "http://localhost:9000/my-bucket/projects/slide2.webp"
    ]
  }
}
```

---

## 4. Transform URL di Backend (Opsional, Recommended)

**Tujuan:** Daripada frontend yang transform URL, backend bisa langsung return URL proxy.

- [ ] Di response API, transform `localhost:9000/my-bucket/` → `/api/v1/files/proxy/`
- [ ] Encode path slashes ke `%2F`

**Response setelah transform:**
```json
{
  "data": {
    "thumbnail": "/api/v1/files/proxy/thumb.webp",
    "images": [
      "/api/v1/files/proxy/projects%2Fslide1.webp",
      "/api/v1/files/proxy/projects%2Fslide2.webp"
    ]
  }
}
```

> Note: Jika backend sudah melakukan transform ini, frontend `getFileUrl()` akan otomatis melewatkannya (karena URL sudah bukan `localhost`).

---

## 5. Security Headers (CORS)

**Tujuan:** Jika frontend dan backend di domain berbeda.

- [ ] Allow CORS dari domain Vercel frontend
- [ ] Allow headers: `Content-Type`, `Authorization`
- [ ] Allow methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

```typescript
// next.config.js atau middleware
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://rizkiaditiyar.vercel.app' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
    ],
  },
]
```

---

## Prioritas

| # | Item | Prioritas |
|---|------|-----------|
| 1 | File Proxy endpoint | 🔴 KRITIS (tanpa ini gambar tidak muncul) |
| 2 | Multi-image upload | 🟡 HIGH (admin tidak bisa upload galeri) |
| 3 | Return `images[]` di response | 🟡 HIGH (carousel tidak ada data) |
| 4 | Transform URL di backend | 🟢 MEDIUM (opsional, frontend sudah handle) |
| 5 | CORS headers | 🟢 LOW (hanya jika beda domain) |
