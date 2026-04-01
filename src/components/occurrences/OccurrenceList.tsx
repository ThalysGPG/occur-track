import type { Occurrence } from "@/types/occurrence";
import { TYPE_LABELS } from "@/types/occurrence";
import { StatusBadge, SeverityBadge } from "./StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, User } from "lucide-react";

interface Props {
  occurrences: Occurrence[];
  onSelect: (id: string) => void;
}

export function OccurrenceList({ occurrences, onSelect }: Props) {
  if (occurrences.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Nenhuma ocorrência encontrada</p>
        <p className="text-sm mt-1">Tente ajustar os filtros ou cadastrar uma nova ocorrência</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Filial</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Gravidade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Abertura</TableHead>
            <TableHead>Atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {occurrences.map((occ) => {
            const isOverdue = occ.deadline && new Date(occ.deadline) < new Date() && !["concluida", "cancelada"].includes(occ.status);
            return (
              <TableRow
                key={occ.id}
                onClick={() => onSelect(occ.id)}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{occ.id}</TableCell>
                <TableCell className="font-medium max-w-[250px] truncate">{occ.title}</TableCell>
                <TableCell className="text-sm">{occ.branch}</TableCell>
                <TableCell className="text-sm">{TYPE_LABELS[occ.type]}</TableCell>
                <TableCell><SeverityBadge severity={occ.severity} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={occ.status} />
                    {isOverdue && <Clock className="h-3.5 w-3.5 text-destructive" />}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{occ.responsible}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(occ.createdAt), "dd/MM/yy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(occ.updatedAt), "dd/MM/yy HH:mm", { locale: ptBR })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
