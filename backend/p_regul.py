import control
import numpy as np

def p_regul(F1, tau, k, data):
    """
    Расчёт П-регулятора по методу Зиглера–Никольса.
    
    :param F1: постоянная времени объекта
    :param tau: время запаздывания
    :param k: коэффициент усиления объекта
    :param data: массив данных для масштабирования
    :return: t, y, Kp
    """
    # Аппроксимация задержки
    num_pade, den_pade = control.pade(tau, n=3)
    delay_tf = control.TransferFunction(num_pade, den_pade)
    plant = control.TransferFunction([k], [F1, 0])
    system_with_delay = control.series(plant, delay_tf)

    # Поиск Kcr и Tcr
    omega = np.logspace(-3, 3, 10000)
    mag, phase, _ = control.bode(system_with_delay, omega, plot=False)

    target_index = None
    for i in range(len(phase)):
        if phase[i] <= -np.pi:
            target_index = i
            break
    if target_index is None:
        raise ValueError("Система не достигает фазы -180° — невозможно определить Kcr")

    wc = omega[target_index]
    Kcr = 1.0 / mag[target_index]
    Tcr = 2 * np.pi / wc

    best_Kp = 0.6 * Kcr
    for kp_factor in [0.5, 0.55, 0.6, 0.65, 0.7]:
        Kp = kp_factor * Kcr
        controller = control.tf([Kp], [1])
        closed_loop = control.feedback(controller * system_with_delay, 1)
        t_temp = np.linspace(0, 50, 1000)
        _, y_temp = control.step_response(closed_loop, T=t_temp)
        overshoot = (np.max(y_temp) - 1.0) * 100
        if 10 <= overshoot <= 20:
            best_Kp = Kp
            break

    controller = control.tf([best_Kp], [1])
    closed_loop = control.feedback(controller * system_with_delay, 1)
    t, y = control.step_response(closed_loop, T=np.linspace(0, 50, 1000))
    y = max(data) * y

    return t, y, best_Kp