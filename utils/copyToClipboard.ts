import { toast } from "vue-sonner";

export default async (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Success!", {
          description: "Code copied to clipboard.",
          action: {
            label: "Close",
            onClick: () => toast.dismiss("COPY_SUCCESS"),
          },
          id: "COPY_SUCCESS",
        });
      })
      .catch((err) => {
        toast.error("Error!", {
          description: "We could not copy code.",
          action: {
            label: "Close",
            onClick: () => toast.dismiss("COPY_ERROR"),
          },
          id: "COPY_ERROR",
        });
      });
  }
};
