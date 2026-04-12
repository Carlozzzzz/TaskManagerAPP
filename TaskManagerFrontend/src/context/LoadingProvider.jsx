// src//context/LoadingProvider.jsx
import { useCallback, useState } from "react";
import { LoadingContext } from "./LoadingContext";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export const LoadingProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);

	const showLoading = useCallback(() => { setLoading(true); }, []);
	const hideLoading = useCallback(() => { setLoading(false); }, []);

	return (
		<LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
			{children}

			<LoadingSpinner />

		</LoadingContext.Provider>
	);
};