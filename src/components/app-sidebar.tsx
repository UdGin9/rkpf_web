import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

import { useNavigationStore } from '@/stores/useNavigationStore';
import { useConturStore } from '@/stores/useConturStore';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const itemsNavigate = [
  { title: 'Главная' },
  { title: 'Расчет' },
  { title: 'Безразмерный вид' },
  { title: 'Передаточная функция' },
  { title: 'Регулятор' },
];

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { updateCurrentRoute } = useNavigationStore();
  const {
    conturType,
    levelSubtype,
    setConturType,
    setLevelSubtype,
  } = useConturStore();

  const isLevelSelected = conturType === 'Уровень';

  return (
    <Sidebar {...props}>

      <SidebarHeader className="p-4">
        <img src="images/samgtu_logo.png" alt="Логотип"/>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col gap-4 pl-4 pt-2">
            {itemsNavigate.map((item) => (
              <SidebarMenuButton
                key={item.title}
                className="text-lg"
                onClick={() => updateCurrentRoute(item.title)}
              >
                {item.title}
              </SidebarMenuButton>
            ))}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-4 pl-4 pb-6">

        <div>
          <Select value={conturType || undefined} onValueChange={(value) => setConturType(value as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите контур" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Давление">Давление</SelectItem>
                <SelectItem value="Расход">Расход</SelectItem>
                <SelectItem value="Уровень">Уровень</SelectItem>
                <SelectItem value="Качественные показатели">Качественные показатели</SelectItem>
                <SelectItem value="Температура">Температура</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {isLevelSelected && (
          <div className="animate-in slide-in-from-bottom-2 duration-200">
            <Select
              value={levelSubtype || undefined}
              onValueChange={(value) => setLevelSubtype(value as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите объект" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Промежуточная емкость">Промежуточная ёмкость</SelectItem>
                  <SelectItem value="Емкость хранения">Ёмкость хранения</SelectItem>
                  <SelectItem value="Сепаратор">Сепаратор</SelectItem>
                  <SelectItem value="Испаритель">Испаритель</SelectItem>
                  <SelectItem value="Конденсатор">Конденсатор</SelectItem>
                  <SelectItem value="Колонна">Колонна</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};