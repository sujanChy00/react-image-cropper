import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Check } from "lucide-react";
import React from "react";
import ImageCropper from "./ImageCropper";
import { useImageCropper } from "./ImageCropperContext";
import { cropImage, getActualImageCoordinates } from "./utils";

const CropperDialog: React.FC = () => {
  const {
    isCropping,
    originalImage,
    setIsCropping,
    previewImage,
    setShowPreview,
    setPreviewImage,
    onCropChange,
    containerSize,
    imageRef,
    cropArea,
    cropShape,
    showPreview,
  } = useImageCropper();

  const handleBackToEdit = () => {
    setShowPreview(false);
    setPreviewImage("");
  };

  const handleCropComplete = () => {
    if (showPreview && previewImage) {
      onCropChange(previewImage);
    } else if (imageRef?.current) {
      const actualCropArea = getActualImageCoordinates(
        cropArea,
        imageRef.current.naturalWidth,
        imageRef.current.naturalHeight,
        containerSize.width,
        containerSize.height
      );

      const croppedImageData = cropImage(
        imageRef.current,
        actualCropArea,
        cropShape
      );
      onCropChange(croppedImageData);
    }
  };

  return (
    <Dialog open={isCropping} onOpenChange={setIsCropping}>
      <DialogContent className="max-w-3xl flex flex-col max-h-[80dvh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border flex justify-between items-center m-0">
          <DialogTitle className="text-xl font-semibold">
            Crop Image
          </DialogTitle>
          <DialogDescription className="sr-only">
            Crop your image to the desired size and shape
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto relative">
          {originalImage && <ImageCropper />}
        </div>

        {!!previewImage && (
          <DialogFooter className="p-4 border-t border-border flex justify-end gap-2 bg-background animate-slide-in">
            <Button variant="outline" onClick={handleBackToEdit}>
              <ArrowLeft className="size-4" /> Back to edit
            </Button>
            <Button onClick={handleCropComplete}>
              <Check className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CropperDialog;
