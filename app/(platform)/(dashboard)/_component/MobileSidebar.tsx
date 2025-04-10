"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMobileSidebar } from "@/hooks/MobileSidebar"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"

const MobileSidebar = () => {
    const [isMounted, setisMounted] = useState(false)
    const pathname = usePathname();
    const onOpen = useMobileSidebar((state) => state.onOpen)
    const onClose = useMobileSidebar((state) => state.onClose)
    const isOpen = useMobileSidebar((state) => state.isOpen)


    useEffect(() => {
        setisMounted(true)


    }, [])

    useEffect(() => {
        onClose()

    }, [pathname, onClose])


    if (!isMounted) {
        return null
    }
    return (
        <>
            <Button className="block md:hidden  mr-2"  onClick={onOpen} variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left"  className="p-2 pt-10">
                    <Sidebar storageKey="t-sidebar-mobile-state" />
                </SheetContent>
            </Sheet>
        </>
    )
}

export default MobileSidebar