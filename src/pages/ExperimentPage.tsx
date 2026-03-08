import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { ExperimentData } from "@/types/experiment";
import ContentBuilder from "@/components/lab/ContentBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/services/api";

const initialData: ExperimentData = {
  title: "",
  content: [],
};

const ExperimentPage = () => {
  const [data, setData] = useState<ExperimentData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [experimentId, setExperimentId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id && id !== "new") {
      loadExperiment(id);
    }
  }, [id]);

  const loadExperiment = async (expId: string) => {
    setIsLoading(true);
    try {
      const experiment = await api.getExperiment(expId);
      setData({
        title: experiment.title,
        content: experiment.content,
      });
      setExperimentId(expId);
      toast.success("Experiment loaded");
    } catch (error) {
      console.error("Error loading experiment:", error);
      toast.error("Failed to load experiment");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data.title.trim()) {
      toast.error("Please enter an experiment title");
      return;
    }

    setIsSaving(true);
    try {
      const userEmail = localStorage.getItem("userEmail") || undefined;
      const saveId = experimentId || Date.now().toString();
      
      await api.saveExperiment({
        id: saveId,
        ...data,
        userEmail,
      });
      
      if (!experimentId) {
        setExperimentId(saveId);
      }
      
      toast.success("Experiment saved successfully!");
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.error("Error saving experiment:", error);
      toast.error("Failed to save experiment. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
          <h2 className="text-xl font-bold text-foreground">
            {experimentId ? "Edit Experiment" : "Create New Experiment"}
          </h2>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={isSaving || isLoading}>
          <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Experiment"}
        </Button>
      </div>

      {isLoading ? (
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading experiment...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
          {/* Title */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Experiment Title</h3>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="e.g., Heat Transfer Experiment"
              className="text-lg"
            />
          </div>

          {/* Content Builder */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Experiment Content</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add and arrange text sections, tables, and images in any order. Drag items to reorder.
            </p>
            <ContentBuilder
              content={data.content}
              onChange={(content) => setData({ ...data, content })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentPage;
