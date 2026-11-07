export const unwrap = (response) => {
  const data = response?.data ?? response;

  return data?.data ?? data;
};