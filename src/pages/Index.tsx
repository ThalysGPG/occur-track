import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOccurrences } from "@/hooks/useOccurrences";
import { StatsBar } from "@/components/occurrences/StatsBar";
import { OccurrenceFilters, defaultFilters, type Filters } from "@/components/occurrences/OccurrenceFilters";
import { OccurrenceList } from "@/components/occurrences/OccurrenceList";
import { KanbanBoard } from "@/components/occurrences/KanbanBoard";
import { OccurrenceForm } from "@/components/occurrences/OccurrenceForm";
import { Button } from "@/components/ui/button";
import { Plus, LayoutList, Columns3, Shield } from "lucide-react";

type ViewMode = "list" | "kanban";

const Index = () => {
  const navigate = useNavigate();
  const { occurrences, addOccurrence } = useOccurrences();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    return occurrences.filter((occ) => {
      if (filters.status !== "all" && occ.status !== filters.status) return false;
      if (filters.severity !== "all" && occ.severity !== filters.severity) return false;
      if (filters.branch !== "all" && occ.branch !== filters.branch) return false;
      if (filters.responsible !== "all" && occ.responsible !== filters.responsible) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !occ.id.toLowerCase().includes(q) &&
          !occ.title.toLowerCase().includes(q) &&
          !occ.branch.toLowerCase().includes(q) &&
          !occ.responsible.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [occurrences, filters]);

  const handleSelect = (id: string) => {
    navigate(`/ocorrencia/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Gestão de Ocorrências</h1>
              <p className="text-xs text-muted-foreground">Controle e acompanhamento operacional</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Nova Ocorrência
          </Button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        <StatsBar occurrences={occurrences} />

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <OccurrenceFilters filters={filters} onChange={setFilters} />
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1 self-start">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="h-4 w-4" /> Lista
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "kanban" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns3 className="h-4 w-4" /> Kanban
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <OccurrenceList occurrences={filtered} onSelect={handleSelect} />
        ) : (
          <KanbanBoard occurrences={filtered} onSelect={handleSelect} />
        )}
      </main>

      <OccurrenceForm open={showForm} onClose={() => setShowForm(false)} onSubmit={addOccurrence} />
    </div>
  );
};

export default Index;
