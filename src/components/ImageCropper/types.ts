export interface Point {
  x: number;
  y: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AspectRatio {
  value: number;
  label: string;
}

export type CropShape = "square" | "round";

export interface ImageCropperProps {
  image: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}
