import React, { useState , useEffect} from "react";
import api from "../utils/axios";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

    const login = async(email, password) => {
      try {
        const {data} = await api.post("/auth/login", {email, password});
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        return data;
      } catch (error) {
        console.log("Error occurred while logging in:", error);
        throw error;
      }
      };

    const verifyOtp = async(email, otp) => {
        try {
            const {data} = await api.post("/auth/verify-otp",{email, otp});
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;
    
        } catch (error) {
            console.log("Error occurred while verifying OTP:", error);
        }
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    const register = async (name, email, password, role) => {
        try {
            const { data } = await api.post("/auth/register", { name, email, password, role });
            setUser(data);
    
            return data;
        } catch (error) {
            console.log("Error occurred while registering:", error);
            throw error;
        }
    };

    return (
    <AuthContext.Provider value={{ user, login ,logout, loading, register, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};
