import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_LABELS, SEVERITY_LABELS, BRANCHES, OPERATORS } from "@/types/occurrence";
import type { OccurrenceStatus, Severity } from "@/types/occurrence";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Filters {
  search: string;
  status: OccurrenceStatus | "all";
  severity: Severity | "all";
  branch: string;
  responsible: string;
}

const defaultFilters: Filters = {
  search: "",
  status: "all",
  severity: "all",
  branch: "all",
  responsible: "all",
};

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function OccurrenceFilters({ filters, onChange }: Props) {
  const hasFilters = filters.search || filters.status !== "all" || filters.severity !== "all" || filters.branch !== "all" || filters.responsible !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, título, filial..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v as OccurrenceStatus | "all" })}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.severity} onValueChange={(v) => onChange({ ...filters, severity: v as Severity | "all" })}>
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Gravidade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {Object.entries(SEVERITY_LABELS).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.branch} onValueChange={(v) => onChange({ ...filters, branch: v })}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filial" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as filiais</SelectItem>
          {BRANCHES.map((b) => (
            <SelectItem key={b} value={b}>{b}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.responsible} onValueChange={(v) => onChange({ ...filters, responsible: v })}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Responsável" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {OPERATORS.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)}>
          <X className="h-4 w-4 mr-1" /> Limpar
        </Button>
      )}
    </div>
  );
}

export { defaultFilters };
