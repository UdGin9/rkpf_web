import { useMutation } from "@tanstack/react-query";

type InputPayload = Record<string, string>;

export const useReCalculate = () => {
  return useMutation({
    mutationFn: async (payload: InputPayload) => {
      const res = await fetch("http://127.0.0.1:8000/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = `Ошибка сети или сервера: ${res.status}`;

        try {
          const errorData = await res.json()
          
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
