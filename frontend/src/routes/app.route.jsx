import { createBrowserRouter } from "react-router-dom"
import App from "../app/App"
import ProtectedRoute from "../routes/ProtectedRoute"
import PublicRoute from "../routes/PublicRoute"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Inventory from "../pages/Inventory"
import Udhaar from "../pages/Udhaar"
// import Products from "../pages/Products"
import Sales from "../pages/Sales"
import Purchases from "../pages/Purchases"
import Customers from "../pages/Customers"
import Billing from "../pages/Billing"
import Finance from "../pages/Finance"
import NotFound from "./NotFound"
import Reports from "../pages/Reports"
import Setting from "../pages/Setting"

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "/login",
                        element: <Login />
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
                        path: "/udhaar",
                        element: <Udhaar />
                    },
                    // {
                    //     path: "/products",
                    //     element: <Products />
                    // },
                    {
                        path: "/sales",
                        element: <Sales />
                    },
                    {
                        path: "/purchases",
                        element: <Purchases />
                    },
                    {
                        path: "/inventory",
                        element: <Inventory />
                    },
                    {
                        path: "/customers",
                        element: <Customers />
                    },
                    {
                        path: "/finance",
                        element: <Finance />
                    },
                    {
                        path: "/billing",
                        element: <Billing />
                    },
                    {
                        path: "/reports",
                        element: <Reports />
                    },
                    {
                        path: "/settings",
                        element: <Setting />
                    }
                ]
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
])
