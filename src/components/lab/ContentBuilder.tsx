import { useState } from "react";
import { Plus, GripVertical, Trash2, Image as ImageIcon, Table as TableIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ContentItem, ObservationTable, ImageItem } from "@/types/experiment";
import TableBuilder from "./TableBuilder";
import DiagramUpload from "./DiagramUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContentBuilderProps {
  content: ContentItem[];
  onChange: (content: ContentItem[]) => void;
}

const ContentBuilder = ({ content, onChange }: ContentBuilderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [customSectionName, setCustomSectionName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTextSection = (section: "aim" | "apparatus" | "procedure" | "result") => {
    const newItem: ContentItem = {
      type: "text",
      id: `text-${Date.now()}`,
      section,
      content: "",
    };
    onChange([...content, newItem]);
  };

  const addCustomSection = () => {
    if (!customSectionName.trim()) return;
    
    const newItem: ContentItem = {
      type: "text",
      id: `text-${Date.now()}`,
      section: customSectionName.trim() as any,
      content: "",
    };
    onChange([...content, newItem]);
    setCustomSectionName("");
    setIsDialogOpen(false);
  };

  const addTable = () => {
    const newTable: ObservationTable = {
      id: `table-${Date.now()}`,
      title: "Observation Table",
      columns: [],
      numRows: 5,
    };
    const newItem: ContentItem = {
      type: "table",
      id: `table-${Date.now()}`,
      data: newTable,
    };
    onChange([...content, newItem]);
  };

  const addImage = () => {
    const newImage: ImageItem = {
      id: `image-${Date.now()}`,
      file: null,
      preview: null,
      caption: "",
    };
    const newItem: ContentItem = {
      type: "image",
      id: `image-${Date.now()}`,
      data: newImage,
    };
    onChange([...content, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(content.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ContentItem>) => {
    onChange(
      content.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newContent = [...content];
    const draggedItem = newContent[draggedIndex];
    newContent.splice(draggedIndex, 1);
    newContent.splice(index, 0, draggedItem);

    onChange(newContent);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      aim: "Aim",
      apparatus: "Apparatus / Requirements",
      procedure: "Procedure",
      result: "Result",
    };
    return labels[section] || section;
  };

  return (
    <div className="space-y-6">
      {/* Add Content Buttons */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Add Content</h3>
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={(value) => addTextSection(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Add Text Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aim">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Aim
                </div>
              </SelectItem>
              <SelectItem value="apparatus">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Apparatus
                </div>
              </SelectItem>
              <SelectItem value="procedure">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Procedure
                </div>
              </SelectItem>
              <SelectItem value="result">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Result
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Custom Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Section</DialogTitle>
                <DialogDescription>
                  Enter a name for your custom section (e.g., "Theory", "Observations", "Calculations")
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  value={customSectionName}
                  onChange={(e) => setCustomSectionName(e.target.value)}
                  placeholder="Section name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addCustomSection();
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addCustomSection} disabled={!customSectionName.trim()}>
                  Add Section
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={addTable} variant="outline" size="sm">
            <TableIcon className="h-4 w-4 mr-2" />
            Add Table
          </Button>

          <Button onClick={addImage} variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </Card>

      {/* Content Items */}
      <div className="space-y-4">
        {content.map((item, index) => (
          <Card
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`p-4 ${draggedIndex === index ? "opacity-50" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className="cursor-move mt-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1">
                {item.type === "text" && (
                  <div className="space-y-3">
                    <Input
                      value={getSectionLabel(item.section)}
                      onChange={(e) =>
                        updateItem(item.id, { section: e.target.value } as any)
                      }
                      placeholder="Section title"
                      className="font-semibold"
                    />
                    <Textarea
                      value={item.content}
                      onChange={(e) =>
                        updateItem(item.id, { content: e.target.value } as any)
                      }
                      placeholder={`Enter ${item.section} content...`}
                      rows={4}
                    />
                  </div>
                )}

                {item.type === "table" && (
                  <div className="space-y-3">
                    <Input
                      value={item.data.title}
                      onChange={(e) =>
                        updateItem(item.id, {
                          data: { ...item.data, title: e.target.value },
                        } as any)
                      }
                      placeholder="Table Title"
                      className="font-semibold"
                    />
                    <TableBuilder
                      columns={item.data.columns}
                      numRows={item.data.numRows}
                      onColumnsChange={(cols) =>
                        updateItem(item.id, {
                          data: { ...item.data, columns: cols },
                        } as any)
                      }
                      onNumRowsChange={(n) =>
                        updateItem(item.id, {
                          data: { ...item.data, numRows: n },
                        } as any)
                      }
                    />
                  </div>
                )}

                {item.type === "image" && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Image</h4>
                    <DiagramUpload
                      diagramPreview={item.data.preview}
                      onFileSelect={(file) =>
                        updateItem(item.id, {
                          data: {
                            ...item.data,
                            file,
                            preview: URL.createObjectURL(file),
                          },
                        } as any)
                      }
                      onRemove={() =>
                        updateItem(item.id, {
                          data: { ...item.data, file: null, preview: null },
                        } as any)
                      }
                    />
                    <Input
                      value={item.data.caption}
                      onChange={(e) =>
                        updateItem(item.id, {
                          data: { ...item.data, caption: e.target.value },
                        } as any)
                      }
                      placeholder="Image caption (optional)"
                    />
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {content.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No content added yet. Use the buttons above to add sections, tables, or images.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentBuilder;
