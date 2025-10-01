
export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">

        <div className="p-8 space-y-7 text-slate-700 leading-relaxed">

          <p className="text-lg font-medium text-slate-800">
            Разработанная программа предназначена для автоматизированного расчёта коэффициентов модели динамического объекта на основе экспериментально полученной кривой разгона. Этот процесс включает в себя несколько ключевых этапов.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Ввод и предварительная обработка данных</h2>
            <p>
              Программа позволяет вводить экспериментальные данные — зависимость выходного параметра объекта от времени. После загрузки данных выполняется предварительная фильтрация и сглаживание с целью устранения случайных шумов и выбросов. Это обеспечивает высокую точность последующих вычислений.
            </p>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-5 rounded-r-lg shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-800 mb-3">Идентификация параметров модели</h2>
            <p>
              На основном этапе анализа применяются методы численного анализа —{' '}
              <strong>метод площадей</strong> и <strong>метод наименьших квадратов</strong>. В результате формируется передаточная функция, описывающая динамику системы.
            </p>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-5 rounded-r-lg shadow-sm">
            <h2 className="text-xl font-semibold text-emerald-800 mb-3">Графическая визуализация результатов</h2>
            <p>
              Полученные уравнения преобразуются в графическую форму. Программа строит наглядные графики, где одновременно отображаются:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li><span className="font-medium">экспериментальная кривая разгона</span></li>
              <li><span className="font-medium">теоретическая модельная кривая</span></li>
            </ul>
            <p className="mt-3">
              Такое визуальное сравнение позволяет быстро оценить качество аппроксимации и выявить возможные отклонения.
            </p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg shadow-sm">
            <h2 className="text-xl font-semibold text-amber-800 mb-3">Числовые характеристики модели</h2>
            <p>
              Помимо графиков, программа выводит числовые значения ключевых параметров модели:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li><strong>коэффициент усиления (K)</strong></li>
              <li><strong>постоянные времени (T₁, T₂ и др.)</strong></li>
              <li><strong>время запаздывания (τ)</strong></li>
              <li>и другие параметры, необходимые для полной динамической характеристики объекта.</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-5 rounded-r-lg shadow-sm">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">Настройка ПИ-регулятора</h2>
            <p>
              На основе полученной передаточной функции программа автоматически подбирает оптимальные коэффициенты{' '}
              <strong>пропорционально-интегрального (ПИ) регулятора</strong>. Процесс включает анализ:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>устойчивости системы</li>
              <li>времени переходного процесса</li>
              <li>величины перерегулирования</li>
            </ul>
            <p className="mt-3">
              С помощью методов численной оптимизации определяются такие значения коэффициентов:
            </p>
            <div className="flex justify-center my-4">
              <div className="bg-white px-6 py-3 rounded-lg shadow-md border border-slate-200">
                <span className="font-mono text-lg"><strong>Kp</strong> = пропорциональный коэффициент</span><br />
                <span className="font-mono text-lg"><strong>Kи</strong> = интегральный коэффициент</span>
              </div>
            </div>
            <p>
              Эти параметры обеспечивают стабильную работу системы, минимизируют установившуюся ошибку и улучшают реакцию на внешние воздействия.
            </p>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-400 p-5 rounded-r-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Преимущества программы</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Экономия времени</strong> — автоматизация заменяет трудоёмкие ручные расчёты.</li>
              <li><strong>Высокая точность</strong> — снижается вероятность человеческих ошибок.</li>
              <li><strong>Надёжность</strong> — особенно важно при решении сложных инженерных задач.</li>
              <li><strong>Удобство</strong> — инженеры могут сосредоточиться на проектировании и настройке систем, а не на рутинных вычислениях.</li>
            </ul>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-slate-200">
            <p className="text-slate-600 italic">
              Таким образом, программа значительно упрощает идентификацию динамических объектов и настройку регуляторов, делая процесс анализа быстрым, точным и удобным.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};