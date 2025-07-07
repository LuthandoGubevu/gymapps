// src/lib/backgrounds.ts
const images = [
  '/gym-1.jpg', '/gym-2.jpg', '/gym-3.jpg', '/gym-4.jpg', '/gym-5.jpg',
  '/gym-6.jpg', '/gym-7.jpg', '/gym-8.jpg', '/gym-9.jpg'
];

// Simple hashing function to get a deterministic index from a string.
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getBackgroundForRoute(pathname: string): string {
  // Ensure the root path gets a consistent image
  if (!pathname || pathname === '/') {
    return images[0];
  }
  // Use a simple hash of the pathname to deterministically select an image
  const index = simpleHash(pathname) % images.length;
  return images[index];
}
