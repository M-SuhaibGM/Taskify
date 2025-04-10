
import BoardList from "./_component/BoardList"
import Info from "./_component/Info"
import { Separator } from "@/components/ui/separator"

const OrganizationIdPage = async () => {

    return (
        <div className="w-full mb-20 ">
            <Info />
            <Separator className="my-2" />
            <div className="px-2 md:px-4">
                <BoardList  />
            </div>
        </div>
    )
}

export default OrganizationIdPage