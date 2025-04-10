import { db } from "../../../../../../lib/db";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export async function PUT(req, { params }) {
    try {
        const { boardId } = await params;
        const { listId, cards } = await req.json();

        // Update the order of all cards in the list
        await Promise.all(
            cards.map(async (card) => {
                await db.card.update({
                    where: { id: card.id },
                    data: { order: card.order },
                });
            })
        );

        // await createAuditLog({
        //     entityId: card.id,
        //     entityTitle: card.title,
        //     entityType: ENTITY_TYPE.CARD,
        //     action: ACTION.UPDATE,
        // })
        return NextResponse.json({ message: "Cards reordered successfully" });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function POST(req, { params }) {
    try {
        const { newListId, newOrder } = await req.json();
        const { listId } = await params


        // Update the card's listId and order
        const card = await db.card.update({
            where: { id: listId },
            data: {
                listId: newListId,
                order: newOrder,
            },
        });
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE,
        })
        return NextResponse.json({ message: "Card moved successfully" });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}