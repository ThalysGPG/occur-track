import { cn } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS, SEVERITY_LABELS, SEVERITY_COLORS } from "@/types/occurrence";
import type { OccurrenceStatus, Severity } from "@/types/occurrence";

export function StatusBadge({ status, size = "sm" }: { status: OccurrenceStatus; size?: "sm" | "md" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium text-primary-foreground",
      STATUS_COLORS[status],
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function SeverityBadge({ severity, size = "sm" }: { severity: Severity; size?: "sm" | "md" }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium text-primary-foreground",
      SEVERITY_COLORS[severity],
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
