import SnippetEditForm from "@/components/snippet-edit-form";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface SnippetEditProps {
  params: Promise<{ id: string }>;
}
export default async function SnippetEdit(props: SnippetEditProps) {
  const { id } = await props.params;
  const snippets = await db.snippet.findFirst({
    where: { id: parseInt(id) },
  });
  if (!snippets) return notFound();

  return (
    <div className="flex flex-col m-4 gap-4">
      <SnippetEditForm snippet={snippets} />
    </div>
  );
}
