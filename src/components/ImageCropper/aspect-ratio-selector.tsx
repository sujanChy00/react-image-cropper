import { Button } from "../ui/button";
import { useImageCropper } from "./ImageCropperContext";
import { AspectRatio } from "./types";

const aspectRatios: AspectRatio[] = [
  { value: 1, label: "1:1" },
  { value: 4 / 3, label: "4:3" },
  { value: 3 / 4, label: "3:4" },
  { value: 16 / 9, label: "16:9" },
  { value: 9 / 16, label: "9:16" },
  { value: 3 / 2, label: "3:2" },
  { value: 2 / 3, label: "2:3" },
  { value: 0, label: "Free" },
];

export const AspectRatioSelector = () => {
  const {
    cropShape,
    setCropShape,
    selectedAspectRatio,
    setSelectedAspectRatio,
  } = useImageCropper();
  return (
    <div className="p-4 bg-background border-t border-border">
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Aspect Ratio</p>
        <div className="flex flex-wrap gap-2">
          {aspectRatios.map((ratio) => (
            <Button
              key={ratio.label}
              variant={
                selectedAspectRatio === ratio.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedAspectRatio(ratio.value)}
              className="text-sm font-medium"
            >
              {ratio.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Shape</p>
        <div className="flex gap-2">
          <Button
            variant={cropShape === "square" ? "default" : "outline"}
            size="sm"
            onClick={() => setCropShape("square")}
            className="text-sm font-medium"
          >
            Square
          </Button>
          <Button
            variant={cropShape === "round" ? "default" : "outline"}
            size="sm"
            onClick={() => setCropShape("round")}
            className="text-sm font-medium"
          >
            Round
          </Button>
        </div>
      </div>
    </div>
  );
};
