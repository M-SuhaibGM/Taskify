"use client"
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "./ui/popover";
import { X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import FormPicker from "./FormPicker";
import { useRouter } from "next/navigation";
import { ProModal } from "@/hooks/PRO-MODEL";

interface Poops {
    children: React.ReactNode;
    align: "start" | "center" | "end";
    side?: "left" | "right" | "top" | "bottom";
    sideOffset?: number;
}

const FormPopover = ({
    children,
    side,
    align,
    sideOffset,
}: Poops) => {
    const [loading, setLoading] = useState(false);
    const [card, setcard] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Record<string, any> | null>(null);
    const closeref = useRef<ElementRef<"button">>(null);
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target as HTMLFormElement;
        const title = (form.elements.namedItem("title") as HTMLInputElement).value;

        if (!selectedImage) {
            toast.error("Please select an image");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("/api/CreateBoard", {
                title,
                imageId: selectedImage.id,
                imageThumbUrl: selectedImage.urls.thumb,
                imageFulUrl: selectedImage.urls.full,
                imageUserName: selectedImage.user.name,
                imageLinkHtml: selectedImage.links.html,
            });

            if (response.status == 200) {
                toast.success("Board Created Successfully");
                closeref.current?.click();
                router.push(`/board/${response.data.id}`)
            }
            else {
                toast.error(`${response.data}`);
                setcard(true)

            }

        } catch (e) {
            toast.error("Something went wrong");
            console.error(e);
        } finally {
            setLoading(false);
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <Popover   >
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent side={side} className="w-80 pt-3" align={align} sideOffset={sideOffset}>
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create Board
                </div>

                <PopoverClose ref={closeref} asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <ProModal open={card} close={() => setcard(false)} />
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <FormPicker onSelectImage={setSelectedImage} />
                        <input
                            minLength={3}
                            required
                            id="title"
                            placeholder="Enter a Board Title"
                            type="text"
                            className="border text-neutral-700 w-full p-1 rounded-md"
                        />
                        <Button disabled={loading} type="submit" className="w-full cursor-pointer">
                            Create
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default FormPopover;