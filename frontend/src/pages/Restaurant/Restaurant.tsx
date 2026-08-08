import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Text,
} from "@mantine/core";
import { IconBike, IconClock, IconMapPin, IconSearch, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useGetRestaurantByIdQuery } from "../../redux/slices/apiSlice";
import { IFoodItem, IRestaurant } from "../../types";
import MenuCard from "../../components/Cards/MenuCard/MenuCard";
import CustomCarousel from "../../components/Carousel/Carousel";
import classes from "./Restaurant.module.css";

const MOCK_COUPONS = [
  { icon: "🎉", code: "FOODD50", title: "50% OFF up to ₹100", desc: "On orders above ₹199", expiry: "31 Dec 2025" },
  { icon: "🚚", code: "FREEDEL", title: "Free Delivery", desc: "On your next 3 orders", expiry: "15 Jan 2026" },
  { icon: "⚡", code: "FAST20", title: "20% OFF", desc: "On Express delivery orders", expiry: "31 Dec 2025" },
];

interface ICategoryGroup {
  category: string;
  items: IFoodItem[];
}

function groupMenuByCategory(apiData: IRestaurant): ICategoryGroup[] {
  if (!apiData?.menu) return [];
  return apiData.menu.reduce<ICategoryGroup[]>((acc, item) => {
    let group = acc.find((g) => g.category === item.category);
    if (!group) {
      group = { category: item.category, items: [] };
      acc.push(group);
    }
    group.items.push({
      _id: item._id,
      restaurantId: apiData._id,
      name: item.name,
      restaurantName: apiData.name,
      description: item.description || "",
      price: item.price,
      img_url: item.img_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
      rating: item.rating || 4.2,
      is_veg: item.is_veg,
      options: item.options || [],
      category: item.category,
    });
    return acc;
  }, []);
}

const Restaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [menuSearch, setMenuSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  if (!id) return <Text>Restaurant not found</Text>;

  const { data: restaurantData, isLoading } = useGetRestaurantByIdQuery(id);
  const restaurant = restaurantData?.data;

  const groupedMenu = useMemo(
    () => (restaurant ? groupMenuByCategory(restaurant) : []),
    [restaurant],
  );

  const categories = ["All", ...groupedMenu.map((g) => g.category)];

  const filteredMenu = useMemo(() => {
    return groupedMenu
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const matchSearch = !menuSearch || item.name.toLowerCase().includes(menuSearch.toLowerCase());
          const matchCat = activeCategory === "All" || group.category === activeCategory;
          return matchSearch && matchCat;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupedMenu, menuSearch, activeCategory]);

  // Restaurant cover image - fallback to Unsplash food if no image
  const coverImage =
    restaurant?.image ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop";

  const totalCartItems = cart.totalItems;

  return (
    <div className={classes.page}>
      {/* ─── Hero Cover Image ─── */}
      <div className={classes.heroWrap}>
        <img src={coverImage} alt={restaurant?.name} className={classes.heroImg} />
        <div className={classes.heroOverlay} />
      </div>

      {/* ─── Info Card floating over hero ─── */}
      <div className={classes.section_m}>
        <div className={classes.infoCard}>
          {/* Top row: name + open badge */}
          <div className={classes.infoTop}>
            <div style={{ flex: 1 }}>
              {isLoading ? (
                <div style={{ height: 36, width: "60%", borderRadius: 8, background: "#f1f5f9", marginBottom: 8 }} />
              ) : (
                <h1 className={classes.infoTitle}>{restaurant?.name || "Restaurant"}</h1>
              )}

              {/* Rating + price */}
              <Flex align="center" gap={4} wrap="wrap" mb={8}>
                <span className={classes.ratingBadge}>
                  <IconStarFilled size={12} />
                  {restaurant?.rating || "4.2"}
                </span>
                <span className={classes.ratingDetails}>(7.1K+ ratings)</span>
                {restaurant?.priceRange && (
                  <span className={classes.priceBadge}>
                    · {restaurant.priceRange} for two
                  </span>
                )}
              </Flex>

              {/* Cuisine tags */}
              <div className={classes.cuisineTags}>
                {(restaurant?.cuisine || ["Biryani", "North Indian", "Mughlai"]).map((c, i) => (
                  <span key={i} className={classes.cuisineTag}>{c}</span>
                ))}
              </div>
            </div>

            {/* Open status pill */}
            <Badge
              color="green"
              variant="light"
              size="md"
              style={{ flexShrink: 0, alignSelf: "flex-start" }}
            >
              Open Now
            </Badge>
          </div>

          {/* Meta row */}
          <div className={classes.metaRow}>
            <div className={classes.metaItem}>
              <span className={classes.metaValue}>
                <IconClock size={14} style={{ verticalAlign: "middle", marginRight: 3 }} />
                {restaurant?.deliveryTime || "30-40"}
              </span>
              <span className={classes.metaLabel}>Delivery</span>
            </div>
            <div className={classes.metaDivider} />
            <div className={classes.metaItem}>
              <span className={classes.metaValue}>
                <IconBike size={14} style={{ verticalAlign: "middle", marginRight: 3 }} />
                ₹{Math.random() > 0.5 ? "0" : "30"}
              </span>
              <span className={classes.metaLabel}>Del. Fee</span>
            </div>
            <div className={classes.metaDivider} />
            <div className={classes.metaItem}>
              <span className={classes.metaValue}>
                <IconStar size={14} style={{ verticalAlign: "middle", marginRight: 3 }} />
                {restaurant?.rating || "4.2"}
              </span>
              <span className={classes.metaLabel}>Rating</span>
            </div>
            <div className={classes.metaDivider} />
            <div className={classes.metaItem}>
              <span className={classes.metaValue}>
                <IconMapPin size={14} style={{ verticalAlign: "middle", marginRight: 3 }} />
                {restaurant?.location?.area || "Hyderabad"}
              </span>
              <span className={classes.metaLabel}>Outlet</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Coupon Deals Carousel ─── */}
      <div className={classes.section_m} style={{ marginTop: "1.5rem" }}>
        <CustomCarousel
          title="Deals for you"
          slideSize={{ base: "85%", sm: "48%", md: "33%" }}
          slideGap="md"
          align="start"
          slidesToScroll={1}
        >
          {MOCK_COUPONS.map((coupon, i) => (
            <Carousel.Slide key={i}>
              <div className={classes.couponCard}>
                <span className={classes.couponIcon}>{coupon.icon}</span>
                <div>
                  <div className={classes.couponCode}>{coupon.code}</div>
                  <div className={classes.couponTitle}>{coupon.title}</div>
                  <div className={classes.couponDesc}>{coupon.desc} · Valid till {coupon.expiry}</div>
                </div>
              </div>
            </Carousel.Slide>
          ))}
        </CustomCarousel>
      </div>

      <Divider my="xl" className={classes.section_m} style={{ borderColor: "#e2e8f0" }} />

      {/* ─── Menu Section ─── */}
      <div className={`${classes.section_m} ${classes.menuSection}`}>
        {/* Menu header */}
        <div className={classes.menuHeader}>
          <div className={classes.menuDividerLine} />
          <span className={classes.menuLabel}>MENU</span>
          <div className={classes.menuDividerLineRight} />
        </div>

        {/* Search + Category filters */}
        <Flex gap="md" align="center" wrap="wrap" mb="md">
          <div className={classes.menuSearchBar}>
            <IconSearch size={16} color="#94a3b8" />
            <input
              className={classes.menuSearchInput}
              placeholder="Search for dishes..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
            />
          </div>
        </Flex>

        {/* Category pills */}
        <div className={classes.categoryPills}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${classes.categoryPill} ${activeCategory === cat ? classes.active : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <Accordion>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 64,
                  borderRadius: 16,
                  background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                  marginBottom: 12,
                }}
              />
            ))}
          </Accordion>
        )}

        {/* Empty search state */}
        {!isLoading && filteredMenu.length === 0 && (
          <Box style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🍽️</div>
            <Text fw={700} size="lg" c="#0f172a" mb={4}>No dishes found</Text>
            <Text size="sm" c="dimmed">Try a different search term or category</Text>
            <Button
              mt="md"
              variant="light"
              color="orange"
              onClick={() => { setMenuSearch(""); setActiveCategory("All"); }}
            >
              Clear filters
            </Button>
          </Box>
        )}

        {/* Accordion menu */}
        {!isLoading && filteredMenu.length > 0 && (
          <Accordion
            variant="separated"
            radius="lg"
            defaultValue={filteredMenu[0]?.category}
            styles={{
              item: {
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                marginBottom: 12,
                background: "#ffffff",
                overflow: "hidden",
              },
              control: {
                padding: "1rem 1.25rem",
                background: "#ffffff",
              },
              panel: {
                padding: "0 1.25rem",
                background: "#ffffff",
              },
              label: {
                fontWeight: 800,
                fontSize: "1rem",
                color: "#0f172a",
                letterSpacing: "-0.02em",
              },
            }}
          >
            {filteredMenu.map((group) => (
              <Accordion.Item key={group.category} value={group.category}>
                <Accordion.Control>
                  <Flex align="center" gap={8}>
                    <span>{group.category}</span>
                    <span className={classes.categoryCount}>({group.items.length})</span>
                  </Flex>
                </Accordion.Control>
                {group.items.map((food) => (
                  <Accordion.Panel key={food._id}>
                    <MenuCard foodItem={food} />
                  </Accordion.Panel>
                ))}
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </div>

      {/* ─── Sticky Cart Bar ─── */}
      {totalCartItems > 0 && (
        <div className={classes.stickyCart}>
          <div className={classes.stickyCartInner} onClick={() => navigate("/checkout")}>
            <div>
              <div className={classes.stickyCartCount}>{totalCartItems} item{totalCartItems > 1 ? "s" : ""}</div>
              <div className={classes.stickyCartName}>{cart.selectedRestaurantName}</div>
            </div>
            <button className={classes.stickyCartBtn}>
              View Cart · ₹{cart.totalPrice} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
