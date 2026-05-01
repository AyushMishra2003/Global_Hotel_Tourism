// Image placeholder constants
export const PLACEHOLDER_IMAGES = {
  HOTEL: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
  CITY: 'https://images.pexels.com/photos/4133256/pexels-photo-4133256.jpeg',
  VENDOR: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
  DEFAULT: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
} as const;

export type ImageType = keyof typeof PLACEHOLDER_IMAGES;

export const getImageUrl = (url: string | undefined | null, type: ImageType = 'DEFAULT'): string => {
  if (!url || url.trim() === '') {
    return PLACEHOLDER_IMAGES[type];
  }
  return url;
};

export const isValidImage = (url: string | undefined | null): boolean => {
  return Boolean(url && url.trim() !== '');
};
