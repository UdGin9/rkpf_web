import control 
import numpy as np


def reculculate_pid(F1, F2, k, Kp, Ki, Kd, tau, time, data):

    num_pade, den_pade = control.pade(tau, n=3)
    delay_tf = control.TransferFunction(num_pade, den_pade)
    plant = control.TransferFunction([k], [F2, F1, 1])
    system_with_delay = control.series(plant, delay_tf)

    Kp_tf = control.tf([Kp], [1])
    Ki_tf = control.tf([Ki], [1, 0])
    Kd_tf = control.tf([Kd, 0], [1])
    pid_controller = Kp_tf + Ki_tf + Kd_tf

    closed_loop = control.feedback(pid_controller * system_with_delay, 1)
    t, y = control.step_response(closed_loop, T=np.linspace(0, time, 1000))
    y = max(data) * y

    return t, y