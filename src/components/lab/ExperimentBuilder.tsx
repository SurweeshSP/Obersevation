import { useRef, useState } from "react";
import { Save } from "lucide-react";
import { ExperimentData, TableColumn } from "@/types/experiment";
import ExperimentSidebar from "./ExperimentSidebar";
import DiagramUpload from "./DiagramUpload";
import TableBuilder from "./TableBuilder";
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

const ExperimentBuilder = () => {
  const [data, setData] = useState<ExperimentData>(initialData);
  const [activeSection, setActiveSection] = useState("title");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollTo = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div ref={(el) => { sectionRefs.current[id] = el; }} id={id} className="scroll-mt-6">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <ExperimentSidebar activeSection={activeSection} onSectionClick={scrollTo} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {data.title || "New Experiment"}
            </h2>
            <p className="text-sm text-muted-foreground">Create and configure your lab observation sheet</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save Experiment
          </Button>
        </div>

        <div className="max-w-4xl mx-auto p-8 space-y-6">
          <Section id="title" title="Experiment Title">
            <Input
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g., Heat Transfer Experiment"
              className="text-lg"
            />
          </Section>

          <Section id="aim" title="Aim">
            <Textarea
              value={data.aim}
              onChange={(e) => update("aim", e.target.value)}
              placeholder="Describe the aim of this experiment..."
              rows={3}
            />
          </Section>

          <Section id="apparatus" title="Apparatus / Requirements">
            <Textarea
              value={data.apparatus}
              onChange={(e) => update("apparatus", e.target.value)}
              placeholder="List the apparatus and materials required..."
              rows={4}
            />
          </Section>

          <Section id="procedure" title="Procedure">
            <Textarea
              value={data.procedure}
              onChange={(e) => update("procedure", e.target.value)}
              placeholder="Describe the step-by-step procedure..."
              rows={6}
            />
          </Section>

          <Section id="diagram" title="Diagram">
            <DiagramUpload
              diagramPreview={data.diagramPreview}
              onFileSelect={handleDiagram}
              onRemove={() => {
                update("diagramFile", null);
                update("diagramPreview", null);
              }}
            />
          </Section>

          <Section id="table" title="Observation Table Builder">
            <TableBuilder
              columns={data.columns}
              numRows={data.numRows}
              onColumnsChange={(cols) => update("columns", cols)}
              onNumRowsChange={(n) => update("numRows", n)}
            />
          </Section>

          <Section id="result" title="Result">
            <Textarea
              value={data.result}
              onChange={(e) => update("result", e.target.value)}
              placeholder="Expected result or formula for calculation..."
              rows={4}
            />
          </Section>
        </div>
      </main>
    </div>
  );
};

export default ExperimentBuilder;
