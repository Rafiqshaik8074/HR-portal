// import {create} from 'zustand';

// export const useAuthStore = create((set) => ({
//     auth : {
//         username : '',
//         active : false
//     },
//     setUsername : (name) => set((state) => ({ auth : { ...state.auth, username : name }})) 
// }))


// ---------------------------------------------------------

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    auth: {
        username: '',
        email: '', // Add email to the auth object
        active: false,
    },
    setUsername: (name) =>
        set((state) => ({
            auth: { ...state.auth, username: name },
        })),
    setEmail: (email) =>
        set((state) => ({
            auth: { ...state.auth, email: email }, // Update only the email property
        })),
}));


// import { useAuthStore } from "./path-to-your-store";
// const setUsername = useAuthStore((state) => state.setUsername);
//     const setEmail = useAuthStore((state) => state.setEmail);
//     const auth = useAuthStore((state) => state.auth); // To access the current state


// --------------------------------------------------------
