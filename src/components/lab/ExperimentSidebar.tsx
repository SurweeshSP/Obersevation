import { FlaskConical, FileText, Table, Image, ClipboardList, Target, Beaker } from "lucide-react";

const sections = [
  { id: "title", label: "Experiment Title", icon: FileText },
  { id: "aim", label: "Aim", icon: Target },
  { id: "apparatus", label: "Apparatus", icon: Beaker },
  { id: "procedure", label: "Procedure", icon: ClipboardList },
  { id: "diagram", label: "Diagram", icon: Image },
  { id: "table", label: "Observation Table", icon: Table },
  { id: "result", label: "Result", icon: FileText },
];

interface Props {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

const ExperimentSidebar = ({ activeSection, onSectionClick }: Props) => {
  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card flex flex-col">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-bold text-foreground text-lg leading-tight">Lab Builder</h1>
            <p className="text-xs text-muted-foreground">Observation Module</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSectionClick(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {s.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ExperimentSidebar;
