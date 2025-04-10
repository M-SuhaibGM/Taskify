"use client"
import { Plus, X } from "lucide-react"
import { useState, useRef, ElementRef } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

interface ListFormProps {
    id: string;
}
const CardForm = ({ id }: ListFormProps) => {

    const [editing, setediting] = useState(false)
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [loading, setloading] = useState(false)
    const router = useRouter()

    const onClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setloading(true)
        try {
            const form = e.target as HTMLFormElement;
            const title = (form.elements[0] as HTMLInputElement).value;
            const responce = await axios.post(`/api/list/${id}/card`, { title });;
            if (responce.status == 200) {
                router.refresh()
                toast.success("Card created  successfully");
            }
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
            <div>
                <form ref={formRef} onSubmit={onClick} className="w-full p-1 rounded-md bg-[#f1f2f4]  space-y-4  ">
                    <div className="flex flex-col  g gap-2">
                        <Textarea className="w-full bg-white/50 resize-none focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm text-sm  border-none py-1 h-7 font-medium  transition" placeholder="Enter Card title..." />
                        <div className="flex items-center gap-1">
                            <Button disabled={loading} variant="primary" type="submit" className="w-10 h-8">Add</Button>
                            <Button variant="ghost" onClick={disableEditing} className="w-10 h-8 cursor-pointer">
                                <X />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    return (
        <div>
            <button onClick={enableEditing} className="w-full flex items font-medium  text-sm rounded-mdbg-[#f1f2f4] hover:bg-white/50 transition p-3 file:">
                <Plus className="mr-2 h-4 w-4" />
                Add Card
            </button>
        </div>
    )
}

export default CardForm