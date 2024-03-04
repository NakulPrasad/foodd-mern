import React, { useEffect, useState, useCallback } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { URLs } from "../configs/URLs";

export default function MyOrder() {
 const [orderData, setOrderData] = useState(null);
 const [error, setError] = useState(null);

 const fetchMyOrder = useCallback(async () => {
    try {
      const response = await fetch(URLs.getOrders, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
        }),
      });
      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      setError(err);
    }
 }, []);

 useEffect(() => {
    fetchMyOrder();
 }, [fetchMyOrder]);
 
  return (
    <>
      <NavBar />

      <div className="container">
        <div className="row">
          {orderData 
            ? Array(orderData).map((data) => {
                return data.orderData ? (
                  data.orderData.order_data
                    .slice(0)
                    .reverse()
                    .map((item) => {
                      return item.map((arrayData) => {
                        return (
                          <div>
                            {arrayData.Order_date ? (
                              <div className="m-auto mt-5">
                                {(data = arrayData.Order_date)}
                                <hr />
                              </div>
                            ) : (
                              <div className="col-12 col-md-6 col-lg-3">
                                <div
                                  className="card mt-3"
                                  style={{
                                    width: "18rem",
                                    maxHeight: "360px",
                                  }}
                                >
                                  <img
                                    src={arrayData.img}
                                    className="card-img-top"
                                    alt="..."
                                    style={{
                                      height: "120px",
                                      objectFit: "fill",
                                    }}
                                  />
                                  <div className="card-body">
                                    <h5 className="card-title">
                                      {arrayData.name}
                                    </h5>
                                    <div
                                      className="container w-100 p-0"
                                      style={{ height: "38px" }}
                                    >
                                      <span className="m-1">
                                        Qty : {arrayData.qty}
                                      </span>
                                      <span className="m-1">
                                        Size : {arrayData.size}
                                      </span>
                                      {/* <span className="m-1">{data}</span> */}
                                      <div className=" d-inline ms-2 h-100 w-20 fs-5 text-success">
                                        ₹{arrayData.price}/-
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })
                ) : (
                  <h1 className="display-5 fw-bold px-4 py-5 my-5 text-center">
                    You haven't order before
                  </h1>
                );
              })
            : ""}
        </div>
      </div>

      <Footer />
    </>
  );
}
