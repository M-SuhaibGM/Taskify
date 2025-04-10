import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "../../../../../lib/db"
import { NextResponse } from "next/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";



export async function POST(req, { params }) {
    try {
        const { listId } = await params;
        const data = await req.json();

        const { title } = data;

        if (!title || !listId) {
            return new NextResponse("all fields requre")
        }

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { order: "desc" },
            select: { order: true }
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        const card = await db.card.create({
            data: {
                title,
                listId,
                order: newOrder,
            },
        });
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        })

        return new NextResponse("Card created")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { listId } = await params;
        const data = await req.json();
        const { description } = data;

        if (!description || !listId) {
            return new NextResponse("all fields requre")
        }

        const card = await db.card.update({
            where: { id: listId },
            data: { description }
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE,
        })
        return new NextResponse("Card created")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
} export async function DELETE(req, { params }) {
    try {
        const { listId } = await params;

        const card = await db.card.delete({
            where: { id: listId },

        });


        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE,
        })
        return new NextResponse("Card DELETED")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}