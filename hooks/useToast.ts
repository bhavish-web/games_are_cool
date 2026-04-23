"use client";

export function useToast() {
  return {
    toast: (message: { title: string; description?: string }) => {
      console.log(message);
    },
  };
}
