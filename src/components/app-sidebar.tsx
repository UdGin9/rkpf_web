import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useNavigationStore } from "@/store/store"


const itemsNavigate = [
  {title: 'Главная' },
  { title: "Расчет" },
  { title: "Безразмерный вид" },
  { title: "Регулятор" },
  { title: "Результат" },
]

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {

  const { updateCurrentRoute } = useNavigationStore()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <img src='images/samgtu_logo.png'/>
      </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>

            <SidebarMenuItem className="flex flex-col gap-4 pl-4">
              {itemsNavigate.map((item)=>(
              <SidebarMenuButton className="text-lg" onClick={() => updateCurrentRoute(item.title)}>
                {item.title}
              </SidebarMenuButton>
              ))}
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
