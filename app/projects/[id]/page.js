import Link from "next/link";
import { notFound } from "next/navigation";
import api from "@/lib/api";

// export const runtime = "edge";

async function getProject(id) {
  try {
    const res = await api.get(`/projects/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function ProjectDetail({ params }) {
  const { id } = await params;
  const project = await getProject(id);
  const createdAt = project.created?.human || project.created_at;

  return (
    <section className="section-stack py-6">
      <div className="space-y-3">
        <p className="eyebrow">Projects</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Project details
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Review the selected project record.
        </p>
      </div>

      <div>
        <Link
          href="/projects"
          className="button-secondary hover:border-slate-400 hover:bg-white"
        >
          &larr; Back to projects
        </Link>
      </div>

      <article className="surface-card rounded-[1rem] p-6 md:p-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            {project.name}
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            {project.description || "No description"}
          </p>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Project ID
            </dt>
            <dd className="mt-2 font-mono text-sm text-slate-950">
              {project.id}
            </dd>
          </div>

          {createdAt && (
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Created
              </dt>
              <dd className="mt-2 text-sm text-slate-950">{createdAt}</dd>
            </div>
          )}
        </dl>
      </article>
    </section>
  );
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) {
    return [];
  }
  try {
    const res = await api.get("/projects");
    const projects = res.data.data || res.data || [];
    return projects
      .filter((project) => project?.id)
      .map((project) => ({ id: project.id.toString() }));
  } catch (error) {
    console.warn("Unable to pre-generate project pages:", error.message);
    return [];
  }
}
