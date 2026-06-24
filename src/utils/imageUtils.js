export const resolveImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('/api/')) {
    return `${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}${url}`;
  }
  return url;
};
