"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-10">
      <div className="surface-card w-full max-w-xl rounded-[1rem] px-6 py-10 text-center md:px-10">
        <p className="eyebrow">NASA API</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          This page was not found.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Go back to the NASA API page and choose another item.
        </p>
        <Link
          href="/nasa-api"
          className="button-primary mt-8 inline-flex hover:button-primary-hover"
        >
          Back to NASA API
        </Link>
      </div>
    </section>
  );
}
