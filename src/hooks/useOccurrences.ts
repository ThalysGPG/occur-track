import { useState, useCallback } from "react";
import type { Occurrence, OccurrenceStatus, HistoryEntry } from "@/types/occurrence";

const STORAGE_KEY = "occurrences_data";

function generateId(): string {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `OC-${num}`;
}

function loadOccurrences(): Occurrence[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getSampleData();
  } catch {
    return getSampleData();
  }
}

function saveOccurrences(data: Occurrence[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getSampleData(): Occurrence[] {
  const now = new Date().toISOString();
  const items: Occurrence[] = [
    {
      id: "OC-10001",
      title: "Vazamento de óleo no setor de produção",
      description: "Identificado vazamento de óleo hidráulico na prensa #3 do setor de produção. Área isolada e equipe de manutenção acionada.",
      type: "incidente",
      severity: "alta",
      status: "em_andamento",
      branch: "Matriz - São Paulo",
      location: "Setor de Produção - Prensa #3",
      responsible: "Carlos Silva",
      deadline: "2026-04-05",
      date: "2026-03-28",
      time: "14:30",
      actionsTaken: "Área isolada, absorvente aplicado, manutenção acionada",
      observations: "Possível falha na vedação da mangueira hidráulica",
      attachments: [],
      history: [
        { id: "h1", timestamp: "2026-03-28T14:35:00Z", operator: "Ana Souza", newStatus: "nova", comment: "Ocorrência registrada" },
        { id: "h2", timestamp: "2026-03-28T15:00:00Z", operator: "Carlos Silva", previousStatus: "nova", newStatus: "em_andamento", comment: "Iniciada investigação e reparo" },
      ],
      createdAt: "2026-03-28T14:35:00Z",
      updatedAt: "2026-03-28T15:00:00Z",
      lastOperator: "Carlos Silva",
    },
    {
      id: "OC-10002",
      title: "Queda de material em área de carga",
      description: "Caixa de peças caiu da prateleira superior durante movimentação com empilhadeira.",
      type: "quase_acidente",
      severity: "critica",
      status: "triagem",
      branch: "Filial - Rio de Janeiro",
      location: "Almoxarifado - Corredor B",
      responsible: "Pedro Lima",
      deadline: "2026-04-03",
      date: "2026-03-30",
      time: "09:15",
      actionsTaken: "Área interditada, revisão de empilhamento solicitada",
      observations: "Nenhum colaborador ferido",
      attachments: [],
      history: [
        { id: "h3", timestamp: "2026-03-30T09:20:00Z", operator: "Maria Santos", newStatus: "nova", comment: "Ocorrência registrada" },
        { id: "h4", timestamp: "2026-03-30T10:00:00Z", operator: "Pedro Lima", previousStatus: "nova", newStatus: "triagem", comment: "Enviado para análise de segurança" },
      ],
      createdAt: "2026-03-30T09:20:00Z",
      updatedAt: "2026-03-30T10:00:00Z",
      lastOperator: "Pedro Lima",
    },
    {
      id: "OC-10003",
      title: "Falta de EPI no setor de pintura",
      description: "Colaborador encontrado sem máscara de proteção no setor de pintura.",
      type: "desvio",
      severity: "media",
      status: "nova",
      branch: "Filial - Belo Horizonte",
      location: "Setor de Pintura",
      responsible: "Ana Souza",
      deadline: "2026-04-07",
      date: "2026-03-31",
      time: "11:00",
      actionsTaken: "Advertência verbal e reposição de EPI",
      observations: "",
      attachments: [],
      history: [
        { id: "h5", timestamp: "2026-03-31T11:05:00Z", operator: "João Costa", newStatus: "nova", comment: "Ocorrência registrada" },
      ],
      createdAt: "2026-03-31T11:05:00Z",
      updatedAt: "2026-03-31T11:05:00Z",
      lastOperator: "João Costa",
    },
    {
      id: "OC-10004",
      title: "Extintor vencido no corredor principal",
      description: "Extintor de incêndio com validade expirada identificado durante inspeção de rotina.",
      type: "desvio",
      severity: "baixa",
      status: "concluida",
      branch: "Matriz - São Paulo",
      location: "Corredor Principal - Bloco A",
      responsible: "Maria Santos",
      deadline: "2026-03-25",
      date: "2026-03-20",
      time: "16:45",
      actionsTaken: "Extintor substituído por novo dentro da validade",
      observations: "",
      attachments: [],
      history: [
        { id: "h6", timestamp: "2026-03-20T16:50:00Z", operator: "Maria Santos", newStatus: "nova", comment: "Ocorrência registrada" },
        { id: "h7", timestamp: "2026-03-21T08:00:00Z", operator: "Maria Santos", previousStatus: "nova", newStatus: "em_andamento", comment: "Solicitada reposição" },
        { id: "h8", timestamp: "2026-03-22T14:00:00Z", operator: "Maria Santos", previousStatus: "em_andamento", newStatus: "concluida", comment: "Extintor substituído com sucesso" },
      ],
      solution: "Extintor substituído por modelo ABC 6kg dentro da validade. Programada inspeção mensal.",
      createdAt: "2026-03-20T16:50:00Z",
      updatedAt: "2026-03-22T14:00:00Z",
      lastOperator: "Maria Santos",
    },
    {
      id: "OC-10005",
      title: "Piso escorregadio na entrada da fábrica",
      description: "Piso molhado sem sinalização na entrada principal após chuva forte.",
      type: "incidente",
      severity: "alta",
      status: "aguardando_validacao",
      branch: "Filial - Curitiba",
      location: "Entrada principal",
      responsible: "João Costa",
      deadline: "2026-04-02",
      date: "2026-03-29",
      time: "07:30",
      actionsTaken: "Cones de sinalização posicionados, tapete antiderrapante instalado",
      observations: "Necessário instalar cobertura permanente",
      attachments: [],
      history: [
        { id: "h9", timestamp: "2026-03-29T07:35:00Z", operator: "João Costa", newStatus: "nova", comment: "Ocorrência registrada" },
        { id: "h10", timestamp: "2026-03-29T08:00:00Z", operator: "João Costa", previousStatus: "nova", newStatus: "em_andamento", comment: "Sinalização instalada" },
        { id: "h11", timestamp: "2026-03-30T16:00:00Z", operator: "João Costa", previousStatus: "em_andamento", newStatus: "aguardando_validacao", comment: "Medidas provisórias aplicadas, aguardando aprovação para cobertura" },
      ],
      createdAt: "2026-03-29T07:35:00Z",
      updatedAt: "2026-03-30T16:00:00Z",
      lastOperator: "João Costa",
    },
  ];
  saveOccurrences(items);
  return items;
}

export function useOccurrences() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(loadOccurrences);

  const persist = useCallback((updated: Occurrence[]) => {
    setOccurrences(updated);
    saveOccurrences(updated);
  }, []);

  const addOccurrence = useCallback((data: Omit<Occurrence, "id" | "history" | "createdAt" | "updatedAt" | "lastOperator">) => {
    const now = new Date().toISOString();
    const newOcc: Occurrence = {
      ...data,
      id: generateId(),
      history: [{
        id: crypto.randomUUID(),
        timestamp: now,
        operator: data.responsible,
        newStatus: "nova",
        comment: "Ocorrência registrada",
      }],
      createdAt: now,
      updatedAt: now,
      lastOperator: data.responsible,
    };
    persist([newOcc, ...occurrences]);
    return newOcc;
  }, [occurrences, persist]);

  const updateStatus = useCallback((id: string, entry: Omit<HistoryEntry, "id" | "timestamp">, solution?: string, cancellationReason?: string) => {
    const now = new Date().toISOString();
    const updated = occurrences.map((occ) => {
      if (occ.id !== id) return occ;
      const historyEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: now,
      };
      return {
        ...occ,
        status: entry.newStatus || occ.status,
        history: [...occ.history, historyEntry],
        updatedAt: now,
        lastOperator: entry.operator,
        ...(solution ? { solution } : {}),
        ...(cancellationReason ? { cancellationReason } : {}),
      };
    });
    persist(updated);
  }, [occurrences, persist]);

  return { occurrences, addOccurrence, updateStatus };
}
