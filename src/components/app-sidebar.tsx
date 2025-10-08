import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useNavigationStore } from "@/stores/useNavigationStore"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRegulStore } from "@/stores/useRegulStore"


const itemsNavigate = [
  { title: 'Главная' },
  { title: "Расчет" },
  { title: "Безразмерный вид" },
  { title: "Передаточная функция"},
  { title: "Регулятор"},
]

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {

  const { updateCurrentRoute } = useNavigationStore()
  const { regulator, setRegulator } = useRegulStore()


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

            <SidebarFooter className="flex flex-col gap-4 pl-4 pb-10">
              <Select value={regulator} onValueChange={(value: 'P' | 'PI' | 'PID') => setRegulator(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder='Выберите регулятор' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="P">P-регулятор</SelectItem>
                    <SelectItem value="PI">PI-регулятор</SelectItem>
                    <SelectItem value="PID">PID-регулятор</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
