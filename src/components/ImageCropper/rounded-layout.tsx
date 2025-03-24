import { useImageCropper } from "./ImageCropperContext";

export const RoundedLayout = () => {
  const {
    cropArea,
    setIsDragging,
    setActiveHandle,
    setPrevPos,
    getEventPoint,
  } = useImageCropper();

  const { x, y, width, height } = cropArea;
  return (
    <div>
      <div
        className="cropper-handle"
        style={{
          top: y + height / 2,
          left: x,
          cursor: "ew-resize",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("middle-left");
          setPrevPos(getEventPoint(e));
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("middle-left");
          setPrevPos(getEventPoint(e));
        }}
      />
      <div
        className="cropper-handle"
        style={{
          top: y + height / 2,
          left: x + width,
          cursor: "ew-resize",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("middle-right");
          setPrevPos(getEventPoint(e));
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("middle-right");
          setPrevPos(getEventPoint(e));
        }}
      />
      <div
        className="cropper-handle"
        style={{
          top: y,
          left: x + width / 2,
          cursor: "ns-resize",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("top-middle");
          setPrevPos(getEventPoint(e));
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("top-middle");
          setPrevPos(getEventPoint(e));
        }}
      />
      <div
        className="cropper-handle"
        style={{
          top: y + height,
          left: x + width / 2,
          cursor: "ns-resize",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("bottom-middle");
          setPrevPos(getEventPoint(e));
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setActiveHandle("bottom-middle");
          setPrevPos(getEventPoint(e));
        }}
      />
    </div>
  );
};
