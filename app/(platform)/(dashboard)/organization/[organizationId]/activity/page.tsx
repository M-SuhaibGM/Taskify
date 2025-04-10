import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

import Info from "../_component/Info"
import { Separator } from "@/components/ui/separator"
import ActivityItem from "./_component/ActivityItem"


const ActivityPage = async () => {
    const { userId } = await auth()
    const { orgId } = await auth()
    if (!userId || !orgId) {
        return redirect("/")
    }
    const action = await db.auditLog.findMany({
        where: {
            userId,
            orgId,
        }
    })

    if (!action) {
        return (
            <div>
                <Skeleton />
            </div>
        )
    }
    return (
        <div className="w-full h-[84vh]  p-5 overflow-y-auto  shadow-md">
            <Info />
            <Separator className="my-2 " />

            <ol className="space-y-6 mt-4">
                <p className="hidden last:block text-xs text-center text-muted-foreground">
                    No activity found in this organization
                </p>
                {action.map((action) => (
                    <ActivityItem key={action.id} data={action} />
                ))}
            </ol>
        </div>
    )
}

export default ActivityPage