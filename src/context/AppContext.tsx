import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useState } from 'react'

export const AppContext = createContext({});

export const AppProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>({
        isPremium: false,
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        job: "",
        about: "",
        emailAndPhone: "",
        password: "",
        location: "",
        interests: [""],
        images: ['https://i.pinimg.com/originals/1d/10/5b/1d105ba66c9c178342e661d94ad86629.jpg'],
    });

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};



