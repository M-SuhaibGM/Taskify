"use client"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useLocalStorage } from "usehooks-ts"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion } from "@/components/ui/accordion"
import NavItem from "./NavItem"
import { Organization } from "./NavItem"


interface SidebarProps {
  storageKey?: string
}
export const Sidebar = ({
  storageKey = "t-sidebar-state",
}: SidebarProps) => {
  const [expanded, setexpanded] = useLocalStorage<Record<string, any>>(storageKey,
    {}
  );
  const { organization: activeOrganization,
    isLoaded: isLoadedOrg
  } = useOrganization();

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })


  const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key: string) => {
    if (expanded[key]) {
      acc.push(key);
    } return acc
  }, []);



  const onExpand = (id: string) => {
    setexpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }))
  }


  if (!isLoadedOrgList || !isLoadedOrg || userMemberships.isLoading) {
    return (
      <>
        <div className="flex  items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="P-2 w-full">
          <Skeleton className="h-[100px] w-full" />
        </div>
        <div className="P-2 w-full mt-4">
          <Skeleton className="h-[50px] w-full" />
        </div>
        <div className="P-2 w-full mt-4">
          <Skeleton className="h-[50px] w-full" />
        </div>
        <div className="P-2 w-full mt-4">
          <Skeleton className="h-[50px] w-full" />
        </div>

      </>
    )
  }     
  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1" >

        <span className="pl-4">
          Workspaces
        </span>
        <Button asChild type="button" size="icon" variant="ghost" className="ml-auto" >

          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion type="multiple" defaultValue={defaultAccordionValue} className="space-y-2">
        {userMemberships.data?.map((org) => (
          <NavItem key={org.organization.id}
            isActive={activeOrganization?.id === org.organization.id}
            isExpanded={expanded[org.organization.id]}
            organization={org.organization as Organization}
            onExpand={onExpand}
          />

        ))}
      </Accordion>
    </>
  )
}
