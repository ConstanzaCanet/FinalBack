import Navbar from "./Navbar"
const MainContainer = (props) =>{
    return<div className="mainContainer">
        <Navbar/>
        {props.children}
    </div>
}

export default MainContainer;