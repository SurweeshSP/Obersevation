import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [experiments] = useState<{ id: string; title: string; date: string }[]>([]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col">
        <div className="p-5 border-b border-border">
          <h1 className="font-bold text-foreground text-lg">Lab Builder</h1>
          <p className="text-xs text-muted-foreground">surweesh</p>
        </div>
        <nav className="flex-1 p-3">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-accent text-accent-foreground">
            <FileText className="h-4 w-4" />
            Experiments
          </button>
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Experiments</h2>
            <p className="text-muted-foreground mt-1">Create and manage lab observation sheets</p>
          </div>
          <Button onClick={() => navigate("/experiment/new")} className="gap-2">
            <Plus className="h-4 w-4" /> Create Experiment
          </Button>
        </div>

        {/* Content Area */}
        <div className="bg-card rounded-2xl border border-border min-h-[500px] flex items-center justify-center">
          {experiments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-64 h-48 mx-auto mb-6 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop"
                  alt="Laboratory"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No experiments yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first lab observation sheet to get started
              </p>
              <Button onClick={() => navigate("/experiment/new")} className="gap-2">
                Create Your First Experiment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 w-full">
              {experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl border border-border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/experiment/${exp.id}`)}
                >
                  <h4 className="font-semibold text-foreground">{exp.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{exp.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
