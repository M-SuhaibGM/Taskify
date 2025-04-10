"use client"
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverClose, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, MoreHorizontal, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { auth } from "@clerk/nextjs/server";

interface BoardOptionsProps {
    id: string;
    orgId: string;
}
const BoardOptions = ({ id, orgId }: BoardOptionsProps) => {
    const [loading, setloading] = useState(false)
    const router = useRouter()

    const onDelete = async () => {

        try {
            const responce = await axios.delete(`/api/boards/${id}`);
            if (responce.status == 200) {
                router.refresh()
                toast.success("Board  deleted successfully");
                router.push(`/organization/${orgId}`)
            }
            // Exit editing mode after successful update
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        } finally {
            setloading(false);
        }

    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Board Actions
                </div>
                <PopoverClose asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button disabled={loading} variant="ghost" onClick={onDelete} className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                    Delete this board
                    {loading && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default BoardOptions