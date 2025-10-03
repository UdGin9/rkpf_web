import { useMutation } from "@tanstack/react-query";

type InputPayload = Record<string, string>;

export const useCalculate = () => {
  return useMutation({
    mutationFn: async (payload: InputPayload) => {
      const res = await fetch("http://127.0.0.1:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = `Ошибка сети или сервера: ${res.status}`;

        try {
          const errorData = await res.json()
          // Извлекаем `detail`, если есть
          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (parseError) {
          console.warn("Не удалось распарсить ошибку с сервера", parseError)
        }

        throw new Error(errorMessage)
      }
      return res.json();
    },
  });
};
