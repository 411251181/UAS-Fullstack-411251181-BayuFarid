import http from './http';

export const getItemsRequest = async () => {
  const { data } = await http.get('/items');
  return data;
};

export const getItemDetailRequest = async (id) => {
  const { data } = await http.get(`/items/${id}`);
  return data;
};

export const getOwnerItemsRequest = async () => {
  const { data } = await http.get('/items/owner/my');
  return data;
};

export const createItemRequest = async (payload) => {
  const { data } = await http.post('/items', payload);
  return data;
};

export const updateItemRequest = async (id, payload) => {
  const { data } = await http.put(`/items/${id}`, payload);
  return data;
};

export const deleteItemRequest = async (id) => {
  const { data } = await http.delete(`/items/${id}`);
  return data;
};
