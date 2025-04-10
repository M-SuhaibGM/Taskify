import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_component/BoardNavbar";

export async function generateMetadata({
    params
}: {
    params: { boardId: string }
}) {
    const { orgId } = await auth();
    if (!orgId) {
        return {
            title: "Board"
        }
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId: orgId as string,
        },


    })

    return {
        title: board?.title || "Board",
    }
}

const Layout = async ({ children, params }
    : {
        children: React.ReactNode;
        params: { boardId: string; };
    }
) => {
    const { orgId } = await auth();
    if (!orgId) {
        return redirect("/select-org")
    }
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId: orgId as string,
        },

    })

    if (!board) {
        notFound()
    }
    return (

        <div style={{ backgroundImage: `url(${board.imageFulUrl})` }} className="bg-cover bg-center relative h-full bg-no-repeat " >
            <BoardNavbar id={params.boardId} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="pt-28 relative h-full">
                {children}
            </main>
        </div>


    );
}

export default Layout
