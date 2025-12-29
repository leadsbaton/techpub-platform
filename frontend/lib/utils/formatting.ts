// Utility functions for formatting dates, text, etc.

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]}, ${date.getDate()}`;
}

export function getImageUrl(image: any): string {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  if (typeof image === "string") {
    // If it's already a string, check if it's a relative URL
    if (image.startsWith("/")) {
      // Relative URL from Payload - make it absolute
      return `${API_URL}${image}`;
    }
    // Already an absolute URL
    return image;
    ``;
  }

  if (image?.url) {
    // Payload media objects have a url property (usually relative like /api/media/file/...)
    const url = image.url;
    if (url.startsWith("/")) {
      // Relative URL - make it absolute
      return `${API_URL}${url}`;
    }
    return url;
  }

  if (image?.sizes?.large?.url) {
    // Check for responsive image sizes
    const url = image.sizes.large.url;
    if (url.startsWith("/")) {
      return `${API_URL}${url}`;
    }
    return url;
  }

  if (image?.filename) {
    // Fallback: construct URL from filename
    return `${API_URL}/api/media/file/${image.filename}`;
  }

  // Fallback placeholder
  return "https://picsum.photos/800/600";
}
