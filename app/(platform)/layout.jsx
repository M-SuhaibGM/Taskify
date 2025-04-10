import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <Toaster />
            {children}
        </ClerkProvider>

    );
}
