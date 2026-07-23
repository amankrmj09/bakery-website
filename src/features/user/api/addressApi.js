import axiosInstance from '../../../lib/axios';

const BASE_URL = 'http://bakery-api.blubug.me/api/users/addresses';

export const addressApi = {
  getUserAddresses: async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await axiosInstance.post(BASE_URL, addressData);
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await axiosInstance.put(`${BASE_URL}/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (addressId) => {
    const response = await axiosInstance.put(`${BASE_URL}/${addressId}/default`);
    return response.data;
  },
};
