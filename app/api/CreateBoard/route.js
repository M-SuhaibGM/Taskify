import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { auth } from "@clerk/nextjs/server";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableBoards, hasAvailableCount } from "../../../lib/org-limit";

export async function POST(req) {
    try {
        // Parse the request body

        const { userId, orgId } = await auth()


        const canCreate = await hasAvailableCount()
        if (!canCreate) {
            return new NextResponse("You have reached your limit of free boards. Please upgrade your plan to create more boards.", { status: 201 })
        }

        const data = await req.json();
        const { title, imageId, imageThumbUrl, imageFulUrl, imageUserName, imageLinkHtml } = data;

        // Validate required fields
        if (!title || !imageId || !imageThumbUrl || !imageFulUrl || !imageUserName || !imageLinkHtml || !orgId) {
            return new NextResponse("All fields are required", { status: 400 });
        }

        // Create the board in the database
        const card = await db.board.create({
            data: {
                title,
                imageId,
                imageThumbUrl,
                imageFulUrl,
                imageUserName,
                imageLinkHtml,
                orgId,
            },
        });
        await incrementAvailableBoards()
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
        })
        // Return the created board as a JSON response
        return NextResponse.json(card);

    } catch (e) {
        // Handle errors
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}