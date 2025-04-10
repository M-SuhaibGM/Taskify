
import { Sidebar } from "../_component/Sidebar";


export default function Layout({ children }) {
    return (

        <div className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl  ">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0 hidden md:block">
                    <Sidebar />
                </div>
                {children}
            </div>
        </div>

    );
}
