"use client"
import { unsplash } from "@/lib/Unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { defaultImage } from "@/constent/Images";
import Link from "next/link";

interface FormPickerProps {
    onSelectImage: (image: Record<string, any>) => void;
}

const FormPicker = ({ onSelectImage }: FormPickerProps) => {
    const [image, setimage] = useState<Array<Record<string, any>>>(defaultImage);
    const [isloading, setisloading] = useState(false);
    const [SelectedImage, setSelectedImage] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            setisloading(true);
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9,
                });

                if (result && result.response) {
                    const images = (result.response as Array<Record<string, any>>);
                    setimage(images);
                } else {
                    console.error("Failed to get images from unspash");
                }
            } catch (e) {
                console.log(e);
                setimage(defaultImage);
            } finally {
                setisloading(false);
            }
        };
        fetchImage();
    }, []);

    const handleImageClick = (image: Record<string, any>) => {
        setSelectedImage(image);
        onSelectImage(image); // Pass the selected image data to the parent component
    };

    if (isloading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {image.map((image) => (
                    <div
                        className={cn("cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted")}
                        key={image.id}
                        onClick={() => handleImageClick(image)}
                    >
                        <Image fill alt="unsplash-image" src={image.urls.thumb} className="object-cover rounded-sm" />
                        {SelectedImage?.id === image.id && (
                            <div className="absolute inset-y-0 flex items-center justify-center h-full w-full bg-black/10">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                        )}
                        <Link
                            href={image.links.html}
                            target="_blank"
                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/10"
                        >
                            {image.user.name}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormPicker;