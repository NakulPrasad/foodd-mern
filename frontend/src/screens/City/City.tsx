import { Carousel } from "@mantine/carousel";
import { Divider, SimpleGrid, Text } from "@mantine/core";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CollectionCard from "../../components/Cards/CollectionCard/CollectionCard";
import RestaurantCard from "../../components/Cards/RestaurantCard/RestaurantCard";
import CustomCarousel from "../../components/Carousel/Carousel";
import { useLocation } from "../../hooks/useLocation";
import { useRestaurant } from "../../hooks/useRestaurant";
import { IRestaurant } from "../../types";
import classes from "./City.module.css";
import Biryani from "/img/foodCategory/biryani.png";
import Burger from "/img/foodCategory/burger.png";
import Chinese from "/img/foodCategory/chinese.png";
import Shawarma from "/img/foodCategory/shawarma.png";
import CityHeader from "/img/homepage/city_header.png";

const CATEGORIES = [
  { image: Biryani, label: "Biryani" },
  { image: Burger, label: "Burgers" },
  { image: Chinese, label: "Chinese" },
  { image: Shawarma, label: "Shawarma" },
  { image: Biryani, label: "Pizza" },
  { image: Burger, label: "Wraps" },
  { image: Chinese, label: "Desserts" },
  { image: Shawarma, label: "Thali" },
];

const CUISINE_CARDS = [
  { emoji: "🍗", name: "Biryani", count: "32 restaurants" },
  { emoji: "🍔", name: "Burgers", count: "18 restaurants" },
  { emoji: "🍕", name: "Pizza", count: "24 restaurants" },
  { emoji: "🥗", name: "Healthy", count: "14 restaurants" },
  { emoji: "🍜", name: "Chinese", count: "21 restaurants" },
  { emoji: "🌮", name: "Wraps", count: "11 restaurants" },
  { emoji: "🍰", name: "Desserts", count: "9 restaurants" },
  { emoji: "🍱", name: "Thali", count: "16 restaurants" },
];

const FILTER_TABS = ["All", "Fast Delivery", "Veg Only", "Rating 4+", "Under ₹200", "Offers", "Trending"];

