import { getUserService, loginService, registerService, logoutService, refreshTokenService } from './auth.service'
import { useDispatch, useSelector } from "react-redux"
import { logout, setAccessToken, setAuthLoading, setInitialized, setUser } from '../store/features/auth.slice'
import { useNavigate } from "react-router-dom"


const useAuth = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { user, accessToken, isLoading, initialized } = useSelector((state) => state.auth)

	const checkAuth = async () => {
		dispatch(setAuthLoading(true))
		try {
			const res = await refreshTokenService()
			const newToken = res.data.data.accessToken
			const fetchedUser = res.data.data.user
			dispatch(setAccessToken(newToken))
			if (fetchedUser) {
				dispatch(setUser(fetchedUser))
			} else {
				const userRes = await getUserService()
				dispatch(setUser(userRes.data.data))
			}
		} catch (error) {
			dispatch(logout())
		} finally {
			dispatch(setAuthLoading(false))
			dispatch(setInitialized(true))
		}
	}

	const handleLogin = async (credentials) => {
		try {
			dispatch(setAuthLoading(true))
			const data = await loginService(credentials);
			dispatch(setAccessToken(data.accessToken));
			dispatch(setUser(data.user));
			navigate("/", { replace: true })
			return data;
		} catch (error) {
			console.error("Login failed:", error)
			dispatch(logout())
			throw error
		} finally {
			dispatch(setAuthLoading(false))
		}
	};

	const handleRegister = async (userData) => {
		try {
			dispatch(setAuthLoading(true))
			const data = await registerService(userData);
			dispatch(setAccessToken(data.accessToken));
			dispatch(setUser(data.user));
			navigate("/", { replace: true })
			return data;
		} catch (error) {
			console.error("Registration failed:", error)
			dispatch(logout())
			throw error
		} finally {
			dispatch(setAuthLoading(false))
		}
	};


	const handleGetUser = async () => {
		try {
			let { data } = await getUserService()
			dispatch(setUser(data.data))
		} catch (error) {
			console.error("Get user failed:", error.message)
			dispatch(setUser(null))
		}
	}

	const handleLogout = async () => {
		try {
			await logoutService()
		} catch (error) {
			console.error("Logout failed on server:", error)
		} finally {
			dispatch(logout())
			navigate("/login", { replace: true })
		}
	}

	const handleRefreshToken = async () => {
		let res = await refreshTokenService()
		const token = res.data.data.accessToken
		dispatch(setAccessToken(token))
		if (res.data.data.user) {
			dispatch(setUser(res.data.data.user))
		}
		return token
	}


	return {
		user,
		accessToken,
		isLoading,
		initialized,
		status: isLoading ? "loading" : "idle",
		checkAuth,
		handleGetUser,
		handleRefreshToken,
		handleLogin,
		handleRegister,
		handleLogout,
	}
}

export default useAuth
