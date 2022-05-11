import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import MainContainer from "../../components/layout/MainContainer";
import { useNavigate } from "react-router-dom";
import { productsService, cartService } from "../../services";
import './productDescription.scss'
const ProductDescription = (props) => {
    let params = useParams();
    let [product, setProduct] = useState(null);
    let [quantity, setQuantity] = useState(1);
    let [currentCart, setCurrentCart] = useState(null);
    let [updating, setUpdating] = useState(false);
    let [input, setInput] = useState({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        code: 0
    })
    let currentUser = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        let pid = params.pid;
        productsService.getProductById({ pid: pid, callbackSuccess: callbackSuccessGetProductById, callbackError: callbackErrorGetProductById });
    }, [])
    useEffect(() => {
        if (currentUser && currentUser.role !== "superadmin" && !currentCart) {
            console.log(currentUser);
            cartService.getCartById({ cid: currentUser.cart, callbackSuccess: callbackSuccessGetCartById, callbackError: callbackErrorGetCartById });
        }
    }, [currentUser])
    useEffect(() => {
        if (product&&!updating) {
            setInput({
                ...product
            })
        }
    }, [product])
    useEffect(()=>{
        console.log(input);
    },[input])
    const addProduct = () => {
        if (quantity <= 0) {
            Swal.fire({
                icon: "error",
                title: "Pedido vacío",
                text: "No se puede agregar una cantidad de 0 o menor en el carrito",
                timer: 2000
            })
            return;
        }
        let pid = params.pid;
        cartService.addProductToCart({ cid: currentUser.cart, pid: pid, body: { quantity }, callbackSuccess: callbackSuccessAddProductToCart, callbackError: callbackErrorAddProductToCart });
    }
    const changeFromThumbnail = (product) => {
        window.location.replace('/products/' + product._id)
    }
    const setUpdate = () => {
        setUpdating(true);
    }
    const handleInputChange = (e) =>{
        setInput(prev=>({...prev,[e.target.name]:e.target.value}))
    }
    const cancelUpdate = () =>{
        setUpdating(false);
        setInput({...product}) 
    }
    const confirmChanges = () =>{
        Swal.fire({
            title: "¿Actualizar producto?",
            icon:"question",
            text: "Todos los usuarios podrán ver el producto y sus cambios",
            showConfirmButton: true,
            confirmButtonText: "Actualizar producto",
            confirmButtonColor: "green",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "red"
        }).then(result=>{
            if(result.isConfirmed){
                productsService.updateProduct({pid:product._id,body:input,callbackSuccess:callbackSuccessUpdateProduct,callbackError:callbackErrorUpdateProduct});
            }
        })
    }
    const deleteProduct = () =>{
        Swal.fire({
            title: "¿Eliminar producto?",
            icon:"warning",
            text: "Esta acción es irreversible",
            showConfirmButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "green",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "red"
        }).then(result=>{
            if(result.isConfirmed){
                productsService.deleteProduct({pid:product._id,callbackSuccess:callbackSuccessDeleteProduct,callbackError:callbackErrorDeleteProduct});
            }
        })
    }
    /*CALLBACKS */
    const callbackSuccessGetProductById = (result) => {
        console.log(result.data.payload);
        setProduct(result.data.payload);
    }
    const callbackErrorGetProductById = (error) => {
        console.log(error);
    }
    const callbackSuccessGetCartById = (result) => {
        console.log(result.data.payload);
        setCurrentCart(result.data.payload.products);
    }
    const callbackErrorGetCartById = (error) => {
        console.log(error);
    }
    const callbackSuccessAddProductToCart = (result) => {
        console.log(result.data);
        if(result.data.quantityChanged){
            Swal.fire({
                icon: "success",
                title: "Hubo un cambio en el número de ejemplares",
                text: `El stock del producto cambió durante el proceso, sólo se han podido añadir ${result.data.newQuantity} ejemplares del producto`,
                timer:3000
            }).then(result=>{
                window.location.replace('/');
            })
        }
        else{
            Swal.fire({
                icon: "success",
                title: "¡Producto añadido con éxito!",
                text: `Se han añadido ${result.data.newQuantity} ejemplares al carrito`,
                timer:2000
            }).then(result=>{
                window.location.replace('/');
            })
        }

    }
    const callbackErrorAddProductToCart = (error) => {
        console.log(error);
    }
    const callbackSuccessUpdateProduct = (response) =>{
        productsService.getProductById({ pid: product._id, callbackSuccess: callbackSuccessGetProductById, callbackError: callbackErrorGetProductById });
        setUpdating(false);
        Swal.fire({
            icon:"success",
            title:"Producto actualizado",
            text:"El producto se ha actualizado con éxito",
            timer:2000
        })
    }
    const callbackErrorUpdateProduct = (error) =>{
        Swal.fire({
            icon:"error",
            title:"Error al actualizar producto",
            text:"Ha habido un error al actualizar producto.",
            timer:2000
        })
    }
    const callbackSuccessDeleteProduct = response =>{
        Swal.fire({
            title:"Producto eliminado",
            text:"El producto se eliminó correctamente",
            icon:"success",
            timer:2000
        }).then(result=>{
            window.location.replace('/')
        })
    }
    const callbackErrorDeleteProduct = error=>{
        console.log(error);
        Swal.fire({
            title:"No eliminado",
            text:"El producto no pudo eliminarse, revisar cambios",
            icon:"error",
            timer:1000
        })
    }
    return (<MainContainer>
        <div className="customRow">
            <div className="customColumn1">
                <div className="imagePanel">
                    <img src={product && product.thumbnail}></img>
                </div>
            </div>
            <div className="customColumn2">
                <div className="descriptionPanel">
                    <p style={{ fontSize: "35px" }}>{product && product.title}</p>
                    <p style={{ fontSize: "20px" }}>{product && product.description}</p>
                    <p style={{ fontSize: "40px" }}>$ {product && product.price}<span style={{ fontSize: "15px", position: "relative", bottom: "20px" }}>00</span></p>
                </div>
            </div>
            {
                currentUser.role !== 'superadmin' ?
                    <>
                        <div className="customColumn3">
                            <div className="pricingPanel">
                                <p>$ {product && product.price}<span style={{ fontSize: "8px", position: "relative", bottom: "8px" }}>00</span></p>
                                <p style={{ fontSize: "15px" }}>La entrega de este producto corre por cuenta de CoderHouse en <span style={{ color: "blue" }}>3 días hábiles</span></p>
                                <p style={{ fontSize: "13px", textAlign: "left" }}>¿Necesitas este producto con entrega inmediata? <span className="spanPlan">Cambia tu plan a premium</span></p>
                                <br />
                                <p>{product ? product.status ? product.status === "available" || product.stock > 0 ? <span style={{ color: "green" }}>Aún con disponibilidad</span> : <span style={{ color: "red" }}>Sin disponibilidad</span> : null : null}</p>

                                {
                                    currentCart ? currentCart.some(prod => prod.product._id === product._id) ? <>
                                        <p>El producto ya está en el carrito</p>
                                        <button className="addToCartButton" onClick={()=>window.location.replace('/cart')}>Ver carrito</button>
                                    </> :
                                        <>
                                            <br />
                                            {product && <p>Disponibles: {product.stock} piezas</p>}
                                            <label>Cantidad : </label>
                                            <input type="number" onKeyDown={(e) => e.preventDefault()} max={product ? product.stock : 10} value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
                                            <br />
                                            <br />
                                            {product?product.stock>0?<button className="addToCartButton" onClick={addProduct}>Agregar al carrito</button>:<p>Producto fuera de stock, pronto volveremos con más piezas</p>:null}
                                        </>
                                        : null
                                }
                            </div>
                        </div>
                        <div className="customColumn4">
                            <div className="cartPanel">
                                <p style={{ fontSize: "11px" }}>Productos en tu carrito hasta el momento:</p>
                                {
                                    currentCart ? currentCart.length === 0 ? <p style={{ fontSize: "11px" }}>No tienes productos en este carrito aún</p> :
                                        currentCart.slice(0, 3).map(product => <><img onClick={() => changeFromThumbnail(product.product)} src={product.product.thumbnail} className="thumbnail" /></>) : null
                                }
                                <button className="addToCartButton" onClick={()=>window.location.replace('/cart')} style={{ fontSize: "10px", padding: "5px", width: "55%" }}>Ver carrito completo</button>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="adminColumn">
                            {
                                !updating ?
                                    <div>

                                        <div>
                                            <ul>
                                                <li>Código:{product ? product.code : "Indefinido"}</li>
                                                <li>Stock: {product ? product.stock : "Indefinido"}</li>
                                            </ul>
                                        </div>
                                        <div style={{ textAlign: "center", marginTop: "40px" }}>
                                            <button className="addToCartButton" onClick={setUpdate}>Actualizar</button>
                                            <button className="addToCartButton" onClick={deleteProduct}>Eliminar producto</button>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <p style={{ fontSize: "25px", textAlign: "center" }}>Actualizar producto</p>
                                        <div style={{ textAlign: "center" }}>
                                            <label>Nombre del producto: </label>
                                            <input name="title" value={input.title} onChange={handleInputChange}></input>
                                            <label>Descripción del producto:</label>
                                            <textarea name="description" value={input.description} onChange={handleInputChange}></textarea>
                                            <label>Precio</label>
                                            <input type="number" min="0" name="price" value={input.price} onChange={handleInputChange}></input>
                                            <p>Código: {product.code}</p>
                                            <label>Stock: </label>
                                            <input type="number" min="0" name="stock" value={input.stock} onChange={handleInputChange}/>
                                        </div>
                                        <div>
                                            <button onClick={confirmChanges}>Confirmar</button>
                                            <button onClick={cancelUpdate}>Cancelar</button>
                                        </div>
                                    </div>
                            }
                        </div>
                    </>
            }
        </div>

    </MainContainer>)
}

export default ProductDescription;