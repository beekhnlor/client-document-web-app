import { create } from 'zustand'
import apiClient from "../api/api.jsx";
const documentStore =  (set) =>({
    user:null,
    token:null,
    actionLogin: (form) =>{
        const res = apiClient.post('/api/login',form)
        return res
    }
})

const useDocumentStore = create(documentStore)

export default useDocumentStore