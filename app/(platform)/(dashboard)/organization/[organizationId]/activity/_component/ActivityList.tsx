import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AuditLog } from "@prisma/client"
interface Props {
    data: AuditLog;
}
const ActivityList = ({ data }:Props) => {
    return (
        <li className="flex items-center gap-2 mt-5">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data.userImage} />
            </Avatar>
            <div className="flex flex-col space-y-0.5">
                <p className="font-semibold lowercase text-neutral-700">
                    {data.userName}
                </p>
            </div>
        </li>
    )
}

export default ActivityList