import { useState } from "react";
import Swal from "sweetalert2";
import MainContainer from "../../components/layout/MainContainer";
import { productsService } from "../../services";

const NewProduct = (props) => {
    let [input, setInput] = useState({
        title: {
            value: "",
            error: "",
        },
        description: {
            value: "",
            error: "",
        },
        price: {
            value: 0,
            error: "",
        },
        code: {
            value: "",
            error: ""
        },
        stock: {
            value: 0,
            error: "",
        },

    })
    let [thumbnail, setThumbnail] = useState(null);
    const handleInputChange = (e) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: {
                value: e.target.value,
                error: null
            }
        }))
    }
    const handleImageChange = (e) => {
        setThumbnail(e.target.files[0])
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let error = false
        Object.keys(input).forEach(key => {
            if (input[key].value.length === 0) {
                error = true;
                setInput((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        error: "Completar este campo"
                    }
                }))
            }
        })
        if (!error) {
            let form = new FormData();
            form.append('title', input.title.value);
            form.append('description', input.description.value);
            form.append('code', input.code.value);
            form.append('stock', input.stock.value);
            form.append('price', input.price.value);
            form.append('thumbnail',thumbnail);
            productsService.createProduct({ body: form, callbackSuccess:callbackSuccessCreateProduct, callbackError:callbackErrorCreateProduct})
        }
    }
    /*CALLBACKS*/
    const callbackSuccessCreateProduct = (response) =>{
        Swal.fire({
            title:"Producto agregado",
            icon:"success",
            text:"El producto se ha agregado con éxito",
            timer:3000
        }).then(result=>{
            window.location.replace('/')
        })
    }
    const callbackErrorCreateProduct = (error) =>{
        Swal.fire({
            title:"Error de agregación",
            icon:"error",
            text:"El producto no pudo agregarse correctamente, revisar conexión o formato",
            timer:3000
        })
    }
    return <>
        <MainContainer>
            <div>
                <p>Nuevo producto</p>
                <form>
                    <label>Nombre del producto</label>
                    <input value={input.title.value} name="title" onChange={handleInputChange} />
                    <label>Precio del producto</label>
                    <input value={input.price.value} name="price" type="number" onChange={handleInputChange} />
                    <label>Descripción</label>
                    <textarea value={input.description.value} name="description" onChange={handleInputChange} />
                    <label>Código</label>
                    <input value={input.code.value} name="code" onChange={handleInputChange} />
                    <label>Stock</label>
                    <input value={input.stock.value} name="stock" type="number" onChange={handleInputChange} />
                    <label>Imagen del producto</label>
                    <input type="file" name="thumbnail" onChange={handleImageChange} />
                    <button onClick={handleSubmit}>Confirmar</button>
                </form>
            </div>
        </MainContainer>
    </>
}

export default NewProduct;