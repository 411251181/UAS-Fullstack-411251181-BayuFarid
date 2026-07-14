export const extractApiError = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.join(', ');
  }

  return error.response?.data?.message || error.message || 'Terjadi kesalahan';
};
