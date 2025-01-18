"use server";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id: id },
    data: { code },
  });
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id: id },
  });
  revalidatePath("/");
  redirect("/");
}

export async function createSnippet(
  formState: { massage: string },
  formData: FormData
) {
  //this needs to be a server action
  // "use server"; no need cause we got it at top
  //check the users input and make sure they are valid
  try {
    const title = formData.get("title");
    const code = formData.get("code");
    if (typeof title !== "string" || title.length < 10)
      return { massage: "title must be longer" };
    if (typeof code !== "string" || code.length < 10)
      return { massage: "code must be longer" };
    // create a new record in the database
    await db.snippet.create({
      data: {
        title: title,
        code: code,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { massage: err.message };
    } else return { massage: "SomeThing Went Wrong" };
  }
  //using this so it updates data and not gone after refresh page
  revalidatePath("/");
  //redirect the user back to root route
  redirect("/");
}
