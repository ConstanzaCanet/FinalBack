import MainLogo from '../../assets/images/large.png'
import '../../assets/styles/generals.scss';
import { NavLink } from 'react-router-dom';
import AdminIcon from '../../assets/images/adminIcon.png'
import Cookies from 'js-cookie';
import { options } from '../../utils';
const Navbar = (props) => {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    if(!currentUser){
        window.location.replace('/login');
    }
    const logout = () =>{
        localStorage.clear();
        Cookies.remove(process.env.REACT_APP_COOKIE_NAME)
        window.location.replace('/');
    }
    const elements = options.filter(option=>{
        if(option.showWhen===true) return true;
        return option.showWhen===currentUser.role;
    })
    return <>
        <div className="navbar">
            <div className="navbarBrand">
                <img src={MainLogo} />
            </div>
            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                <div className="navbarMenu">
                    {elements.map(element=><NavLink key={element.path} to={element.path} className={({ isActive }) => (isActive ? 'activeLink' : 'link')} style={{ textDecoration: "none" }}>{element.label}</NavLink>)}
                </div>
            </div>
            <div className="navbarProfile ">
                <div>
                    <div className="dropdown">
                        <img src={currentUser.profile_picture ? currentUser.profile_picture: AdminIcon} className={currentUser.role==="superadmin"?"mainIcon":"userIcon"} />
                        <div className="dropdownContent">
                            <button className="dropdownButton" onClick={logout}>Cerrar sesión</button>
                            <button className="dropdownButton">Configuración</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}


export default Navbar;