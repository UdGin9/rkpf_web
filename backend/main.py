from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from calculate_transfer_function import calculate_transfer_function
from p_regul import p_regul
from pi_regul import pi_regul
from pid_regul import pid_regul

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/calculate")
async def calculate(request: Request):
    try:
        body = await request.json()
        print("Полученные данные:", body)

        time_step_seconds = body.get("time_step_seconds")
        data_str_list = body.get("data")
        x_in = body.get("x_in")
        x_in_infinity = body.get("x_in_infinity")
        delay = body.get('delay')
        contur = body.get('contur')

        required_fields = {
            "time_step_seconds": time_step_seconds,
            "data": data_str_list,
            "x_in": x_in,
            "x_in_infinity": x_in_infinity,
            'delay': delay,
            'contur': contur
        }

        for field_name, value in required_fields.items():
            if value is None or value == "":
                raise HTTPException(status_code=400, detail=f"Отсутствует обязательное поле: {field_name}")

        try:
            time_step_seconds = float(time_step_seconds)
            x_in = float(x_in)
            x_in_infinity = float(x_in_infinity)
            data = [float(x) for x in data_str_list if x.strip() != '']
        except (ValueError, TypeError) as e:
            raise HTTPException(status_code=400, detail=f"Ошибка преобразования данных в число: {str(e)}")

        F1, F2, F3, k, time_array_seconds, y, array_2, array_3, array_4, array_5, array_6, D = \
            calculate_transfer_function(
                time_step_seconds=time_step_seconds,
                x_in=x_in,
                x_in_infinity=x_in_infinity,
                data=data,
                contur = contur
            )
        
        if contur in ["Промежуточная емкость", "Емкость хранения"]:
            time_array_regul, data_array, Kp = p_regul(F1, delay, k, data=data)
            Ki = None
            Kd = None
            regulator_type = "P"
        elif contur == "Температура":
            time_array_regul, data_array, Kp, Ki, Kd = pid_regul(F1, delay, k, F2, data=data)
            regulator_type = "PID"
        else:
            time_array_regul, data_array, Kp, Ki = pi_regul(F1, delay, k, data=data)
            Kd = None
            regulator_type = "PI"

        return {
            "success": True,
            "regulator_type": regulator_type,
            "F1": F1,
            "F2": F2,
            "F3": F3,
            "k": k,
            "time_array_seconds": [float(t) for t in time_array_seconds],
            "y": [float(val) for val in y],
            "array_2": [float(val) for val in array_2],
            "array_3": [float(val) for val in array_3],
            "array_4": [float(val) for val in array_4],
            "array_5": [float(val) for val in array_5],
            "array_6": [float(val) for val in array_6],
            "D": D,
            "time_array_regul": time_array_regul.tolist(),
            "data_array": data_array.tolist(),
            "Kp": Kp,
            "Ki": Ki,
            "Kd": Kd,
            'regulator_type':regulator_type,
            "message": f"Расчёт успешно выполнен ({regulator_type}-регулятор)"
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Ошибка на сервере: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка выполнения расчёта: {str(e)}")