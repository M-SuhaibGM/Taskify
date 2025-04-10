import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ListContaner from "./_component/ListContaner";

interface BoardIdPageProps {
    params: {
        boardId: string;
    }
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    const { orgId } = await auth();
    if (!orgId) {
        return redirect("/select-org")
    }


    const list = (await db.list.findMany({
        where: {
            boardId: params.boardId,
            board: {
                orgId
            },

        }, include: {
            Card: {
                orderBy: {
                    order: "asc"
                }
            }
        }, orderBy: {
            order: "asc"
        }

    })).map(item => ({
        ...item,
        cards: item.Card
    }))
    return (
        <div className="p-4 h-full overflow-x-auto ">
            {list && <ListContaner boardId={params.boardId} data={list} />}
        </div>
    )
}

export default BoardIdPage