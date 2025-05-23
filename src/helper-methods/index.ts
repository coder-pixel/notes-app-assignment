/* eslint-disable @typescript-eslint/no-explicit-any */
import toast, { type ToastOptions } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const baseToast = (
  message: string,
  type: "success" | "error",
  options?: ToastOptions
) => {
  const finalOptions: ToastOptions = {
    position: "bottom-right",
    duration: 4000,
    ...options,
  };

  return type === "success"
    ? toast.success(message, finalOptions)
    : toast.error(message, finalOptions);
};

export const toastSuccess = (message: string, options?: ToastOptions) => {
  baseToast(message, "success", options);
};

export const errorHandler = (error: unknown, options?: ToastOptions) => {
  let message = "Something went wrong...";

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any)?.message === "string"
  ) {
    message = (error as any)?.message;
  }

  baseToast(message, "error", options);
  console.log({ message });
};

dayjs.extend(relativeTime);

export const getRelativeTime = (input: string | Date | number) => {
  return dayjs(input).fromNow(); // e.g., "5 minutes ago", "yesterday"
};
