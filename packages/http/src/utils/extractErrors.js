export function extractErrors(error) {
  return {
    errors:
      error?.response?.data?.errors ?? {},
    message:
      error?.response?.data?.message ??
      "Une erreur est survenue",
  };
}