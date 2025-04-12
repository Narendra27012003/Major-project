
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedComponent() {
    const {pathname} = useLocation();
    const isLoggedIn = true;


    return isLoggedIn? <Outlet/> : <Navigate to="/auth/signin" state={{from: pathname}} replace/>
}

export default ProtectedComponent