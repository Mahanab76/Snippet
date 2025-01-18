import { db } from "@/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteSnippet } from "@/actions/action";

interface SnippetShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SnippetShowPage(props: SnippetShowPageProps) {
  //   await new Promise((r) => setTimeout(r, 2000));          artificial pause to show loading
  const { id } = await props.params;
  const snippets = await db.snippet.findFirst({
    where: { id: parseInt(id) },
  });
  if (!snippets) return notFound();

  const deleteSnippetAction = deleteSnippet.bind(null, snippets.id);

  return (
    <div>
      <div className="flex m-4 justify-between items-center">
        <h1 className="text-xl font-bold">{snippets.title}</h1>
        <div className="flex gap-4">
          <Link
            href={`/snippets/${snippets.id}/edit`}
            className="border p-2 rounded"
          >
            Edit
          </Link>
          <form action={deleteSnippetAction}>
            <button className="border p-2 rounded">Delete</button>
          </form>
        </div>
      </div>
      <pre className="border rounded bg-gray-200 p-3 border-gray-200">
        <code>{snippets.code}</code>
      </pre>
    </div>
  );
}

export async function generateStaticParams() {
  const snippets = await db.snippet.findMany();
  return snippets.map((snippet) => {
    return {
      id: snippet.id.toString(),
    };
  });
}
