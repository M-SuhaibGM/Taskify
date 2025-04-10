"use client"
import { Board } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface BoardTitleFormProps {
    data: Board;
}

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(data.title);
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send a PUT request to update the board title
            const responce = await axios.put(`/api/boards/${data.id}`, { title });
            if (responce.status == 200) {
                setIsEditing(false);
                router.refresh()
                toast.success("Board title updated successfully");
            }
            // Exit editing mode after successful update
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="flex items-center gap-x-2">

                <input
                    minLength={3}
                    required
                    id="title"
                    placeholder="Enter a Board Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border text-white w-full p-1 bg-transparent rounded-md"
                />
                <Button disabled={loading} type="submit" className=" cursor-pointer">
                    {loading ? "Updating..." : "Update"}
                </Button>

            </form>
        );
    }

    return (
        <Button
            variant="transparent"
            onClick={() => setIsEditing(true)}
            className="font-bold text-lg h-auto w-auto p-1 px-2"
        >
            {data.title}
        </Button>
    );
};

export default BoardTitleForm;