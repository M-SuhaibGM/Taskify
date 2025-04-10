"use client"
import { List } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverClose, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, MoreHorizontal, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ListOptionProps {
    data: List;
}

const ListOptions = ({ data }: ListOptionProps) => {
    const [loading, setloading] = useState(false)
    const router = useRouter()


    const onDelete = async () => {

        try {
            const responce = await axios.delete(`/api/list/${data.id}`);
            if (responce.status == 200) {
                router.refresh()
                toast.success("List  deleted successfully")
            }
            // Exit editing mode after successful update
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        } finally {
            setloading(false);
        }

    }
    const onCopy = async () => {

        try {
            const responce = await axios.post(`/api/list/${data.id}`,{boardId:data.boardId});
            if (responce.status == 200) {
                router.refresh()
                toast.success("List Cloned successfully")
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
                <Button className="h-auto w-auto p-2 text-neutral-600" variant="transparent">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List Actions
                </div>
                <PopoverClose asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button disabled={loading} onClick={onCopy} variant="ghost" className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                    Clone this list . . .
                    {loading && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
                </Button>
                <Button disabled={loading} variant="ghost" onClick={onDelete} className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                    Delete this list
                    {loading && <Loader2 className="animate-spin text-black ml-2 h-4 w-4" />}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default ListOptions