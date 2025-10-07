import numpy as np
import control 
from fastapi import HTTPException

def calculate_transfer_function(time_step_seconds, x_in, x_in_infinity, data, contur_level):

    """
    Рассчитывает передаточную функцию по экспериментальным данным методом статистических моментов.

    Параметры:
    - time_step_seconds: шаг времени между измерениями (в секундах)
    - x_in: входное воздействие в начале времени (при t = 0)
    - x_in_infinity: установившееся значение входного воздействия (при t → ∞)
    - data: список измеренных значений выходной величины (в хронологическом порядке)
      Поддерживаемые значения:
        - "Промежуточная емкость"
        - "Емкость хранения"
        -  любое другое значение — считается обычным динамическим контуром

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

        # Формирование числителя и знаменателя передаточной функции
        numerator = [k]

        if contur_level in ["Промежуточная емкость", "Емкость хранения"]:
            denominator = [F1, 0]  # Безынерционное звено
        else:
            if F2 < 0:
                # Апериодическое звено 1-го порядка
                denominator = [F1, 1]
            elif F3 < 0:
                # Апериодическое звено 2-го порядка
                denominator = [F2 * 3600, F1 * 60, 1]  # Перевод в секунды
            else:
                # Апериодическое звено 3-го порядка
                denominator = [F3 * 216000, F2 * 3600, F1 * 60, 1]  # s³, s², s, const

        # Создание передаточной функции
        sys = control.TransferFunction(numerator, denominator)

        # Моделирование переходной характеристики
        time_array_seconds, y = control.step_response(sys, T=time_array_seconds)
        y = [x / k for x in y]  # Нормировка на k

        return F1, F2, F3, k,  time_array_seconds, y, array_2, array_3, array_4, array_5, array_6

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
        # Логируем полную ошибку на сервере
        print(f"Неизвестная ошибка: {e}")
        # Но пользователю — обезличенное сообщение
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера при выполнении расчёта."
        )