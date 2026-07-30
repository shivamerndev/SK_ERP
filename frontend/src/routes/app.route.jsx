import { createBrowserRouter } from "react-router-dom"
import App from "../app/App"
import ProtectedRoute from "../routes/ProtectedRoute"
import PublicRoute from "../routes/PublicRoute"
import Google from "../pages/Google"
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
