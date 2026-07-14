import http from './http';

export const createRentalRequest = async (payload) => {
  const { data } = await http.post('/rentals', payload);
  return data;
};

export const getMyRentalsRequest = async () => {
  const { data } = await http.get('/rentals/my');
  return data;
};

export const getOwnerRentalsRequest = async () => {
  const { data } = await http.get('/rentals/owner');
  return data;
};

export const getRentalDetailRequest = async (id) => {
  const { data } = await http.get(`/rentals/${id}`);
  return data;
};

export const returnRentalRequest = async (id) => {
  const { data } = await http.patch(`/rentals/${id}/return`);
  return data;
};

export const cancelRentalRequest = async (id) => {
  const { data } = await http.patch(`/rentals/${id}/cancel`);
  return data;
};
