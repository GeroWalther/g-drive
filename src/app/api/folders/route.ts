import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MUTATIONS } from "~/server/db/queries";

interface CreateFolderRequest {
  name: string;
  parentId: string | null;
}

export async function POST(request: Request) {
  const user = await auth();
  if (!user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = (await request.json()) as Partial<CreateFolderRequest>;
    const { name, parentId } = data;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 },
      );
    }

    // Create folder in database
    const folder = await MUTATIONS.createFolder(
      name.trim(),
      typeof parentId === "string" ? parentId : null,
    );

    if (!folder) {
      return NextResponse.json(
        { error: "Failed to create folder" },
        { status: 500 },
      );
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the folder" },
      { status: 500 },
    );
  }
}
