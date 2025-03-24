
import { CropArea, Point } from './types';

/**
 * Constrains a value between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Creates a crop area with the given aspect ratio
 */
export const createCropArea = (
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number
): CropArea => {
  // Calculate dimensions that maintain the aspect ratio and fit within the container
  let width = containerWidth * 0.8;
  let height = width / aspectRatio;

  // If height is too large, adjust width to maintain aspect ratio
  if (height > containerHeight * 0.8) {
    height = containerHeight * 0.8;
    width = height * aspectRatio;
  }

  // Apply min/max constraints if provided
  if (minWidth !== undefined) width = Math.max(width, minWidth);
  if (maxWidth !== undefined) width = Math.min(width, maxWidth);
  if (minHeight !== undefined) height = Math.max(height, minHeight);
  if (maxHeight !== undefined) height = Math.min(height, maxHeight);

  // Center the crop area
  const x = (containerWidth - width) / 2;
  const y = (containerHeight - height) / 2;

  return { x, y, width, height };
};

/**
 * Gets the real image coordinates from the display coordinates
 */
export const getActualImageCoordinates = (
  cropArea: CropArea,
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): CropArea => {
  const scaleX = imageWidth / containerWidth;
  const scaleY = imageHeight / containerHeight;

  return {
    x: cropArea.x * scaleX,
    y: cropArea.y * scaleY,
    width: cropArea.width * scaleX,
    height: cropArea.height * scaleY,
  };
};

/**
 * Creates a cropped image from the original image
 */
export const cropImage = (
  image: HTMLImageElement,
  cropArea: CropArea,
  shape: 'square' | 'round'
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  // Draw cropped image
  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  // If shape is round, apply circular mask
  if (shape === 'round') {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(
      cropArea.width / 2,
      cropArea.height / 2,
      Math.min(cropArea.width, cropArea.height) / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
};

/**
 * Calculates the distance between two points
 */
export const getDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculates the center point between two points
 */
export const getMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

/**
 * Detects which handle is being dragged based on mouse/touch position
 */
export const getActiveHandle = (
  point: Point,
  cropArea: CropArea,
  handleSize: number = 20
): string | null => {
  const halfHandle = handleSize / 2;
  const handles = {
    'top-left': { x: cropArea.x, y: cropArea.y },
    'top-right': { x: cropArea.x + cropArea.width, y: cropArea.y },
    'bottom-left': { x: cropArea.x, y: cropArea.y + cropArea.height },
    'bottom-right': { 
      x: cropArea.x + cropArea.width, 
      y: cropArea.y + cropArea.height 
    },
    'top-middle': { 
      x: cropArea.x + cropArea.width / 2, 
      y: cropArea.y 
    },
    'bottom-middle': { 
      x: cropArea.x + cropArea.width / 2, 
      y: cropArea.y + cropArea.height 
    },
    'middle-left': { 
      x: cropArea.x, 
      y: cropArea.y + cropArea.height / 2 
    },
    'middle-right': { 
      x: cropArea.x + cropArea.width, 
      y: cropArea.y + cropArea.height / 2 
    },
  };

  for (const [handle, pos] of Object.entries(handles)) {
    const distance = getDistance(point, pos);
    if (distance <= handleSize) {
      return handle;
    }
  }

  // Check if the point is inside the crop area
  if (
    point.x >= cropArea.x &&
    point.x <= cropArea.x + cropArea.width &&
    point.y >= cropArea.y &&
    point.y <= cropArea.y + cropArea.height
  ) {
    return 'move';
  }

  return null;
};

/**
 * Updates the crop area based on the handle being dragged
 */
export const updateCropArea = (
  cropArea: CropArea,
  activeHandle: string,
  point: Point,
  prevPoint: Point,
  aspectRatio: number | null,
  containerWidth: number,
  containerHeight: number
): CropArea => {
  const deltaX = point.x - prevPoint.x;
  const deltaY = point.y - prevPoint.y;
  
  let { x, y, width, height } = { ...cropArea };

  if (activeHandle === 'move') {
    // Move the entire crop area
    x = clamp(x + deltaX, 0, containerWidth - width);
    y = clamp(y + deltaY, 0, containerHeight - height);
    return { x, y, width, height };
  }

  // Handle corner and edge resizing
  switch (activeHandle) {
    case 'top-left':
      x += deltaX;
      y += deltaY;
      width -= deltaX;
      height -= deltaY;
      break;
    case 'top-right':
      y += deltaY;
      width += deltaX;
      height -= deltaY;
      break;
    case 'bottom-left':
      x += deltaX;
      width -= deltaX;
      height += deltaY;
      break;
    case 'bottom-right':
      width += deltaX;
      height += deltaY;
      break;
    case 'top-middle':
      y += deltaY;
      height -= deltaY;
      break;
    case 'bottom-middle':
      height += deltaY;
      break;
    case 'middle-left':
      x += deltaX;
      width -= deltaX;
      break;
    case 'middle-right':
      width += deltaX;
      break;
  }

  // Ensure minimum size
  const minSize = 50;
  if (width < minSize) {
    width = minSize;
    if (activeHandle.includes('left')) {
      x = cropArea.x + cropArea.width - minSize;
    }
  }
  if (height < minSize) {
    height = minSize;
    if (activeHandle.includes('top')) {
      y = cropArea.y + cropArea.height - minSize;
    }
  }

  // Apply aspect ratio if needed
  if (aspectRatio !== null) {
    if (activeHandle.includes('top') || activeHandle.includes('bottom')) {
      // Vertical resize - adjust width based on height
      width = height * aspectRatio;
      
      // Adjust x position if needed
      if (activeHandle.includes('left')) {
        x = cropArea.x + cropArea.width - width;
      }
    } else {
      // Horizontal resize - adjust height based on width
      height = width / aspectRatio;
      
      // Adjust y position if needed
      if (activeHandle.includes('top')) {
        y = cropArea.y + cropArea.height - height;
      }
    }
  }

  // Ensure crop area stays within container bounds
  if (x < 0) {
    width += x;
    x = 0;
  }
  if (y < 0) {
    height += y;
    y = 0;
  }
  if (x + width > containerWidth) {
    width = containerWidth - x;
  }
  if (y + height > containerHeight) {
    height = containerHeight - y;
  }

  return { x, y, width, height };
};
