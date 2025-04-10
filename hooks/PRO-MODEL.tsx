"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Props {
    open: boolean;
    close: () => void
}

export const ProModal = ({ open, close }: Props) => {
    return (
        <Dialog open={open} onOpenChange={close}>

            <DialogContent className=" p-0 overflow-hidden ">
                <div className=" relative  flex items-center justify-center">
                    <Image src="/hero.svg" alt="logo" width={300} height={300} />
                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6 ">
                    <h2 className="font-semibold text-xl">
                        Upgrade to Taskify Pro  Today!
                    </h2>
                    <p className="text-sx font-semibold text-neutral-600">
                        Explore the best of Taskify
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>Unlimited boards</li>
                            <li>Advance checklist</li>
                            <li>Unlimited boards</li>
                            <li>Admin and security feature</li>
                            <li>And more!</li>
                        </ul>
                    </div>
                    <Button className="w-full" variant="primary" > Upgrade</Button>
                </div>
            </DialogContent>

        </Dialog>
    )
}