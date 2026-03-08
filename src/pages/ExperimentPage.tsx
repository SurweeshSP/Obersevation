import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { ExperimentData } from "@/types/experiment";
import DiagramUpload from "@/components/lab/DiagramUpload";
import TableBuilder from "@/components/lab/TableBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const initialData: ExperimentData = {
  title: "",
  aim: "",
  apparatus: "",
  procedure: "",
  diagramFile: null,
  diagramPreview: null,
  columns: [],
  numRows: 5,
  result: "",
};

const ExperimentPage = () => {
  const [data, setData] = useState<ExperimentData>(initialData);
  const navigate = useNavigate();

  const update = <K extends keyof ExperimentData>(key: K, value: ExperimentData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiagram = (file: File) => {
    update("diagramFile", file);
    update("diagramPreview", URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!data.title.trim()) {
      toast.error("Please enter an experiment title");
      return;
    }
    toast.success("Experiment saved successfully!");
    console.log("Experiment data:", data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-foreground">Create New Experiment</h2>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Experiment
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {/* Title */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Experiment Title</h3>
          <Input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g., Heat Transfer Experiment"
            className="text-lg"
          />
        </div>

        {/* Aim */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Aim</h3>
          <Textarea
            value={data.aim}
            onChange={(e) => update("aim", e.target.value)}
            placeholder="Describe the aim of this experiment..."
            rows={3}
          />
        </div>

        {/* Apparatus */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Apparatus / Requirements</h3>
          <Textarea
            value={data.apparatus}
            onChange={(e) => update("apparatus", e.target.value)}
            placeholder="List the apparatus and materials required..."
            rows={4}
          />
        </div>

        {/* Procedure */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Procedure</h3>
          <Textarea
            value={data.procedure}
            onChange={(e) => update("procedure", e.target.value)}
            placeholder="Describe the step-by-step procedure..."
            rows={6}
          />
        </div>

        {/* Diagram */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Diagram</h3>
          <DiagramUpload
            diagramPreview={data.diagramPreview}
            onFileSelect={handleDiagram}
            onRemove={() => {
              update("diagramFile", null);
              update("diagramPreview", null);
            }}
          />
        </div>

        {/* Table Builder */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Observation Table Builder</h3>
          <TableBuilder
            columns={data.columns}
            numRows={data.numRows}
            onColumnsChange={(cols) => update("columns", cols)}
            onNumRowsChange={(n) => update("numRows", n)}
          />
        </div>

        {/* Result */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Result</h3>
          <Textarea
            value={data.result}
            onChange={(e) => update("result", e.target.value)}
            placeholder="Expected result or formula for calculation..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default ExperimentPage;
