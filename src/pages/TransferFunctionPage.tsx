import { useTransferFunction } from "@/stores/useTransferFunction"
import { renderToString } from 'katex';

export const TransferFunctionPage = () => {

    const { getF } = useTransferFunction()
    const { F1, F2, F3, k, D } = getF()

    let formula = ''

    if (F1 && F2 && F3 && k && D) {
        formula = `W_0(s) = \\frac{${k}}{${F1}s + 1}`;
    }

    return (
        <div className="p-10 flex flex-col gap-10 text-center">
            <div className="text-3xl font-bold text-center">Результаты расчета</div>
                {F1 && F2 && F3 && k ? <>
                    <div className="text-2xl font-bold text-center">Полученная передаточная функция</div>
                        <div
                        className="text-xl"
                        dangerouslySetInnerHTML={{
                        __html: renderToString(formula, { throwOnError: false, displayMode: true }),
                        }}
                        />
                    <div className="text-2xl font-bold text-center">Коэффициенты передаточной функции</div>
                    
                    <div className="text-xl">T<sub>1</sub> = {F1}</div>
                    <div className="text-xl">T<sub>2</sub> = {F2}</div>
                    <div className="text-xl">T<sub>3</sub> = {F3}</div>
                        
                    <div className="text-2xl font-bold text-center">Коэффициент усиления</div>
                    <div className="text-xl">K = {k}</div>
                    <div className="text-2xl font-bold text-center">Ошибка ввода</div>
                    <div className="text-xl">D = {D} %</div>
                </>
                : <></>}
        </div>
    )
}