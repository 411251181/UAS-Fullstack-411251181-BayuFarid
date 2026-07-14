export const extractApiError = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item?.message) {
          return item.message;
        }

        if (item?.field) {
          return item.field;
        }

        return null;
      })
      .filter(Boolean)
      .join(', ');
  }

  return error.response?.data?.message || error.message || 'Terjadi kesalahan';
};
