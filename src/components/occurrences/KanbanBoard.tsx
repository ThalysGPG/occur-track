import type { Occurrence } from "@/types/occurrence";
import { KANBAN_COLUMNS, STATUS_LABELS, STATUS_COLORS } from "@/types/occurrence";
import { OccurrenceCard } from "./OccurrenceCard";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  occurrences: Occurrence[];
  onSelect: (id: string) => void;
}

export function KanbanBoard({ occurrences, onSelect }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((status) => {
        const items = occurrences.filter((o) => o.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-[300px]">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={cn("h-2 w-2 rounded-full", STATUS_COLORS[status])} />
              <h3 className="text-sm font-semibold text-foreground">{STATUS_LABELS[status]}</h3>
              <span className="ml-auto text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                {items.length}
              </span>
            </div>
            <div className="space-y-3 min-h-[200px] bg-muted/50 rounded-lg p-2">
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Nenhuma ocorrência</p>
              ) : (
                items.map((occ) => (
                  <OccurrenceCard key={occ.id} occurrence={occ} onClick={() => onSelect(occ.id)} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
