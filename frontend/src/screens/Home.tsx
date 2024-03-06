import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { URLs } from "../configs/URLs";

const Home = () => {
  const [search, setSearch] = useState("");
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch(URLs.getFoodData);
      if (!response.ok) throw new Error("Failed to get data");
      const data = await response.json();
      // console.log(data);
      setFoodItem(data[0]);
      setFoodCat(data[1]);
      // console.log(data[0], data[1]);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div>
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div
              className="carousel-caption d-none d-md-block"
              style={{ zIndex: "10" }}
            >
              <div className="d-flex justify-content-center" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
             
              </div>
            </div>
            <div className="carousel-item active carousal">
              <img
                src="https://source.unsplash.com/random/900x400/?burger"
                className="d-block w-100"
                style={{ filter: "brightness(30%)", objectFit: "fill" }}
                alt="..."
              />
            </div>
            <div className="carousel-item carousal">
              <img
                src="https://source.unsplash.com/random/900x400/?pizza"
                className="d-block w-100"
                style={{ filter: "brightness(30%)", objectFit: "fill" }}
                alt="..."
              />
            </div>
            <div className="carousel-item carousal">
              <img
                src="https://source.unsplash.com/random/900x400/?pasta"
                className="d-block w-100"
                style={{ filter: "brightness(30%)", objectFit: "fill" }}
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
    
      </div>

      <div className="container">
        { foodCat.map((data) => {
                return (
                  <div className="row mb-3">
                    <div key={data.id} className="fs-3 m-3">
                      {data.CategoryName}
                    </div>
                    <hr />
                    {foodItem && (
                      foodItem
                        .filter(
                          (item) =>
                            item.CategoryName === data.CategoryName &&
                            item.name
                              .toLowerCase()
                              .includes(search.toLocaleLowerCase())
                        )
                        .map((filterItems) => {
                          return (
                            <div
                              key={filterItems._id}
                              className="col 12 col-md-6 col-lg-3"
                            >
                              <Card
                                foodItem={filterItems}
                                options={filterItems.options[0]}
                              ></Card>
                            </div>
                          );
                        })
                    ) }
                  </div>
                );
              })
  
        }
  
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
