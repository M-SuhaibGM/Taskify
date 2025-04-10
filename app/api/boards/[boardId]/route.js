import { NextResponse } from "next/server";
import { db } from "@/lib/db"
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { decreaseAvailableBoards } from "../../../../lib/org-limit";
export async function PUT(req, { params }) {
    try {
        const { boardId } = await params;
        const data = await req.json();
        const { title } = data;

        // Update the board title in the database
        const card = await db.board.update({
            where: { id: boardId }, // Find board by ID
            data: { title: title }, // Update the title
        });
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE,
        })

        return new NextResponse("updated")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
export async function DELETE(req, { params }) {
    try {
        const { boardId } = await params;

        const card = await db.board.delete({
            where: { id: boardId }, // Find board by ID

        });

        await decreaseAvailableBoards()
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
        })

        return new NextResponse("deleted")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}