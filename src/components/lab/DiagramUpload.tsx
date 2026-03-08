import { Upload, X } from "lucide-react";
import { useRef } from "react";

interface Props {
  diagramPreview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

const DiagramUpload = ({ diagramPreview, onFileSelect, onRemove }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      {diagramPreview ? (
        <div className="relative rounded-xl border-2 border-dashed border-border p-4 flex items-center justify-center bg-muted/30">
          <img src={diagramPreview} alt="Diagram" className="max-h-64 rounded-lg object-contain" />
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:opacity-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-border py-16 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/40 hover:bg-accent/30 transition-colors"
        >
          <Upload className="h-10 w-10" />
          <span className="font-medium">Click to upload diagram</span>
          <span className="text-xs">PNG, JPG up to 5MB</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
};

export default DiagramUpload;
