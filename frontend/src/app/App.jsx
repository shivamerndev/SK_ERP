import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../auth/useAuth";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

const App = () => {

	const { checkAuth, user } = useAuth();
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	useEffect(() => {
		checkAuth();
	}, []);


	if (!user) {
		return <Outlet />
	}

	return (
		<main className="h-screen w-full flex bg-white ">
			<Toaster />
			<SideBar isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />

			   {/* Right Main Container */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            
				<Navbar user={user} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
                {/* Main Viewport Content */}
                <main className="flex-1 p-4 sm:p-6 bg-slate-50/50 w-full overflow-x-hidden">
                    <div className="mx-auto md:pl-4">
                        <Outlet />
                    </div>
                </main>
            </div>
		</main>
	);
};

export default App;