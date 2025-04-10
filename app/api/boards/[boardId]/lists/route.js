import { db } from "../../../../../lib/db";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";


export async function POST(req, { params }) {
    try {
        const { boardId } = await params;
        const data = await req.json();

        const { title } = data;
        console.log(title)
        if (!title || !boardId) {
            return new NextResponse("all fields requre")
        }

        const lastlist = await db.list.findFirst({
            where: { boardId: boardId },
            orderBy: { order: "desc" },
            select: { order: true }
        })

        const newOrder = lastlist ? lastlist.order + 1 : 1;

        const card = await db.list.create({
            data: {
                title,
                boardId,
                order: newOrder,
            },
        });
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE,
        })

        return new NextResponse("list created")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}