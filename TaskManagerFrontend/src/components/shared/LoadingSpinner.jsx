// src/components/shared/LoadingSpinner.jsx
import ReactDOM from "react-dom";
import { ClipLoader } from "react-spinners";
import { useLoading } from "../../hooks/useLoading";

const LoadingSpinner = () => {
	const { loading } = useLoading();

	if (!loading) return null;

	return ReactDOM.createPortal(
		<div className="fixed inset-0 z-spinner flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
			<ClipLoader color="#4F46E5" size={60} />
		</div>,
		document.body
	)
}

export default LoadingSpinner;