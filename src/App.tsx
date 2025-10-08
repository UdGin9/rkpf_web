import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useNavigationStore } from "./stores/useNavigationStore";
import { HomePage } from "./pages/Home";
import { InputDataPage } from "./pages/InputDataPage";
import { ChevronRight } from "lucide-react";
import { GraphDimensionlessPage } from "./pages/GraphDimensionlessPage";
import { TransferFunctionPage } from "./pages/TransferFunctionPage";
import { RegulPageGraph } from "./pages/RegulPageGraph";

const routes = [
  { title: "Главная", component: <HomePage /> },
  { title: "Расчет", component: <InputDataPage /> },
  { title: "Безразмерный вид", component: <GraphDimensionlessPage /> },
  { title: "Передаточная функция", component: <TransferFunctionPage /> },
  { title: "Регулятор", component: <RegulPageGraph /> },
]


export const App = () => {

  const { currentRoute } = useNavigationStore()


  const currentPage = routes.find(route => route.title === currentRoute)?.component || (
  <div className="p-6 text-lg">Страница не найдена</div>
  )


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        <div className="flex items-center space-x-2 text-gray-600 text-lg">
          {currentRoute == 'Главная' ? <a href="/" className="hover:text-blue-300 transition">Главная</a>:
          <>
          <a href="/" className="hover:text-blue-300 transition">Главная</a>
          <span className="text-gray-400">
            <ChevronRight className="w-4 h-4" />
          </span>
          <span className="text-gray-600">{currentRoute}</span>
          </>
          }
        </div>
        </header>
        {currentPage}
      </SidebarInset>
    </SidebarProvider>
  )
}
