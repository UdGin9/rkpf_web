import numpy as np
import matplotlib.pyplot as plt
import control

def pi_regul(F1, tau, k):

    """
    Расчёт ПИ-регулятора по методу Зиглера–Никольса с учётом запаздывания.
    
    :param F1: постоянная времени объекта (знаменатель: F1*s + 1)
    :param tau: время чистого запаздывания (сек)
    :param k: коэффициент усиления объекта
    :return: t, y — время и переходная характеристика замкнутой системы
    """

    # аппроксимация задержки Паде
    num_pade, den_pade = control.pade(tau, n=2)
    delay_tf = control.TransferFunction(num_pade, den_pade)

    # G(s) = k / (F1*s + 1)
    plant = control.TransferFunction([k], [F1, 1])

    # Полная передаточная функция разомкнутой системы
    system_with_delay = control.series(plant, delay_tf)

    # частота, при которой фаза = -180° (-π рад)
    omega = np.logspace(-3, 3, 10000)  # широкий диапазон частот
    mag, phase, _ = control.bode(system_with_delay, omega, plot=False)

    # первая частоту, где фаза <= -180°
    target_index = None
    for i in range(len(phase)):
        if phase[i] <= -np.pi:  # -180 градусов
            target_index = i
            break

    if target_index is None:
        raise ValueError("Система не достигает фазы -180° — невозможно определить Kcr.")

    wc = omega[target_index]  # критическая частота
    gain_at_wc = mag[target_index]  # |G(jwc)|
    Kcr = 1.0 / gain_at_wc  # условие |Kcr * G(jwc)| = 1
    Tcr = 2 * np.pi / wc  # период автоколебаний

    print(f"Критический коэффициент усиления Kcr = {Kcr:.3f}")
    print(f"Период автоколебаний Tcr = {Tcr:.3f} с")

    # расчет параметров ПИ-регулятора по Зиглеру–Никольсу
    Kp = 0.45 * Kcr
    Ki = 0.54 * Kcr / Tcr  # Формула для ПИ-регулятора

    print(f"Параметры ПИ-регулятора: Kp = {Kp:.3f}, Ki = {Ki:.3f}")

    # создание ПИ-регулятора: Kp + Ki/s
    Kp_tf = control.tf([Kp], [1])          # Kp
    Ki_tf = control.tf([Ki], [1, 0])       # Ki/s
    pi_controller = Kp_tf + Ki_tf

    # замкнутая система: feedback(controller * plant_with_delay, 1)
    open_loop = pi_controller * system_with_delay
    closed_loop = control.feedback(open_loop, 1)

    # переходная характеристика
    try:
        t, y = control.step_response(closed_loop, T=np.linspace(0, 50, 1000))
    except Exception as e:
        raise RuntimeError(f"Ошибка при расчёте переходного процесса: {e}")

    return t, y