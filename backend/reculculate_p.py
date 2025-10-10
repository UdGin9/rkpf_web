import control
import numpy as np

def reculculate_p(F1, tau, Kp,  k, time,  data):

    num_pade, den_pade = control.pade(tau, n=3)
    delay_tf = control.TransferFunction(num_pade, den_pade)
    plant = control.TransferFunction([k], [F1, 0])
    system_with_delay = control.series(plant, delay_tf)

    controller = control.tf([Kp], [1])
    closed_loop = control.feedback(controller * system_with_delay, 1)
    t, y = control.step_response(closed_loop, T=np.linspace(0, time, 1000))
    y = max(data) * y

    return t, y