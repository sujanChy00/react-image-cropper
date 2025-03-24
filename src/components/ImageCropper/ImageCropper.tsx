import { cn } from "@/lib/utils";
import React, { useCallback, useEffect } from "react";
import { AspectRatioSelector } from "./aspect-ratio-selector";
import { CropArea } from "./crop-area";
import { useImageCropper } from "./ImageCropperContext";
import { ImageCropperProps } from "./types";
import { clamp, createCropArea } from "./utils";

export const ImageCropper: React.FC<ImageCropperProps> = ({
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
}) => {
  const {
    imageRef,
    containerSize,
    cropArea,
    setCropArea,
    setContainerSize,
    showPreview,
    previewImage,
    imageLoaded,
    containerRef,
    cropShape,
    selectedAspectRatio,
  } = useImageCropper();

  const initializeCropArea = useCallback(() => {
    if (!containerRef.current || !imageRef.current || !imageLoaded) return;

    const { clientWidth, clientHeight } = containerRef.current;
    setContainerSize({ width: clientWidth, height: clientHeight });

    const aspectRatio = selectedAspectRatio === 0 ? 1 : selectedAspectRatio;
    const newCropArea = createCropArea(
      clientWidth,
      clientHeight,
      aspectRatio,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight
    );

    setCropArea(newCropArea);
  }, [
    imageLoaded,
    selectedAspectRatio,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });

        const widthRatio = clientWidth / containerSize.width;
        const heightRatio = clientHeight / containerSize.height;

        setCropArea((prevCropArea) => ({
          x: prevCropArea.x * widthRatio,
          y: prevCropArea.y * heightRatio,
          width: prevCropArea.width * widthRatio,
          height: prevCropArea.height * heightRatio,
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerSize]);

  useEffect(() => {
    initializeCropArea();
  }, [initializeCropArea]);

  useEffect(() => {
    if (!containerRef.current || !imageLoaded) return;

    const { clientWidth, clientHeight } = containerRef.current;

    if (selectedAspectRatio === 0) return;

    const currentCenter = {
      x: cropArea.x + cropArea.width / 2,
      y: cropArea.y + cropArea.height / 2,
    };

    const newArea = createCropArea(
      clientWidth,
      clientHeight,
      selectedAspectRatio,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight
    );

    const x = clamp(
      currentCenter.x - newArea.width / 2,
      0,
      clientWidth - newArea.width
    );
    const y = clamp(
      currentCenter.y - newArea.height / 2,
      0,
      clientHeight - newArea.height
    );

    setCropArea({
      ...newArea,
      x,
      y,
    });
  }, [
    selectedAspectRatio,
    imageLoaded,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
  ]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground animate-fade-in">
      {showPreview ? (
        <div className="flex-1 min-h-[400px] overflow-hidden flex items-center justify-center p-6 bg-black/10">
          <div
            className={cn(
              "overflow-hidden bg-black/20 max-w-full max-h-full animate-scale-in",
              cropShape === "round" ? "rounded-full" : "rounded-md"
            )}
          >
            <img
              src={previewImage}
              alt="Crop preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="h-full w-full">
          <CropArea />
          <AspectRatioSelector />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
