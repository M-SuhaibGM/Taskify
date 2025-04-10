import { NextResponse } from "next/server";
import { db } from "../../../../lib/db"
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";


export async function PUT(req, { params }) {
    try {
        const { listId } = await params;
        const data = await req.json();
        const { title } = data;

        // Update the board title in the database
        const card = await db.list.update({
            where: { id: listId }, // Find board by ID
            data: { title: title }, // Update the title
        });
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.LIST,
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
        const { listId } = await params;

        const card = await db.list.delete({
            where: { id: listId }, // Find board by ID

        });


        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE,
        })
        return new NextResponse("updated")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        const { listId } = await params;
        const data = await req.json();
        const { boardId } = data
        const { orgId } = await auth()

        const ListToCopy = await db.list.findUnique({
            where: {
                id: listId,
                boardId,
                board: {
                    orgId,
                }
            }, include: {
                Card: true,
            }

        });
        if (!ListToCopy) {
            return new NextResponse("List not found", { status: 404 });
        }


        const LastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true }
        })
        const newOrder = LastList ? LastList.order + 1 : 1;
        const card = await db.list.create({
            data: {
                boardId: ListToCopy.boardId,
                title: `${ListToCopy.title} - Copy `,
                order: newOrder,
                Card: {
                    createMany: {
                        data: ListToCopy.Card.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order,
                        }))
                    }
                },
            }, include: {
                Card: true
            }
        })

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE,
        })
        return new NextResponse("updated")
    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
