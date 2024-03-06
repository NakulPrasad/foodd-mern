import React, { useEffect, useRef, useState } from "react";
import { useDispatchCart, useCart } from "./ContextReducer";

interface CardProps {
    options: Record<string, number>;
    foodItem: {
       _id: string;
       name: string;
       img: string;
    };
   }
   

const Card: React.FC<CardProps> = ({ options, foodItem }) => {
    const priceRef = useRef<HTMLSelectElement>(null);
    let priceOptions = Object.keys(options);
    const [qty, setQty] = useState<number>(1);
    const [size, setSize] = useState<string>("");
    let data = useCart();
    let dispatch = useDispatchCart();

    const handleAddToCart = async () => {
        //update functionality to cart
        let food = []
        for (const item of data) {
            // agar phle se wo foodItem added hai
            if (item.id === foodItem._id) {
                food = item;
                break;
            }
        }

      
        if (food) {
            if (food.size === size) {
              await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty });
              return;
            } else {
              await dispatch({
                type: "ADD",
                id: foodItem._id,
                name: foodItem.name,
                price: finalPrice,
                qty: qty,
                size: size,
                img: foodItem.img,
              });
              return;
            }
          }
        
        //if no item in cart, add then
        await dispatch({
            type: "ADD",
            id: props.foodItem._id,
            name: props.foodItem.name,
            price: finalPrice,
            qty: qty,
            size: size,
            img: props.foodItem.img,
        })



    }

    const finalPrice: number = parseInt(qty) * (options[size] ?? 0);
    useEffect(() => {
        setSize(priceRef.current?.value || "");
       }, []);
       

    return (
        <div>
        <div className="container">
          <div className="card mt-3" style={{ width: "18rem", maxHeight: "360px" }}>
            <img src={foodItem.img} className="card-img-top" alt="..." style={{ height: "140px", objectFit: "fill" }} />
            <div className="card-body">
              <h5 className="card-title">{foodItem.name}</h5>
              <p className="card-text">This is important</p>
              <div className="container w-100">
                <select className="me-2 h-100 w-20 text-white bg-success rounded" onChange={(e) => setQty(Number(e.target.value))}>
                  {Array.from(Array(6), (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                </select>
                <select className="me-2 h-100 w-25 bg-success text-white rounded" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                  {priceOptions.map((data) => <option key={data} value={data}>{data}</option>)}
                </select>
                <div className="d-inline">₹{finalPrice}/-</div>
              </div>
              <hr />
              <button className="btn btn-success" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Card;
