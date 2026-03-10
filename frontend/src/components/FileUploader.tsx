import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export const FileUploader = ({ onFileSelect, preview, onClear, disabled }: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload image file"
      />
      
      {!preview ? (
        <button
          onClick={handleClick}
          disabled={disabled}
          className="w-full h-64 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-4 bg-card/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-foreground font-medium">Click to upload image</p>
            <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 6MB</p>
          </div>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <img
            src={preview}
            alt="Preview of uploaded ballistic missile"
            className="w-full h-64 object-contain rounded-lg border border-border bg-card/50"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
            disabled={disabled}
            aria-label="Clear image"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};
