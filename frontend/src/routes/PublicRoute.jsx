import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const PublicRoute = () => {
	const { user, initialized, isLoading } = useAuth();

	if (!initialized || isLoading) {
		return (
			<main className="auth-shell min-h-screen flex items-center justify-center bg-slate-950 p-6">
				<div className="loading-card flex flex-col items-center gap-4">
					<div className="spinner w-10 h-10 border-3 border-white/10 rounded-full border-t-blue-500 animate-spin"></div>
					<p className="loading-text text-slate-400 text-sm font-medium">Loading your workspace...</p>
				</div>
			</main>
		);
	}

	if (user) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};

export default PublicRoute;

