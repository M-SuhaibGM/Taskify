"use client"
import { List } from "@prisma/client"
import { useState, useRef, ElementRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import ListOptions from "./ListOptions";


interface ListHeaderProps {
    data: List;
}
const ListHeader = ({ data }: ListHeaderProps) => {
    const [title, settitle] = useState(data.title)
    const [isEditing, setisEditing] = useState(false);
    const [loading, setloading] = useState(false)
    const inputRef = useRef<ElementRef<"input">>(null);
    const formRef = useRef<ElementRef<"form">>(null);
    const router = useRouter()
    const enableEditing = () => {
        setisEditing(true)
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disableEditing = () => {
        setisEditing(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setloading(true);
        try {
            // Send a PUT request to update the board title
            const responce = await axios.put(`/api/list/${data.id}`, { title });
            if (responce.status == 200) {
                setisEditing(false);
                router.refresh()
                toast.success("List title updated successfully");
            }
            // Exit editing mode after successful update
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        } finally {
            setloading(false);
        }
    };
    const onkeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit()
        }
    }

    useEventListener("keydown", onkeyDown);
    useOnClickOutside(formRef, disableEditing);
    return (
        
            <div className="flex items-start justify-between px-2 text-sm font-semibold placeholder:gap-x-2 pt-2">
                {isEditing ?
                    (<form ref={formRef} onSubmit={handleSubmit} className="flex-1 px-[2px]">
                        <input
                            ref={inputRef}
                            minLength={3}
                            required
                            id="title"
                            placeholder="Enter a Board Title"
                            type="text"
                            value={title}
                            onChange={(e) => settitle(e.target.value)}
                            className="border  w-full p-1 bg-transparent rounded-md"
                            disabled={loading}
                        />
                    </form>
                    ) :
                    (<div onClick={enableEditing} className="w-full text-sm  px-2.5 py-1 h-7 font-medium border-transparent">
                        {title}
                    </div>)}

                <div>
                    <ListOptions data={data} />
                </div>
            </div>

         
    
    )
}

export default ListHeader