import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_LABELS, OPERATORS } from "@/types/occurrence";
import type { OccurrenceStatus, HistoryEntry } from "@/types/occurrence";

interface Props {
  open: boolean;
  onClose: () => void;
  currentStatus: OccurrenceStatus;
  onSubmit: (entry: Omit<HistoryEntry, "id" | "timestamp">, solution?: string, cancellationReason?: string) => void;
}

const ALLOWED_TRANSITIONS: Record<OccurrenceStatus, OccurrenceStatus[]> = {
  nova: ["triagem", "em_andamento", "cancelada"],
  triagem: ["em_andamento", "bloqueada", "cancelada"],
  em_andamento: ["bloqueada", "aguardando_validacao", "concluida", "cancelada"],
  bloqueada: ["em_andamento", "cancelada"],
  aguardando_validacao: ["em_andamento", "concluida", "cancelada"],
  concluida: [],
  cancelada: [],
};

export function UpdateDialog({ open, onClose, currentStatus, onSubmit }: Props) {
  const [newStatus, setNewStatus] = useState<OccurrenceStatus | "">("");
  const [comment, setComment] = useState("");
  const [operator, setOperator] = useState("");
  const [solution, setSolution] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const transitions = ALLOWED_TRANSITIONS[currentStatus];
  const needsSolution = newStatus === "concluida";
  const needsCancellation = newStatus === "cancelada";

  const canSubmit = newStatus && comment.trim() && operator &&
    (!needsSolution || solution.trim()) &&
    (!needsCancellation || cancellationReason.trim());

  const handleSubmit = () => {
    if (!newStatus || !canSubmit) return;
    onSubmit(
      {
        operator,
        previousStatus: currentStatus,
        newStatus,
        comment,
      },
      needsSolution ? solution : undefined,
      needsCancellation ? cancellationReason : undefined,
    );
    setNewStatus("");
    setComment("");
    setOperator("");
    setSolution("");
    setCancellationReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Adicionar Atualização</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Operador</label>
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger><SelectValue placeholder="Selecione o operador" /></SelectTrigger>
              <SelectContent>
                {OPERATORS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Novo Status</label>
            {transitions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Esta ocorrência não pode mais ser atualizada.</p>
            ) : (
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OccurrenceStatus)}>
                <SelectTrigger><SelectValue placeholder="Selecione o novo status" /></SelectTrigger>
                <SelectContent>
                  {transitions.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Comentário</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva a atualização realizada..."
              rows={3}
            />
          </div>

          {needsSolution && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Solução Aplicada *</label>
              <Textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Descreva a solução aplicada para conclusão..."
                rows={3}
              />
            </div>
          )}

          {needsCancellation && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Motivo do Cancelamento *</label>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Descreva o motivo do cancelamento..."
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>Salvar Atualização</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
