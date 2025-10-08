import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface User {
	email: string;
	name: string;
	picture: string;
	accessToken: string;
}

interface AuthContextType {
	user: User | null;
	login: (response: any) => void;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Replace with your Google OAuth Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is already logged in (from localStorage)
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = (response: any) => {
		const { access_token } = response;

		// Decode user info from the response
		fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
			headers: { Authorization: `Bearer ${access_token}` }
		})
			.then(res => res.json())
			.then(userInfo => {
				const userData: User = {
					email: userInfo.email,
					name: userInfo.name,
					picture: userInfo.picture,
					accessToken: access_token
				};
				setUser(userData);
				localStorage.setItem("user", JSON.stringify(userData));
			})
			.catch(err => {
				console.error("Failed to fetch user info:", err);
			});
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
		</GoogleOAuthProvider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
