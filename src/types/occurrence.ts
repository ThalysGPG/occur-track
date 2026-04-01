export type OccurrenceStatus =
  | "nova"
  | "triagem"
  | "em_andamento"
  | "bloqueada"
  | "aguardando_validacao"
  | "concluida"
  | "cancelada";

export type Severity = "baixa" | "media" | "alta" | "critica";

export type OccurrenceType =
  | "acidente"
  | "incidente"
  | "quase_acidente"
  | "desvio"
  | "outro";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  operator: string;
  previousStatus?: OccurrenceStatus;
  newStatus?: OccurrenceStatus;
  comment: string;
  attachments?: Attachment[];
}

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  type: OccurrenceType;
  severity: Severity;
  status: OccurrenceStatus;
  branch: string;
  location: string;
  responsible: string;
  deadline: string;
  date: string;
  time: string;
  actionsTaken: string;
  observations: string;
  attachments: Attachment[];
  history: HistoryEntry[];
  solution?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  lastOperator: string;
}

export const STATUS_LABELS: Record<OccurrenceStatus, string> = {
  nova: "Nova",
  triagem: "Triagem",
  em_andamento: "Em Andamento",
  bloqueada: "Bloqueada",
  aguardando_validacao: "Aguardando Validação",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export const STATUS_COLORS: Record<OccurrenceStatus, string> = {
  nova: "bg-status-nova",
  triagem: "bg-status-triagem",
  em_andamento: "bg-status-andamento",
  bloqueada: "bg-status-bloqueada",
  aguardando_validacao: "bg-status-validacao",
  concluida: "bg-status-concluida",
  cancelada: "bg-status-cancelada",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  critica: "Crítica",
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  baixa: "bg-severity-baixa",
  media: "bg-severity-media",
  alta: "bg-severity-alta",
  critica: "bg-severity-critica",
};

export const TYPE_LABELS: Record<OccurrenceType, string> = {
  acidente: "Acidente",
  incidente: "Incidente",
  quase_acidente: "Quase Acidente",
  desvio: "Desvio",
  outro: "Outro",
};

export const KANBAN_COLUMNS: OccurrenceStatus[] = [
  "nova",
  "triagem",
  "em_andamento",
  "bloqueada",
  "aguardando_validacao",
  "concluida",
];

export const BRANCHES = [
  "Matriz - São Paulo",
  "Filial - Rio de Janeiro",
  "Filial - Belo Horizonte",
  "Filial - Curitiba",
  "Filial - Porto Alegre",
];

export const OPERATORS = [
  "Carlos Silva",
  "Ana Souza",
  "Pedro Lima",
  "Maria Santos",
  "João Costa",
];
