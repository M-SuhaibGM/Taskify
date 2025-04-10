"use client"
import { useOrganization } from "@clerk/nextjs"
import { Badge, CreditCard, Medal } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ProModal } from "@/hooks/PRO-MODEL";
import { useState } from "react";
const Info = () => {

    const { organization, isLoaded } = useOrganization();
    const [card, setcard] = useState(false)

    if (!isLoaded) {
        return (
            <div className="flex items-center gap-x-4">
                <div className=" relative">
                    <Skeleton className="rounded-md w-[60px] h-[60px] " />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="  h-8 w-20 " />
                    <Skeleton className=" h-5 w-8 " />
                </div>
            </div>
        )
    }
    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Image fill src={organization?.imageUrl!} alt="logo" className="rounded-md object-cover" />
            </div>
            <div>
                <p className="font-semibold text-xl">
                    {organization?.name}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Free <button className=" ml-2 p-1 flex items-center gap-2 cursor-pointer rounded-md bg-amber-300 font-bold  hover:bg-amber-400 text-black" onClick={() => setcard(true)}>Pro <Medal className="h-3 w-3" />
                    </button>
                </div>
                <ProModal open={card} close={() => setcard(false)} />
            </div>

        </div>
    )
}

export default Info