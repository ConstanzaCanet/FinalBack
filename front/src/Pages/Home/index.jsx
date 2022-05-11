import MainContainer from "../../components/layout/MainContainer";
import React, { useEffect, useState } from "react";
import { productsService } from "../../services";
import Product from "../../components/Product";
import './index.scss';
const Home = (props) => {
    let [products, setProducts] = useState([]);
    useEffect(() => {
        productsService.getProducts(callbackSuccessGetProducts, callbackErrorGetProducts)
    }, [])
    /*
        CALLBACKS
    */
    const callbackSuccessGetProducts = (result) => {
        setProducts(result.data.payload);
    }
    const callbackErrorGetProducts = (error) => {
        console.log(error);
    }
    return <MainContainer>
        <div>
            <p className="homeTitle">Nuestros Últimos productos</p>
            <div className="productPanel">
                {
                    products ? products.map(product => <Product element={product} />) : null
                }
            </div>
        </div>
    </MainContainer>
}
export default Home;