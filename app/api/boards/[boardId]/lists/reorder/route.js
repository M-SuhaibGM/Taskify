import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const { boardId } = await params;
        const { lists } = await req.json();

        // Update the order of all lists
        await Promise.all(
            lists.map(async (list) => {
                await db.list.update({
                    where: { id: list.id },
                    data: { order: list.order },
                });
            })
        );

        return NextResponse.json({ message: "Lists reordered successfully" });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}