import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCw, Trash2, Upload, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import CropperDialog from "./CropperDialog";
import { ImageCropperProvider, useImageCropper } from "./ImageCropperContext";

const ImageCropperContent: React.FC = () => {
  const {
    originalImage,
    croppedImage,
    isRound,
    fileInputRef,
    handleFileChange,
    handleTriggerFileInput,
    handleReset,
    handleStartCropping,
  } = useImageCropper();

  const [isDragging, setIsDragging] = useState(false);
  const displayImage = croppedImage || originalImage;
  const isImageCropped = !!croppedImage;

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];

    const fakeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleFileChange(fakeEvent);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-background rounded-lg overflow-hidden shadow-lg animate-fade-in">
      <CropperDialog />

      <div className="p-6 md:p-8 flex flex-col h-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          React Image Cropper
        </h1>
        <p className="text-muted-foreground mb-8">
          A simple, elegant image cropping tool
        </p>

        <div className="flex-1">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Image</h2>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!displayImage ? (
              <div
                onClick={handleTriggerFileInput}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed border-border rounded-lg flex-1 flex flex-col items-center justify-center p-8 cursor-pointer transition-colors min-h-[300px]",
                  isDragging ? "bg-muted border-primary" : "hover:bg-muted/50"
                )}
              >
                <div className="w-16 h-16 mb-4 bg-muted rounded-full flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">
                  {isDragging ? "Drop image here" : "Drop your image here"}
                </p>
                <p className="text-muted-foreground text-sm mb-4 text-center">
                  or click to browse
                  <br />
                  Supports JPG, PNG, GIF up to 10MB
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-muted/10 rounded-lg p-4 border border-border min-h-[300px]">
                <div className="flex-1 relative overflow-hidden rounded-md flex items-center justify-center">
                  {isImageCropped ? (
                    <div
                      className={cn(
                        "overflow-hidden max-w-full max-h-full",
                        isRound ? "rounded-full" : "rounded-md"
                      )}
                    >
                      <img
                        src={displayImage}
                        alt="Cropped"
                        className="object-contain max-w-full max-h-[400px]"
                      />
                    </div>
                  ) : (
                    <img
                      src={displayImage}
                      alt="Original"
                      className="w-full h-full object-contain max-h-[400px]"
                    />
                  )}
                </div>
                <div className="flex justify-between mt-4 gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <div className="flex gap-2">
                    {isImageCropped && (
                      <Button onClick={handleStartCropping}>
                        <RotateCw className="h-4 w-4 mr-2" />
                        Recrop
                      </Button>
                    )}
                    {!isImageCropped && originalImage && (
                      <Button onClick={handleStartCropping}>
                        <RotateCw className="h-4 w-4 mr-2" />
                        Crop
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageCropperApp: React.FC = () => {
  return (
    <ImageCropperProvider>
      <ImageCropperContent />
    </ImageCropperProvider>
  );
};

export default ImageCropperApp;
