import Footer from './_compoment/Footer';
import Navbar from './_compoment/Navbar';
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className=" h-full bg-slate-100">
            <Navbar />
            <main className=" pt-20 pb-10 bg-slate-100">
                {children}
            </main>
            <Footer />
        </div>
    );
}
