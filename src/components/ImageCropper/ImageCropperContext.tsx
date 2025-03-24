import { toast } from "@/hooks/use-toast";
import React, { createContext, useContext, useRef, useState } from "react";
import { CropArea, CropShape, Point } from "./types";
import { cropImage, getActualImageCoordinates } from "./utils";

interface ImageCropperContextType {
  originalImage: string;
  croppedImage: string;
  isCropping: boolean;
  isRound: boolean;
  cropShape: CropShape;
  fileInputRef: React.RefObject<HTMLInputElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  containerSize: { width: number; height: number };
  cropArea: CropArea;
  showPreview: boolean;
  previewImage: string;
  imageLoaded: boolean;
  isDragging: boolean;
  activeHandle: string | null;
  prevPos: Point;
  containerRef: React.RefObject<HTMLDivElement>;
  selectedAspectRatio: number;
  croppedImageData: string;

  // Actions
  setOriginalImage: React.Dispatch<React.SetStateAction<string>>;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setIsCropping: React.Dispatch<React.SetStateAction<boolean>>;
  setCropShape: React.Dispatch<React.SetStateAction<CropShape>>;
  setCropArea: React.Dispatch<React.SetStateAction<CropArea>>;
  setContainerSize: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >;
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveHandle: React.Dispatch<React.SetStateAction<string | null>>;
  setPrevPos: React.Dispatch<React.SetStateAction<Point>>;
  setSelectedAspectRatio: React.Dispatch<React.SetStateAction<number>>;
  setCroppedImageData: React.Dispatch<React.SetStateAction<string>>;

  // Handler functions
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCropComplete: (croppedImageData: string) => void;
  handleReset: () => void;
  handleTriggerFileInput: () => void;
  handleStartCropping: () => void;
  handlePreviewCrop: () => void;
  getEventPoint: (e: React.MouseEvent | React.TouchEvent) => Point;
  onCropChange: (cropData: string) => void;
}

const ImageCropperContext = createContext<ImageCropperContextType | undefined>(
  undefined
);

export const ImageCropperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [originalImage, setOriginalImage] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [isRound, setIsRound] = useState<boolean>(false);
  const [cropShape, setCropShape] = useState<CropShape>("square");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [croppedImageData, setCroppedImageData] = useState<string>("");

  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number>(1);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [prevPos, setPrevPos] = useState<Point>({ x: 0, y: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Selected file is not an image",
        variant: "destructive",
      });
      return;
    }

    // // Check file size (max 10MB)
    // if (file.size > 10 * 1024 * 1024) {
    //   toast({
    //     title: "Error",
    //     description: "Image is too large (max 10MB)",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOriginalImage(event.target.result as string);
        setCroppedImage("");
        setIsCropping(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageData: string) => {
    if (croppedImageData) {
      setCroppedImage(croppedImageData);
      setIsRound(cropShape === "round");
    }
    setIsCropping(false);
  };

  const handleReset = () => {
    setCroppedImage("");
    setOriginalImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStartCropping = () => {
    if (originalImage) {
      setIsCropping(true);
    }
  };

  const handlePreviewCrop = () => {
    if (!imageRef.current) return;

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
    setPreviewImage(croppedImageData);
    setShowPreview(true);
  };

  const getEventPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: 0, y: 0 };

    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - containerRect.left,
      y: clientY - containerRect.top,
    };
  };

  const onCropChange = (cropData: string) => {
    if (cropData) {
      handleCropComplete(cropData);
    }
    setIsCropping(false);
    setShowPreview(false);
    setPreviewImage("");
  };

  const value: ImageCropperContextType = {
    originalImage,
    croppedImage,
    isCropping,
    isRound,
    cropShape,
    fileInputRef,
    setOriginalImage,
    setCroppedImage,
    setIsCropping,
    setCropShape,
    handleFileChange,
    handleCropComplete,
    handleReset,
    handleTriggerFileInput,
    handleStartCropping,
    handlePreviewCrop,
    imageRef,
    containerSize,
    cropArea,
    showPreview,
    previewImage,
    setContainerSize,
    setCropArea,
    setPreviewImage,
    setShowPreview,
    imageLoaded,
    setImageLoaded,
    isDragging,
    setIsDragging,
    activeHandle,
    setActiveHandle,
    prevPos,
    setPrevPos,
    containerRef,
    getEventPoint,
    selectedAspectRatio,
    setSelectedAspectRatio,
    croppedImageData,
    setCroppedImageData,
    onCropChange,
  };

  return (
    <ImageCropperContext.Provider value={value}>
      {children}
    </ImageCropperContext.Provider>
  );
};

export const useImageCropper = (): ImageCropperContextType => {
  const context = useContext(ImageCropperContext);
  if (context === undefined) {
    throw new Error(
      "useImageCropper must be used within a ImageCropperProvider"
    );
  }
  return context;
};
