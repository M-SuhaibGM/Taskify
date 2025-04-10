import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { generateLogMessage } from "@/lib/generateLogMessage";
import { AuditLog } from "@prisma/client"
import { format } from "date-fns";
interface Props {
    data: AuditLog;
}
const ActivityItem = ({ data }: Props) => {
    return (
        <li className="flex items-center border shadow-md rounded-lg p-2 gap-2 mt-5">

            <Avatar className="h-8 w-8  relative">
                <AvatarImage src={data.userImage} />
                {data.action === "UPDATE" && <div className="h-2 w-2 right-1 z-10 bottom-1 bg-green-400 absolute rounded-full" />}
            </Avatar>
         
            <div className="flex flex-col space-y-0.5">
                <p className="text-sm text-muted-foreground" >
                    <span className="font-semibold lowercase text-neutral-700" >
                        {data.userName}
                    </span> {generateLogMessage(data)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
        </li>
    )
}

export default ActivityItem