import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/blogs/[id] - Get a specific blog (public)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    // Check if the ID is a number (database ID) or a string (slug)
    const isNumeric = /^\d+$/.test(id);

    let data;
    if (isNumeric) {
      data = await prisma.blogs.findUnique({
        where: { id: Number.parseInt(id) },
      });
    } else {
      data = await prisma.blogs.findUnique({
        where: { slug: id },
      });
    }

    if (!data) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update a blog (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const params = await context.params
    const id = Number.parseInt(params.id);
    const body = await request.json();

    // Parse tags if they come as a string
    const tags =
      typeof body.tags === "string"
        ? body.tags.split(",").map((tag: string) => tag.trim())
        : body.tags;

    const updateData: any = {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      tags: tags,
      featured_image: body.featured_image,
      status: body.status,
      updated_at: new Date(),
    };

    // Add either author or author_id based on what was provided
    if (body.author_id) {
      updateData.author_id = body.author_id;
    } else if (body.author) {
      updateData.author = body.author;
    }

    const data = await prisma.blogs.update({
      where: { id },
      data: updateData,
    });

    // Revalidate the blogs page to update the cache
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${id}`);
    revalidatePath(`/blogs/${data.slug}`);
    revalidatePath("/admin/blogs");

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete a blog (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const params = await context.params
    const id = Number.parseInt(params.id);

    await prisma.blogs.delete({
      where: { id },
    });

    // Revalidate the blogs page to update the cache
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
