import Hint from "@/components/hint"
import { HelpCircle, User2 } from "lucide-react"
import FormPopover from "@/components/FormPopover"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MAX_FREE_BOARDS } from "@/constent/Boards"
import { getAvailableCount } from "@/lib/org-limit"


const BoardList = async () => {
    const { orgId } = await auth()
    if (!orgId) {
        return redirect("/select-org")
    }
    const boards = await db.board.findMany({ where: { orgId, }, orderBy: { createdAt: "desc" } })

    const vailableCount = await getAvailableCount();

    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="h-6 w-6 mr-2" />
                Your boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 gap-4 ">
                {boards?.map((board) => (
                    <Link key={board.id} href={`/board/${board.id}`} className=" aspect-video relative h-full w-full bg-muted rounded-sm bg-no-repeat group bg-center bg-sky-700 bg-cover hover:opacity-75 transition " style={{ backgroundImage: `url(${board.imageThumbUrl})` }}>
                        <div className="absolute insert-0 group-hover:bg-black/10 transition " />
                        <p className="relative font-semibold text-white left-2 ">
                            {board.title}
                        </p>
                    </Link>
                ))}
                <FormPopover sideOffset={10} side="right" align="start"   >
                    <div role="button" className=" aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition ">
                        <p className="text-sm">Create new board</p>
                        <span>
                            {`${MAX_FREE_BOARDS - vailableCount} remaing`}
                        </span>
                        <Hint
                            sideOffset={40}
                            description={"Free Workspaces can have up to 5 open boards .for unlimited boards upgardes upgrade this workspace."}
                            side="bottom"
                        >

                            <HelpCircle className=" absolute bottom-2 right-2 h-[14px] w-[14px]" />
                        </Hint>
                    </div>
                    
                </FormPopover>
            </div>

        </div>
    )
}

export default BoardList