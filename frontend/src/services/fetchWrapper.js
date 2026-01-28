export async function fetchWrapper(Response) {
  try {
    const data = await Response();
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Something went Wrong";
    throw new Error(message);
  }
}
