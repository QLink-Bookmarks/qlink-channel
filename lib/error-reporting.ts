type ErrorReportingContext = {
  area: string;
  extra?: Record<string, unknown>;
  level?: "warning" | "error";
};

function reportError(error: unknown, context: ErrorReportingContext) {
  const payload = {
    area: context.area,
    extra: context.extra,
    error,
  };

  if (context.level === "warning") {
    console.warn("app:warning", payload);
    return;
  }

  console.error("app:error", payload);
}

export { reportError };
export type { ErrorReportingContext };
