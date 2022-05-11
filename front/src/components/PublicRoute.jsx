import {Navigate,Outlet} from 'react-router-dom';

const PublicRoute = ({isLogged}) => {
    return !isLogged?<Outlet/>:<Navigate to='/'/>
}

export default  PublicRoute;