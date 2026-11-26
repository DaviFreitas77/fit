export function MealListSkeleton() {
  return (
    <div
      className="mt-3 grid gap-2"
      role="status"
      aria-label="Carregando refeições"
      aria-busy="true"
    >
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          aria-hidden="true"
          className="flex min-h-[76px] animate-pulse items-center gap-3 rounded-2xl border border-line bg-paper p-3"
        >
          <div className="size-11 shrink-0 rounded-xl bg-line" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/5 rounded bg-line" />
            <div className="h-2.5 w-3/5 rounded bg-line" />
          </div>
          <div className="h-3 w-14 rounded bg-line" />
        </div>
      ))}
      <span className="sr-only">Carregando refeições</span>
    </div>
  );
}
