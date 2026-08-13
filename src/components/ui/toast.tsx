"use client";

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
  IconXboxX,
} from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (input: Omit<Toast, "id" | "tone"> & { tone?: ToastTone }) => void;
  dismiss: (id: number) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const TONE_CONFIG: Record<
  ToastTone,
  { icon: React.ReactNode; className: string }
> = {
  success: { icon: <IconCircleCheck />, className: "text-success" },
  error: { icon: <IconXboxX />, className: "text-danger" },
  warning: { icon: <IconAlertTriangle />, className: "text-warning" },
  info: { icon: <IconInfoCircle />, className: "text-info" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const counter = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback<ToastContextValue["toast"]>(
    ({ tone = "success", ...rest }) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current.slice(-3), { id, tone, ...rest }]);
      window.setTimeout(() => dismiss(id), 5_000);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-3 bottom-3 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end"
      >
        {toasts.map((item) => {
          const config = TONE_CONFIG[item.tone];
          return (
            <div
              key={item.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-surface-2 p-3.5 shadow-lg animate-toast-in"
            >
              <span className={cn("mt-0.5 shrink-0 [&_svg]:size-5", config.className)}>
                {config.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">
                    {item.description}
                  </p>
                ) : null}
                {item.action ? (
                  <button
                    type="button"
                    onClick={() => {
                      item.action?.onClick();
                      dismiss(item.id);
                    }}
                    className="mt-2 text-xs font-semibold text-accent hover:underline"
                  >
                    {item.action.label}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(item.id)}
                className="-m-1 shrink-0 rounded p-1 text-fg-subtle transition-colors hover:text-fg"
              >
                <IconX className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}