const City = () => {
  const { city } = useLocation();
  const { allRestaurantJson, isLoading, error } = useRestaurant();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    if (error) {
      toast.warn("Something went wrong");
    }
  }, [error]);

  const restaurants: IRestaurant[] = allRestaurantJson?.data || [];

  const filteredRestaurants = restaurants.filter((r) => {
    if (searchQuery) {
      return (
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (activeFilter === "Veg Only") return true; // would filter by veg flag
    if (activeFilter === "Rating 4+") return (r.rating || 0) >= 4;
    return true;
  });

  return (
    <section id="city">
      {/* ─── Hero Banner ─── */}
      <header id="banner" className={classes.hero}>
        <div className={classes.heroInner}>
          <div className={classes.heroText}>
            <div className={classes.heroBadge}>
              🔥 Fresh & Fast
            </div>
            <h1 className={classes.heroTitle}>
              Order Food<br />
              Online in <span>{city}</span>
            </h1>
            <p className={classes.heroSubtitle}>
              From your favourite restaurants, delivered hot and fast to your door.
            </p>

            {/* Inline search */}
            <div className={classes.searchBar}>
              <IconSearch size={18} color="#94a3b8" />
              <input
                className={classes.searchInput}
                placeholder={`Search "${city}" restaurants or cuisines...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={classes.searchBtn}>Search</button>
            </div>

            {/* Stats strip */}
            <div className={classes.heroStats}>
              <div className={classes.heroStat}>
                <div className={classes.heroStatNum}>5,000+</div>
                <div className={classes.heroStatLabel}>Restaurants</div>
              </div>
              <div className={classes.heroStat}>
                <div className={classes.heroStatNum}>30 min</div>
                <div className={classes.heroStatLabel}>Avg. Delivery</div>
              </div>
              <div className={classes.heroStat}>
                <div className={classes.heroStatNum}>4.8 ⭐</div>
                <div className={classes.heroStatLabel}>App Rating</div>
              </div>
            </div>
          </div>

          <img src={CityHeader} alt="Foodd delivery" className={classes.heroImage} />
        </div>
      </header>

      {/* ─── Promo Banner Strip ─── */}
      <div className={classes.promoBanner}>
        <div className={`${classes.promoCard} ${classes.free}`}>
          <span className={classes.promoIcon}>🆓</span>
          <div>
            <div className={classes.promoTitle}>Free Delivery</div>
            <div className={classes.promoDesc}>On your first 5 orders</div>
          </div>
        </div>
        <div className={`${classes.promoCard} ${classes.discount}`}>
          <span className={classes.promoIcon}>🎉</span>
          <div>
            <div className={classes.promoTitle}>50% OFF up to ₹100</div>
            <div className={classes.promoDesc}>Use code FOODD50</div>
          </div>
        </div>
        <div className={`${classes.promoCard} ${classes.fast}`}>
          <span className={classes.promoIcon}>⚡</span>
          <div>
            <div className={classes.promoTitle}>Express Delivery</div>
            <div className={classes.promoDesc}>Orders in under 20 mins</div>
          </div>
        </div>
      </div>

      {/* ─── What's on your mind? ─── */}
      <section id="suggestions" className={classes.section_m}>
        <div className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>What's on your mind?</h2>
          <button className={classes.seeAllBtn}>See all →</button>
        </div>
        <CustomCarousel
          slideSize={{ base: "22%", xs: "16%", sm: "13%", md: "10%" }}
          slideGap="md"
          align="start"
          slidesToScroll={3}
        >
          {CATEGORIES.map((cat, i) => (
            <Carousel.Slide key={i}>
              <CollectionCard image={cat.image} label={cat.label} />
            </Carousel.Slide>
          ))}
        </CustomCarousel>
      </section>

      {/* ─── Top Restaurant Chains ─── */}
      <section id="topbrands" className={classes.section_m}>
        <CustomCarousel
          title={`Top restaurant chains in ${city}`}
          slideSize={{ base: "78%", sm: "46%", md: "30%" }}
          slideGap={{ base: "md", md: "lg" }}
          align="start"
          slidesToScroll={1}
        >
          {restaurants.map((restaurant) => (
            <Carousel.Slide key={restaurant._id}>
              <RestaurantCard restaurant={restaurant} />
            </Carousel.Slide>
          ))}
        </CustomCarousel>
      </section>

      <Divider className={classes.divider} />

      {/* ─── Explore Cuisines ─── */}
      <section id="cuisines" className={classes.section_m}>
        <div className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>Explore by Cuisine</h2>
          <button className={classes.seeAllBtn}>View all cuisines →</button>
        </div>
        <div className={classes.cuisineCards}>
          {CUISINE_CARDS.map((c, i) => (
            <div
              key={i}
              className={classes.cuisineCard}
              onClick={() => setSearchQuery(c.name)}
            >
              <div className={classes.cuisineCardEmoji}>{c.emoji}</div>
              <div className={classes.cuisineCardName}>{c.name}</div>
              <div className={classes.cuisineCardCount}>{c.count}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider className={classes.divider} />

      {/* ─── All Restaurants ─── */}
      <section id="restaurants" className={classes.section_m}>
        <div className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : `Restaurants with online delivery in ${city}`}
          </h2>
          {searchQuery && (
            <button className={classes.seeAllBtn} onClick={() => setSearchQuery("")}>
              Clear ✕
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className={classes.filterTabs}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              className={`${classes.filterTab} ${activeFilter === tab ? classes.active : ""}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Skeleton / Loading */}
        {isLoading && (
          <div className={classes.restaurantGrid}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 280,
                  borderRadius: 16,
                  background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>😕</div>
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Couldn't load restaurants</div>
            <div style={{ fontSize: 14 }}>Check your connection and try again</div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredRestaurants.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🍽️</div>
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>No restaurants found</div>
            <div style={{ fontSize: 14 }}>Try a different filter or search term</div>
          </div>
        )}

        {!isLoading && filteredRestaurants.length > 0 && (
          <SimpleGrid
            cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: "md", md: "lg" }}
          >
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard restaurant={restaurant} key={restaurant._id} />
            ))}
          </SimpleGrid>
        )}
      </section>

      {/* ─── App Download CTA ─── */}
      <div className={classes.appPromo}>
        <div className={classes.appPromoInner}>
          <div className={classes.appPromoText}>
            <h2>Order smarter with the Foodd App</h2>
            <p>Exclusive app-only deals, live order tracking, and loyalty points on every order.</p>
            <div className={classes.appStoreBtns}>
              <button className={classes.storeBtn}>
                🍎 App Store
              </button>
              <button className={classes.storeBtn}>
                🤖 Google Play
              </button>
            </div>
          </div>
          <div className={classes.appPromoEmojis}>📱🍕🛵</div>
        </div>
      </div>
    </section>
  );
};

export default City;
