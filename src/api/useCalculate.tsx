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
        throw new Error(`Ошибка сервера: ${res.status}`);
      }

      return res.json();
    },
  });
};
