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
import { useNavigationStore } from "@/store/navigationStore"


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
      <SidebarHeader>
        <img src='images/samgtu_logo.png'/>
      </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>

            <SidebarMenuItem>
              {itemsNavigate.map((item)=>(
              <SidebarMenuButton onClick={() => updateCurrentRoute(item.title)}>
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
