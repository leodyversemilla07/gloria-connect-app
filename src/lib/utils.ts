import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Doc } from "../../convex/_generated/dataModel"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the primary photo for a business, or a fallback.
 */
export function getPrimaryPhoto(business: Doc<"businesses">) {
  if (!business.photos || business.photos.length === 0) return null;
  const primary = business.photos.find(p => p.isPrimary);
  return primary || business.photos[0];
}

/**
 * Get the URL for a business photo, with fallback support.
 */
export function getPhotoUrl(photo: { url: string; storageId?: string } | null | undefined) {
  if (!photo) return "/placeholder.svg";
  
  // For now, we prefer the URL if it's already a full URL (like a blob URL or external link)
  // In a real production setup with Convex, if storageId is present, we might want 
  // to fetch the real URL via convex query, but for preview and stored URLs, this works.
  if (photo.url && (photo.url.startsWith("http") || photo.url.startsWith("blob:") || photo.url.startsWith("/"))) {
    return photo.url;
  }
  
  return "/placeholder.svg";
}
