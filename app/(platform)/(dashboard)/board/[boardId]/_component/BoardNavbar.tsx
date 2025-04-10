import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BoardTitleForm from "./BoardTitleForm";
import BoardOptions from "./BoardOptions";

interface BoardNavbarProps {
    id: string;
}

const BoardNavbar = async ({ id }: BoardNavbarProps) => {
    const { orgId } = await auth();
    if (!orgId) {
        return redirect("/select-org")
    }
    const board = await db.board.findUnique({
        where: {
            id,
            orgId: orgId as string,
        },

    })

    return (
        <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex  items-center px-6 gap-x-4 text-white">
            {board && <BoardTitleForm data={board} />}
            <div className="ml-auto">
                {board && <BoardOptions orgId={orgId} id={board?.id} />}
            </div>
        </div>
    )
}

export default BoardNavbar