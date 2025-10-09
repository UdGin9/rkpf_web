import numpy as np
import control 
from fastapi import HTTPException

def calculate_transfer_function(time_step_seconds, x_in, x_in_infinity, data, contur):

    """
    Рассчитывает передаточную функцию по экспериментальным данным методом статистических моментов.

    Параметры:
    - time_step_seconds: шаг времени между измерениями (в секундах)
    - x_in: входное воздействие в начале времени (при t = 0)
    - x_in_infinity: установившееся значение входного воздействия (при t → ∞)
    - data: список измеренных значений выходной величины (в хронологическом порядке)

    Возвращает:
    Кортеж из следующих значений:
    - F1: первый момент (временная константа, мин)
    - F2: второй момент (мин²)
    - F3: третий момент (мин³)
    - k: коэффициент усиления (коэффициент передачи)
    - time_array_seconds: массив времени моделирования (в секундах)
    - y: нормированная переходная характеристика (выход модели)
    - array_2: σ-массив (безразмерная величина, колонка 2 по методике)
    - array_3: 1 - σ (колонка 3)
    - array_4: θ-массив (безразмерное время)
    - array_5: 1 - θ
    - array_6: (1 - σ)(1 - θ)
    - D: среднеквадратическая ошибка

    Примечание:
    - Если разница между x_out_infinity и x_out близка к нулю — выбрасывается ошибка деления на ноль.
    - Передаточная функция формируется в зависимости от типа контура и знаков F2/F3.
    """

    try:
        # Преобразуем строки в числа
        time_step_seconds = float(time_step_seconds)
        x_in_infinity = float(x_in_infinity)
        x_in = float(x_in)
        x_out = min(data)
        x_out_infinity = max(data)

        # Переводим шаг времени в минуты
        time_step_minutes = time_step_seconds / 60.0

        measure_count = len(data)
        time_end = time_step_seconds * measure_count
        time_array_seconds = np.arange(0, time_end, time_step_seconds)
        time_array_minutes = [x / 60 for x in time_array_seconds]

        # Проверка деления на ноль
        if abs(x_out_infinity - x_out) < 1e-10:
            raise ZeroDivisionError("Разность (x_out_infinity - x_out) близка к нулю.")

        # Колонка 2: σ-массив
        array_2 = [(x - x_out) / (x_out_infinity - x_out) for x in data]
        array_2 = [round(x, 2) for x in array_2]
        array_2 = sorted(array_2)  # Сортировка по возрастанию

        # Колонка 3: 1 - σ
        array_3 = [round(1 - x, 2) for x in array_2]
        summ_array_3 = sum(array_3)

        # F1 по формуле 2.48, стр.95
        F1 = time_step_minutes * (summ_array_3 - 0.5 * (1 - 0))

        # Колонка 4: θ-массив
        array_4 = [round(x / F1,2) for x in time_array_minutes]

        # Колонка 5: 1 - θ
        array_5 = [round(1 - x, 2) for x in array_4]

        # Колонка 6: (1-σ)*(1-θ)
        array_6 = [round(array_3[i] * array_5[i], 2) for i in range(len(array_3))]
        summ_array_6 = sum(array_6)

        # Колонка 7: 1 - 2θ + θ²/2
        array_7 = [round(1 - 2*x + (x*x)/2,2) for x in array_4]

        # Колонка 8: (1-2θ+θ²/2)*(1-σ)
        array_8 = [round(array_7[i] * array_3[i],2) for i in range(len(array_3))]
        summ_array_8 = sum(array_8)

        # Шаг по θ
        theta_step = time_step_minutes / F1

        # F2 по формуле 2.49, стр.96
        F2 = F1 * F1 * theta_step * (summ_array_6 - 0.5 * (1 - 0))

        # F3 по формуле 2.50, стр.96
        F3 = F1 * F1 * F1 * theta_step * (summ_array_8 - 0.5 * (1 - 0))

        # Коэффициент усиления k
        k = abs((x_out_infinity - x_out) / (x_in_infinity - x_in))
        k = round(k, 2)

        # Округление
        F1 = round(F1, 2)
        F2 = round(F2, 2)
        F3 = round(F3, 2)

        numerator = [k]

        if contur in ["Промежуточная емкость", "Емкость хранения"]:
            # Интегрирующее звено: k / (T1*s)
            T1_seconds = F1 * 60  
            denominator = [T1_seconds, 0]

        elif contur == "Температура":
            # Апериодическое 2-го порядка: k / (T2*s² + T1*s + 1)
            T1_seconds = F1 * 60
            T2_seconds = F2 * 3600

            # Если F2 слишком мал или отрицателен, стабилизируем
            if T2_seconds <= 0:
                T2_seconds = T1_seconds * 0.1
            denominator = [T2_seconds, T1_seconds, 1]

        else:
            # Все остальные: апериодическое 1-го порядка: k / (T1*s + 1)
            T1_seconds = F1 * 60
            denominator = [T1_seconds, 1]

        sys = control.TransferFunction(numerator, denominator)
        print(sys)

        time_array_seconds, y = control.step_response(sys, T=time_array_seconds)
        y = [x / k for x in y]

        y = np.array(y)
        array_2_new = np.array(array_2)

        # Вычисление разностей
        differences = y - array_2_new
        # Вычисление суммы квадратов разностей
        sum_of_squares = np.sum(differences ** 2)
        # Вычисление среднеквадратической ошибки (MSE)
        mse = sum_of_squares / len(y)
        # Вычисление среднеквадратического отклонения (RMSE)
        rmse = np.sqrt(mse)

        D = round(rmse * 100,2)

        return F1, F2, F3, k,  time_array_seconds, y, array_2, array_3, array_4, array_5, array_6, D

    except ZeroDivisionError:
        raise HTTPException(
            status_code=400,
            detail="Ошибка расчёта: Входное воздействие = Выходное воздействие при t = ∞ => деление на ноль. Проверьте входные данные."
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Некорректные данные: {str(e)}"
        )

    except Exception as e:
        print(f"Неизвестная ошибка: {e}")
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера при выполнении расчёта."
        )