import { Crop } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useImageCropper } from "./ImageCropperContext";
import { RoundedLayout } from "./rounded-layout";
import { SquareLayout } from "./square-layout";
import { getActiveHandle, updateCropArea } from "./utils";

export const CropArea = () => {
  const {
    isDragging,
    imageLoaded,
    cropArea,
    cropShape,
    activeHandle,
    containerSize,
    getEventPoint,
    setIsDragging,
    setActiveHandle,
    setPrevPos,
    handlePreviewCrop,
    prevPos,
    selectedAspectRatio,
    containerRef,
    imageRef,
    setCropArea,
    setImageLoaded,
    originalImage: image,
  } = useImageCropper();
  const { x, y, width, height } = cropArea;

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getEventPoint(e);
    const handle = getActiveHandle(point, cropArea);

    if (handle) {
      setIsDragging(true);
      setActiveHandle(handle);
      setPrevPos(point);
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !activeHandle) return;

    e.preventDefault();
    const point = getEventPoint(e);

    const newCropArea = updateCropArea(
      cropArea,
      activeHandle,
      point,
      prevPos,
      selectedAspectRatio === 0 ? null : selectedAspectRatio,
      containerSize.width,
      containerSize.height
    );

    setCropArea(newCropArea);
    setPrevPos(point);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className="relative flex-1 overflow-hidden cropper-container bg-black"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      <img
        ref={imageRef}
        src={image}
        alt="Original"
        className="w-full h-full object-contain select-none opacity-0 absolute"
        onLoad={handleImageLoad}
        style={{ visibility: "hidden" }}
      />

      {imageLoaded && (
        <img
          src={image}
          alt="Crop"
          className="w-full h-full object-contain select-none"
          style={{ userSelect: "none", pointerEvents: "none" }}
        />
      )}

      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div
        className={`absolute transition-crop ${
          isDragging ? "" : "transition-all duration-300 ease-out"
        }`}
        style={{
          top: y,
          left: x,
          width: width,
          height: height,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          borderRadius: cropShape === "round" ? "50%" : "0",
          cursor: activeHandle === "move" ? "move" : "default",
          overflow: "hidden",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <img
          src={image}
          alt="Crop Preview"
          className="absolute select-none"
          style={{
            top: -y,
            left: -x,
            width: containerSize.width,
            height: "auto",
            maxWidth: "none",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        <div className="cropper-grid">
          <div className="cropper-grid-h1"></div>
          <div className="cropper-grid-h2"></div>
          <div className="cropper-grid-v1"></div>
          <div className="cropper-grid-v2"></div>
        </div>
      </div>
      {cropShape === "round" && <RoundedLayout />}
      {cropShape === "square" && <SquareLayout />}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={handlePreviewCrop}
          size="lg"
          className="shadow-lg font-medium hover:bg-primary/90 px-8"
        >
          <Crop className="h-4 w-4 mr-2" />
          Crop Image
        </Button>
      </div>
    </div>
  );
};
