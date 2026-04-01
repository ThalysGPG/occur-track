import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOccurrences } from "@/hooks/useOccurrences";
import { StatusBadge, SeverityBadge } from "@/components/occurrences/StatusBadge";
import { OccurrenceTimeline } from "@/components/occurrences/OccurrenceTimeline";
import { UpdateDialog } from "@/components/occurrences/UpdateDialog";
import { TYPE_LABELS } from "@/types/occurrence";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, PenLine, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const OccurrenceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { occurrences, updateStatus } = useOccurrences();
  const [showUpdate, setShowUpdate] = useState(false);

  const occurrence = occurrences.find((o) => o.id === id);

  if (!occurrence) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">Ocorrência não encontrada</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        </div>
      </div>
    );
  }

  const isOverdue = occurrence.deadline && new Date(occurrence.deadline) < new Date() && !["concluida", "cancelada"].includes(occurrence.status);
  const isClosed = ["concluida", "cancelada"].includes(occurrence.status);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-[1000px] mx-auto px-6 py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ArrowLeft className="h-4 w-4" /> Voltar para listagem
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-muted-foreground">{occurrence.id}</span>
                <StatusBadge status={occurrence.status} size="md" />
                <SeverityBadge severity={occurrence.severity} size="md" />
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 rounded-full px-2 py-0.5">
                    <Clock className="h-3 w-3" /> Atrasada
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-foreground">{occurrence.title}</h1>
            </div>
            {!isClosed && (
              <Button onClick={() => setShowUpdate(true)}>
                <PenLine className="h-4 w-4 mr-1" /> Adicionar Atualização
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-6 space-y-6">
        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" /> Informações
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Tipo</span>
              <span className="text-foreground font-medium">{TYPE_LABELS[occurrence.type]}</span>
              <span className="text-muted-foreground">Data/Hora</span>
              <span className="text-foreground">{occurrence.date} às {occurrence.time}</span>
              <span className="text-muted-foreground">Prazo</span>
              <span className={`font-medium ${isOverdue ? "text-destructive" : "text-foreground"}`}>
                {format(new Date(occurrence.deadline), "dd/MM/yyyy", { locale: ptBR })}
              </span>
              <span className="text-muted-foreground">Última atualização</span>
              <span className="text-foreground text-xs">
                {format(new Date(occurrence.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Localização e Responsável
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Filial</span>
              <span className="text-foreground font-medium">{occurrence.branch}</span>
              <span className="text-muted-foreground">Local</span>
              <span className="text-foreground">{occurrence.location || "—"}</span>
              <span className="text-muted-foreground">Responsável</span>
              <span className="text-foreground font-medium flex items-center gap-1">
                <User className="h-3 w-3" /> {occurrence.responsible}
              </span>
              <span className="text-muted-foreground">Último operador</span>
              <span className="text-foreground">{occurrence.lastOperator}</span>
            </div>
          </Card>
        </div>

        {/* Description */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-2">Descrição</h2>
          <p className="text-sm text-foreground leading-relaxed">{occurrence.description}</p>
          {occurrence.actionsTaken && (
            <>
              <Separator className="my-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Ações Tomadas</h3>
              <p className="text-sm text-muted-foreground">{occurrence.actionsTaken}</p>
            </>
          )}
          {occurrence.observations && (
            <>
              <Separator className="my-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Observações</h3>
              <p className="text-sm text-muted-foreground">{occurrence.observations}</p>
            </>
          )}
        </Card>

        {/* Solution / Cancellation */}
        {occurrence.solution && (
          <Card className="p-4 border-status-concluida/30">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-status-concluida" /> Solução Aplicada
            </h2>
            <p className="text-sm text-foreground">{occurrence.solution}</p>
          </Card>
        )}

        {occurrence.cancellationReason && (
          <Card className="p-4 border-destructive/30">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-destructive" /> Motivo do Cancelamento
            </h2>
            <p className="text-sm text-foreground">{occurrence.cancellationReason}</p>
          </Card>
        )}

        {/* Timeline */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" /> Histórico de Movimentações
          </h2>
          <OccurrenceTimeline history={occurrence.history} />
        </Card>
      </main>

      <UpdateDialog
        open={showUpdate}
        onClose={() => setShowUpdate(false)}
        currentStatus={occurrence.status}
        onSubmit={(entry, solution, cancellationReason) => updateStatus(occurrence.id, entry, solution, cancellationReason)}
      />
    </div>
  );
};

export default OccurrenceDetail;
