import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from "../api/api.jsx";
import { toast } from 'react-toastify';

const useDocumentStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            isLoading: false, 

     
            setLoading: (status) => set({ isLoading: status }),

            actionLogin: async (form) => {
               
                try {
                    const res = await apiClient.post('/api/login', form);
                    const { token, payload } = res.data;
                    const userObject = { user_name: payload.user_name };
                    if (token) {
                        set({ token: token, user: userObject });
                        toast.success(res.data.message || "Login successful!");
                    }
                    return res;
                } catch (error) {
                    const errMsg = error.response?.data?.message || "Login failed!";
                    toast.error(errMsg);
                    throw error;
                }
            },

            actionLogout: () => {
                set({ token: null, user: null, isLoading: false });
                toast.info("You have been logged out.");
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useDocumentStore;