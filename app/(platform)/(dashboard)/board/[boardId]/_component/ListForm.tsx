"use client"
import { Plus, X } from "lucide-react"
import ListWrapper from "./ListWrapper"
import { useState, useRef, ElementRef } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

interface ListFormProps {
    id: string;
}
const ListForm = ({ id }: ListFormProps) => {

    const [editing, setediting] = useState(false)
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [loading, setloading] = useState(false)
    const router = useRouter()

    const onClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setloading(true)
        try {
            const responce = await axios.post(`/api/boards/${id}/lists`, { title: inputRef.current?.value });;
            if (responce.status == 200) {
                router.refresh()
                toast.success("list created  successfully");
            }
            // Exit editing mode after successful update
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        } finally {
            setloading(false);
            (e.target as HTMLFormElement).reset();
            disableEditing()
        }

    }

    const enableEditing = () => {
        setediting(true)
        setTimeout(() => {
            inputRef.current?.focus();
        })
    }

    const disableEditing = () => {
        setediting(false)
    }

    const onkeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing()
        }
    }

    useEventListener("keydown", onkeyDown);
    useOnClickOutside(formRef, disableEditing);


    if (editing) {
        return (
            <ListWrapper>
                <form ref={formRef} onSubmit={onClick} className="w-full p-3 rounded-md bg-white space-y-4  shadow-md">
                    <div className="flex flex-col  g gap-2">
                        <input ref={inputRef} className="w-full bg-transparent  text-sm px-2 py-1 h-7 font-medium  transition" type="text" placeholder="Enter list title..." />
                        <div className="flex items-center gap-1">
                            <Button disabled={loading} variant="primary" type="submit" className="w-10 h-8">Add</Button>
                            <Button variant="ghost" onClick={disableEditing} className="w-10 h-8 cursor-pointer">
                                <X />
                            </Button>
                        </div>
                    </div>
                </form>
            </ListWrapper >
        )
    }
    return (
        <ListWrapper>
            <button onClick={enableEditing} className="w-full flex items font-medium mt-2  text-sm rounded-md bg-white/80 hover:bg-white/50 transition p-3 file:">
                <Plus className="mr-2 h-4 w-4" />
                Add a list
            </button>
        </ListWrapper>
    )
}

export default ListForm