import Navbar from "./_component/Navbar";


export default function Layout({ children }) {
    return (

        <div className="h-full">
            <Navbar />
            {children}
        </div>


    );
}
