import { useEffect, useState } from "react";
import { cartService } from "../../services";
import MainContainer from "../../components/layout/MainContainer"
import './cart.scss';
import Swal from "sweetalert2";
const Cart = props => {
    let [cart, setCart] = useState(null);
    let [input, setInput] = useState({});
    let [dirty, setDirty] = useState(false);

    let currentUser = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        cartService.getCartById({ cid: currentUser.cart, callbackSuccess: callbackSuccessGetCart, callbackError: callbackErrorGetCart })
    }, [])

    useEffect(() => {
        if (cart) {
            let input = {}
            for (let element of cart.products) {
                input[element.product._id] = element.quantity
            }
            setInput(input);
        }
    }, [cart])
    useEffect(() => {
        console.log(input);
    }, [input])

    const handleInputChange = (id, quantity) => {
        setDirty(true)
        if (quantity <= 0) {
            setInput(prev => ({ ...prev, [id]: 0 }))
            Swal.fire({
                title: "Eliminar producto del carrito",
                text: "¿Deseas eliminar este producto del carrito?",
                showConfirmButton: true,
                confirmButtonText: "¡Aún quiero este producto!",
                confirmButtonColor: "green",
                showCancelButton: true,
                cancelButtonText: "Eliminar producto",
                cancelButtonColor: "red"
            }).then(result => {
                if (result.isConfirmed) {
                    setInput(prev => ({ ...prev, [id]: 1 }))
                }
                else {
                    let pid = cart.products.find(element => element.product._id === id).product._id;
                    cartService.deleteProductFromCart({ cid: cart._id, pid, callbackSuccess: callbackSuccessDeleteProductFromCart, callbackError: callbackErrorDeleteProductFromCart })
                }
            })
            return;
        }
        setInput(prev => ({ ...prev, [id]: quantity }))
    }
    const updateCart = () =>{
        let productsToSend = []
        Object.keys(input).forEach(key=>productsToSend.push({product:key,quantity:input[key]}))
        console.log(productsToSend);
        cartService.updateCart({cid:cart._id,body:{products:productsToSend},callbackSuccess:callbackSuccessUpdateCart,callbackError:callbackErrorUpdateCart});
    }
    const finishPurchase = () =>{
        Swal.fire({
            title: "¿Confirmar compra?",
            icon:"question",
            text: "Esta acción es irreversible, el cargo se hará al instante",
            showConfirmButton: true,
            confirmButtonText: "¡LO QUIERO YA!",
            confirmButtonColor: "green",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "red"
        }).then(result=>{
            if(result.isConfirmed){
                cartService.finishPurchase({cid:cart._id,callbackSuccess:callbackSuccessFinishPurchase,callbackError:callbackErrorFinishPurchase});
            }
        })
    }
    //CALLBACKS
    const callbackSuccessGetCart = (response) => {
        console.log(response.data);
        setCart(response.data.payload)
    }
    const callbackErrorGetCart = (error) => {
        console.log(error);
    }
    const callbackSuccessDeleteProductFromCart = (response) => {
        cartService.getCartById({ cid: currentUser.cart, callbackSuccess: callbackSuccessGetCart, callbackError: callbackErrorGetCart })
    }
    const callbackErrorDeleteProductFromCart = (error) => {
        console.log(error);
    }
    const callbackSuccessUpdateCart = (response) =>{
        setDirty(false);
        if(response.data.stockLimitation){
            Swal.fire({
                title: "Algunos productos tienen stock limitado",
                icon:"success",
                text: "Algunos productos contaban con un stock menor al que solicitabas, por lo que decidimos darte la cantidad máxima disponible de esos productos.",
                timer:5000
            })
        }else{
            Swal.fire({
                title: "Carrito actualizado",
                icon:"success",
                text: "El carrito se ha actualizado con éxito",
                timer:2000
            })
        }
    }
    const callbackErrorUpdateCart = error =>{
        console.log(error);
    }
    const callbackSuccessFinishPurchase = response => {
        Swal.fire({
            icon:"success",
            title:"¡Compra finalizada",
            text:"¡Felicidades! Los productos solicitados han sido procesados y están en proceso de envío",
            timer:3000
        }).then(result=>{
            window.location.replace('/')
        })
    }
    const callbackErrorFinishPurchase = error =>{
        console.log(error);
    }
    return (
        <MainContainer>
            <div className="column1">
                {dirty &&<><p>Advertencia: Todo cambio está sujeto a disponibilidad, guardar los cambios para corroborar stock</p><div>
                                    <button onClick={updateCart}>Actualizar</button>
                                </div></> }
                <div className="productsPanel">
                    {
                        cart ? cart.products.map(element => <div>
                            <div className="subColumn1">
                                <p>{element.product.title}</p>
                            </div>
                            <div className="subColumn2">
                                <p>{element.product.price}</p>
                            </div>
                            <div className="subColumn3">
                                <div style={{ display: "flex" }}>
                                    <button onClick={() => handleInputChange(element.product._id, --input[element.product._id])}> {"<"} </button>
                                    <p>{input[element.product._id]}</p>
                                    <button onClick={() => handleInputChange(element.product._id, ++input[element.product._id])}>{">"}</button>
                                </div>
                            </div>
                        </div>) :
                            <p>No hay productos en el carrito</p>
                    }
                </div>
            </div>
            <div className="column2">
                <div className="purchasePanel">
                    <p>Panel de compra</p>
                    <div>
                        Cuenta:
                        {
                            cart ? cart.products.length>0 ?<>
                                {
                                    cart.products.map(element=><div>
                                        <span>{element.product.title} : {element.product.price} x {input[element.product._id]} = {element.product.price*input[element.product._id]}</span>
                                    </div>)
                                }
                                <div>
                                   {cart?cart.products.length>0?<button disabled={dirty} onClick={finishPurchase}>Finalizar compra</button>:null:null}
                                   {dirty&&<p>No puedes finalizar la compra hasta confirmar los cambios del carrito</p>}
                                </div>
                            </>: <p>Aún no tienes productos en tu cuenta</p> : <p>Aún no tienes productos en tu cuenta</p>
                        }
                    </div>
                </div>
            </div>
        </MainContainer>
    )
}

export default Cart;