import { notFound } from "next/navigation";
import api from "@/lib/api";
// ...your other imports (Link, useRouter, form components, etc.)

// ✅ ADD THIS LINE
export const dynamic = 'force-dynamic';

async function getChecklistItem(id) {
  if (!id || id === 'undefined' || id === 'null') notFound();
  try {
    const res = await api.get(`/checklist-items/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) notFound();
    throw error;
  }
}

async function getTask(id) {
  if (!id || id === 'undefined') return null;
  try {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data || res.data;
  } catch (error) { return null; }
}

export default async function ChecklistEditPage({ params }) {
  const { id } = await params;
  if (!id || id === 'undefined' || id === 'null') notFound();

  const item = await getChecklistItem(id);
  const taskId = typeof item.task_id === 'object' ? item.task_id?.id : item.task_id;
  const task = taskId ? await getTask(taskId) : null;

  // ...your existing JSX form
}

// ✅ REMOVE generateStaticParams entirely if present