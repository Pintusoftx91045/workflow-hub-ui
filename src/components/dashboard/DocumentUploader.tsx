
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useState } from "react";

interface DocumentUploaderProps {
  title?: string;
  description?: string;
  onUpload?: (file: File) => void;
  onFileSelected?: (file: File) => void;
  maxSize?: number;
  acceptedTypes?: string[];
  uploadButtonText?: string;
  allowedTypes?: string;
}

export default function DocumentUploader({
  title,
  description,
  onUpload,
  onFileSelected,
  maxSize = 10,
  uploadButtonText = "Upload Document",
  allowedTypes = ".pdf, .doc, .docx",
  acceptedTypes,
}: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (onFileSelected) {
        onFileSelected(selectedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      if (onFileSelected) {
        onFileSelected(selectedFile);
      }
    }
  };

  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (onUpload) {
      onUpload(file);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      setFile(null);
    }
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">Drag & drop file here</p>
          <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
          
          <Input
            type="file"
            id="file-upload"
            accept={acceptedTypes?.join(", ") || allowedTypes}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="mb-2"
          >
            Select File
          </Button>
          <p className="text-xs text-muted-foreground">
            Supported formats: {acceptedTypes?.join(", ") || allowedTypes}
          </p>
        </div>

        {file && (
          <div className="mt-4 p-3 border rounded-md bg-muted/30">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </CardContent>
      {onUpload && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!file}
          >
            {uploadButtonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
