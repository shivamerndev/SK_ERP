import { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "536825012398-1d35bc52gj5vgm01aiso2oeogo7dfcka.apps.googleusercontent.com";

const Google = () => {
	const { handleGoogleAuth } = useAuth();
	const [error, setError] = useState(null);
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	const onSuccess = async (credentialResponse) => {
		try {
			setError(null);
			setIsAuthenticating(true);
			await handleGoogleAuth(credentialResponse);
		} catch (err) {
			setError("Authentication failed. Please try again.");
		} finally {
			setIsAuthenticating(false);
		}
	};

	const onError = () => {
		setError("Google login was cancelled or failed.");
	};

	return (
		<main className="auth-shell min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-slate-950 p-6">
			<section className="auth-panel bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-2xl text-center">
				<div className="auth-header flex items-center justify-center gap-3 mb-5">
					<div className="logo-badge bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-extrabold px-3 py-1 rounded-lg text-xs sm:text-sm tracking-wider uppercase shadow-md">D-Table</div>
					<span className="eyebrow text-slate-400 text-xs uppercase tracking-widest font-semibold">Enterprise Workspace</span>
				</div>
				<h1 className="text-2xl font-bold mb-2 text-white">Sign in to ERP Analytics</h1>
				<p className="muted text-slate-400 text-sm leading-relaxed mb-8">Access your company dashboard, O2D workflows, and real-time operations using Google OAuth.</p>

				<div className="auth-action-area flex justify-center mb-6">
					<GoogleOAuthProvider clientId={googleClientId}>
						<div className="google-btn-wrapper inline-block transform hover:scale-105 transition-transform duration-200">
							<GoogleLogin
								onSuccess={onSuccess}
								onError={onError}
								theme="filled_blue"
								shape="pill"
								size="large"
							/>
						</div>
					</GoogleOAuthProvider>
				</div>

				{isAuthenticating && (
					<div className="auth-status-msg info p-3 rounded-lg text-sm mt-4 bg-blue-500/15 border border-blue-500/30 text-blue-400 font-medium">
						<span>Verifying credentials with server...</span>
					</div>
				)}

				{error && (
					<div className="auth-status-msg error p-3 rounded-lg text-sm mt-4 bg-red-500/15 border border-red-500/30 text-red-400 font-medium">
						<span>{error}</span>
					</div>
				)}
			</section>
		</main>
	);
};

export default Google;

