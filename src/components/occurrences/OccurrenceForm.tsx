import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRANCHES, OPERATORS, TYPE_LABELS, SEVERITY_LABELS } from "@/types/occurrence";
import type { Occurrence, OccurrenceType, Severity } from "@/types/occurrence";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Occurrence, "id" | "history" | "createdAt" | "updatedAt" | "lastOperator">) => void;
}

export function OccurrenceForm({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<OccurrenceType | "">("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("");
  const [responsible, setResponsible] = useState("");
  const [deadline, setDeadline] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [actionsTaken, setActionsTaken] = useState("");
  const [observations, setObservations] = useState("");

  const canSubmit = title.trim() && description.trim() && type && severity && branch && responsible && deadline;

  const handleSubmit = () => {
    if (!canSubmit || !type || !severity) return;
    onSubmit({
      title,
      description,
      type,
      severity,
      status: "nova",
      branch,
      location,
      responsible,
      deadline,
      date,
      time,
      actionsTaken,
      observations,
      attachments: [],
    });
    // Reset
    setTitle(""); setDescription(""); setType(""); setSeverity("");
    setBranch(""); setLocation(""); setResponsible("");
    setDeadline(""); setActionsTaken(""); setObservations("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ocorrência</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Título *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resumo da ocorrência" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tipo *</label>
              <Select value={type} onValueChange={(v) => setType(v as OccurrenceType)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Gravidade *</label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as Severity)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SEVERITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Filial *</label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Local</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local específico" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Responsável *</label>
              <Select value={responsible} onValueChange={setResponsible}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Prazo *</label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Data</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Hora</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Descrição *</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição detalhada da ocorrência" rows={3} />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Ações Tomadas</label>
            <Textarea value={actionsTaken} onChange={(e) => setActionsTaken(e.target.value)} placeholder="Ações imediatas realizadas" rows={2} />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Observações</label>
            <Textarea value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Observações adicionais" rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>Cadastrar Ocorrência</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
