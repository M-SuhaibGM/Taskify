import { auth } from "@clerk/nextjs/server";
import OrganizationControl from "./_component/org_control";
import { startCase } from "lodash";


export async function generateMetadata() {
    const { orgSlug } = await auth();

    return{
        title: startCase(orgSlug||"organization"),
    }
}

export default function OrganizationIdLayout({ children }) {
    return (

        <>
            <OrganizationControl />
            {children}
        </>


    );
}
