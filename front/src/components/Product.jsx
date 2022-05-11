import { Link } from 'react-router-dom';
import '../assets/styles/components.scss'
const Product = ({ element }) => {
    console.log(element);
    return <div className="productCard">
        <p>{element.title}</p>
        <div className="imageHolder">
            <img src={element.thumbnail} />
        </div>
        <p>$ {element.price}<span style={{ fontSize: "5px", position: "relative", bottom: "8px" }}>00</span></p>

        <div className="buttonHolder">
            <Link to={`/products/${element._id}`}>
                <button className="productButton">Ver</button>
            </Link>
        </div>
    </div >
}

export default Product;