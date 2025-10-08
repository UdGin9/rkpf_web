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
    num_pade, den_pade = control.pade(tau, n=3)
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

    for kp_factor in [0.5, 0.55, 0.6, 0.65]:
        for ti_factor in [0.6, 0.65, 0.7, 0.75]:
            Kp = kp_factor * Kcr
            Ti = ti_factor * Tcr
            Ki = Kp / Ti

            pi_controller = control.tf([Kp], [1]) + control.tf([Ki], [1, 0])
            closed_loop = control.feedback(pi_controller * system_with_delay, 1)
            t, y = control.step_response(closed_loop, T=np.linspace(0, 50, 1000))

            overshoot = (np.max(y) - 1.0) * 100
            if 10 <= overshoot <= 20:
                print(f"Найдены хорошие настройки: Kp={Kp:.3f}, Ki={Ki:.3f}, перерегулирование={overshoot:.1f}%")
                break

    try:
        t, y = control.step_response(closed_loop, T=np.linspace(0, 50, 1000))
    except Exception as e:
        raise RuntimeError(f"Ошибка при расчёте переходного процесса: {e}")

    return t, y