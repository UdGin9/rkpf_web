import numpy as np
import matplotlib.pyplot as plt
import control

def reculculate_pi(F1, k, Kp, Ki, tau, time, data):


    num_pade, den_pade = control.pade(tau, n=3)
    delay_tf = control.TransferFunction(num_pade, den_pade)

    plant = control.TransferFunction([k], [F1, 1])

    system_with_delay = control.series(plant, delay_tf)

    pi_controller = control.tf([Kp], [1]) + control.tf([Ki], [1, 0])
    closed_loop = control.feedback(pi_controller * system_with_delay, 1)
    t, y = control.step_response(closed_loop, T=np.linspace(0, time, 1000))
    y = max(data) * y

    return t, y