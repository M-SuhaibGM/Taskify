import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Navbar = () => {
    return (
        <div className="fixed top-0 w-full h-14 px-4 border-b
         shadow-sm bg-white flex items-center ">
            <div className="flex justify-between items-center w-full md:max-w-screen-2xl mx-auto">
                <Logo />
                <div className="space-x-4  md:block md:w-auto  flex items-center justify-between w-full ">
                    <Button  size={"sm"} variant={"outline"} asChild>
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/sign-up">
                            Get Started Free
                        </Link>
                    </Button> 
                </div>
            </div>
        </div>
    )
}

export default Navbar