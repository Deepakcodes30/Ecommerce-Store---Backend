export async function fetchWrapper(Response) {
  try {
    const data = await Response();
    return { success: true, data };
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Something went Wrong";
    return {
      success: false,
      message,
    };
  }
}
