"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="surface-card flex w-full max-w-md flex-col items-center rounded-[1rem] px-6 py-10 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
        <p className="mt-5 text-sm font-medium text-slate-700">
          Loading NASA data…
        </p>
      </div>
    </div>
  );
}
