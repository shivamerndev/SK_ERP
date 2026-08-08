import React, { useState } from 'react';
import useAuth from '../auth/useAuth';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
	const { handleLogin, handleRegister } = useAuth();
	const [mode, setMode] = useState('login'); // 'login' | 'register'

	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: ''
	});

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
		if (error) setError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (mode === 'login') {
				await handleLogin({
					email: formData.email,
					password: formData.password
				});
			} else {
				if (!formData.fullName.trim()) {
					throw new Error('Full Name is required');
				}
				await handleRegister({
					fullName: formData.fullName,
					email: formData.email,
					password: formData.password
				});
			}
		} catch (err) {
			const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check your inputs.';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const switchMode = (newMode) => {
		setMode(newMode);
		setError(null);
	};

	return (
		<main className="auth-shell min-h-screen flex items-center justify-center bg-gradient-to-br from-[#180d07] via-[#120a05] to-[#0a0502] p-4 sm:p-6 text-[#d4c3b3]">
			<section className="auth-panel bg-[#120a05]/90 backdrop-blur-xl border border-[#4a3219]/60 rounded-2xl p-6 sm:p-10 w-full max-w-md shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
				
				{/* Top Branding Header */}
				<div className="flex items-center justify-center gap-3 mb-6">
					<figure className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#f3d078] via-[#b8860b] to-[#59390f] p-[2px] shadow-[0_0_12px_rgba(212,175,55,0.35)] flex items-center justify-center flex-shrink-0">
						<img
							src="/icon.png"
							alt="SK-ERP"
							className="w-full h-full object-cover rounded-full bg-[#120a05]"
						/>
					</figure>
					<div className="flex flex-col text-left">
						<div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffeab3] via-[#f5cf6e] to-[#d4af37] text-base leading-tight tracking-tight drop-shadow-sm">
							SK-ERP
						</div>
						<span className="eyebrow text-[#b39568] text-[10px] uppercase tracking-widest font-semibold">
							Enterprise Workspace
						</span>
					</div>
				</div>

				<h1 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#ffeab3] via-[#f5cf6e] to-[#d4af37] mb-2 tracking-tight drop-shadow-sm">
					{mode === 'login' ? 'Welcome Back' : 'Create Account'}
				</h1>
				<p className="text-center text-[#c7b299] text-sm leading-relaxed mb-6">
					{mode === 'login'
						? 'Sign in to access your business operations and workspace'
						: 'Set up your ERP account to get started'}
				</p>

				{/* Mode Switcher Tabs */}
				<div className="flex bg-[#0a0502]/80 p-1 rounded-xl mb-6 border border-[#3a2613]/70">
					<button
						type="button"
						onClick={() => switchMode('login')}
						className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
							mode === 'login'
								? 'bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] text-[#140b04] font-bold shadow-[0_4px_16px_rgba(212,175,55,0.3)]'
								: 'text-[#c7b299] hover:text-[#fff4d1] hover:bg-[#2a190d]/60'
						}`}
					>
						Sign In
					</button>
					<button
						type="button"
						onClick={() => switchMode('register')}
						className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
							mode === 'register'
								? 'bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] text-[#140b04] font-bold shadow-[0_4px_16px_rgba(212,175,55,0.3)]'
								: 'text-[#c7b299] hover:text-[#fff4d1] hover:bg-[#2a190d]/60'
						}`}
					>
						Register
					</button>
				</div>

				{/* Alert Message */}
				{error && (
					<div className="mb-5 p-3 rounded-xl bg-[#3d1414]/50 border border-[#852a2a]/60 text-[#e57373] text-sm flex items-start gap-2.5 animate-fadeIn">
						<AlertCircle className="w-5 h-5 shrink-0 text-[#e57373] mt-0.5" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4 text-left">
					{mode === 'register' && (
						<div>
							<label className="block text-xs font-semibold text-[#b39568] uppercase tracking-wider mb-1.5">
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3886b]" />
								<input
									type="text"
									name="fullName"
									value={formData.fullName}
									onChange={handleChange}
									placeholder="John Doe"
									required
									className="w-full bg-[#0a0502]/80 border border-[#3a2613] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#ffeab3] placeholder-[#7a6248] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
								/>
							</div>
						</div>
					)}

					<div>
						<label className="block text-xs font-semibold text-[#b39568] uppercase tracking-wider mb-1.5">
							Email Address
						</label>
						<div className="relative">
							<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3886b]" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="admin@example.com"
								required
								className="w-full bg-[#0a0502]/80 border border-[#3a2613] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#ffeab3] placeholder-[#7a6248] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs font-semibold text-[#b39568] uppercase tracking-wider mb-1.5">
							Password
						</label>
						<div className="relative">
							<Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3886b]" />
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="••••••••"
								minLength={6}
								required
								className="w-full bg-[#0a0502]/80 border border-[#3a2613] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#ffeab3] placeholder-[#7a6248] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a3886b] hover:text-[#f7d479] transition-colors cursor-pointer"
							>
								{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full mt-2 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c79928] hover:from-[#e5c158] hover:to-[#d4af37] text-[#140b04] font-bold py-2.5 rounded-xl shadow-[0_4px_16px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{loading ? (
							<div className="w-5 h-5 border-2 border-[#140b04]/30 border-t-[#140b04] rounded-full animate-spin" />
						) : (
							<>
								<span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
								<ArrowRight className="w-4 h-4 text-[#140b04]" />
							</>
						)}
					</button>
				</form>

				<p className="mt-6 text-center text-xs text-[#7a6248]">
					Protected by enterprise session encryption
				</p>
			</section>
		</main>
	);
};

export default Login;