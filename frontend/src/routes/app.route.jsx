import { createBrowserRouter } from "react-router-dom"
import App from "../app/App"
import ProtectedRoute from "../routes/ProtectedRoute"
import PublicRoute from "../routes/PublicRoute"
import Google from "../pages/Google"
import Dashboard from "../pages/Dashboard"
import O2D from "../pages/O2D"

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "/login",
                        element: <Google />
                    }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />
                    },
                    {
                        path: "/O2D",
                        element: <O2D />
                    }
                ]
            },
        ]
    }
])
