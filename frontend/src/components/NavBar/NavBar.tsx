import {
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Image,
  Menu,
  Stack,
  Text,
  Modal,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMapPin,
  IconSearch,
  IconShoppingCart,
  IconChevronDown,
  IconUser,
  IconLogout,
  IconReceipt,
  IconLayoutDashboard,
  IconX,
  IconBuildingStore,
  IconToolsKitchen2,
  IconCrosshair,
  IconCheck,
} from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useCart } from "../../hooks/useCart";
import { useLocation } from "../../hooks/useLocation";
import { useUser } from "../../hooks/useUser";
import { useGetAllRestaurantQuery } from "../../redux/slices/apiSlice";
import { clearAuth } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import { IRestaurant } from "../../types";
import LoginDrawer from "../Drawer/LoginDrawer";
import Spinner from "../Loader/Spinner";
import classes from "./NavBar.module.css";
import IconNonVeg from "/icons/non-veg-icon.png";
import IconVeg from "/icons/veg-icon.png";
import Logo from "/img/logo/LOGO-bgremove.png";

const NavBar = () => {
  const { removeUser } = useUser();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const { cart } = useCart();
  const [mobileMenuOpened, { open: openMobileMenu, close: closeMobileMenu }] =
    useDisclosure(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  // Fetch restaurants for live search suggestions
  const { data: allRestaurantsData } = useGetAllRestaurantQuery();
  const restaurants: IRestaurant[] = allRestaurantsData?.data || [];

  // Live search matching logic
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return { matchedRestaurants: [], matchedDishes: [] };

    const matchedRestaurants = restaurants.filter(
      (r) =>
        r.name?.toLowerCase().includes(query) ||
        r.cuisine?.some((c) => c.toLowerCase().includes(query)),
    ).slice(0, 4);

    const matchedDishes: any[] = [];
    restaurants.forEach((r) => {
      if (r.menu) {
        r.menu.forEach((item) => {
          if (
            item.name?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
          ) {
            matchedDishes.push({
              ...item,
              restaurantId: r._id,
              restaurantName: r.name,
              restaurantImage: r.image,
            });
          }
        });
      }
    });

    return {
      matchedRestaurants,
      matchedDishes: matchedDishes.slice(0, 5),
    };
  }, [searchTerm, restaurants]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchFocused(false);
    closeMobileMenu();
  };

  const handleLogoutBtn = () => {
    removeUser();
    dispatch(clearAuth());
    closeMobileMenu();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue");
      return;
    }
    navigate("/checkout");
    closeMobileMenu();
    setCartOpen(false);
  };

  const avatarUrl = user?.avatarUrl;
  const [locationModalOpened, { open: openLocationModal, close: closeLocationModal }] =
    useDisclosure(false);
  const [customCityInput, setCustomCityInput] = useState("");

  const { city, getLocation, loading, setCity } = useLocation();

  const POPULAR_CITIES = [
    "Hyderabad",
    "Bangalore",
    "Mumbai",
    "Delhi NCR",
    "Chennai",
    "Pune",
    "Kolkata",
  ];

  const handleSelectCity = (cityName: string) => {
    if (!cityName.trim()) return;
    setCity(cityName.trim());
    toast.success(`Location set to ${cityName.trim()}`);
    closeLocationModal();
    setCustomCityInput("");
  };

  const handleAutoDetectGPS = async () => {
    try {
      await getLocation();
      toast.success("Location auto-detected via GPS!");
      closeLocationModal();
    } catch (err: any) {
      toast.error(err || "Failed to detect GPS location.");
    }
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(customCityInput.trim().toLowerCase()),
  );

  const handleOrderBtn = () => {
    navigate("/order");
    closeMobileMenu();
  };

  const cartCount = cart.cartItems.length;
  const cartTotal = cart.totalPrice;

  return (
    <>
      {/* ─── Location Selector Modal ─── */}
      <Modal
        opened={locationModalOpened}
        onClose={closeLocationModal}
        title={
          <Group gap="xs">
            <IconMapPin size={20} color="#f97316" />
            <Text fw={700} size="lg" c="dark.8">
              Select Delivery Location
            </Text>
          </Group>
        }
        centered
        radius="lg"
        padding="lg"
      >
        <Stack gap="md">
          {/* Auto-detect GPS button */}
          <button
            type="button"
            className={classes.locationGpsBtn}
            onClick={handleAutoDetectGPS}
            disabled={loading}
          >
            <IconCrosshair size={18} />
            <span>{loading ? "Detecting location..." : "Use Current Location (GPS)"}</span>
            {loading && <Spinner />}
          </button>

          <Divider label="OR CHOOSE CITY" labelPosition="center" my="xs" />

          {/* Search / Custom City Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customCityInput.trim()) {
                handleSelectCity(customCityInput);
              }
            }}
          >
            <TextInput
              placeholder="Search or enter city name..."
              leftSection={<IconSearch size={16} color="#94a3b8" />}
              value={customCityInput}
              onChange={(e) => setCustomCityInput(e.target.value)}
              rightSection={
                customCityInput.trim() ? (
                  <Button
                    size="xs"
                    variant="filled"
                    color="orange"
                    onClick={() => handleSelectCity(customCityInput)}
                  >
                    Set
                  </Button>
                ) : null
              }
            />
          </form>

          {/* Popular Cities */}
          <Box>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>
              Popular Cities
            </Text>
            <div className={classes.popularCityChips}>
              {filteredCities.map((cityName) => {
                const isActive = city.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    type="button"
                    className={`${classes.popularCityChip} ${
                      isActive ? classes.cityChipActive : ""
                    }`}
                    onClick={() => handleSelectCity(cityName)}
                  >
                    {cityName} {isActive && <IconCheck size={12} style={{ marginLeft: 4 }} />}
                  </button>
                );
              })}
            </div>
          </Box>
        </Stack>
      </Modal>

      {/* ─── Sticky header ─── */}
      <header className={classes.header}>
        <div className={classes.inner}>
          {/* LEFT — Logo + Location */}
          <div className={classes.leftSection}>
            <Link to="/" className={classes.logoWrap}>
              <Image src={Logo} className={classes.logo} alt="Foodd" />
            </Link>

            <button
              className={classes.locationPill}
              onClick={openLocationModal}
              title="Select location"
            >
              <IconMapPin size={14} stroke={2.5} className={classes.locationIcon} />
              <span className={classes.locationCity}>{city || "Set location"}</span>
              <IconChevronDown size={12} stroke={2} className={classes.locationChev} />
              {loading && <Spinner />}
            </button>
          </div>

          {/* CENTER — Interactive Live Search Bar */}
          <div style={{ position: "relative", flex: 1, maxWidth: 540 }}>
            <form
              onSubmit={handleSearchSubmit}
              className={`${classes.searchWrap} ${
                searchFocused ? classes.searchFocused : ""
              }`}
            >
              <IconSearch size={16} className={classes.searchIcon} />
              <input
                className={classes.searchInput}
                placeholder="Search for restaurants, dishes, or cuisines…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className={classes.clearSearchBtn}
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  <IconX size={14} />
                </button>
              )}
            </form>

            {/* ── Live Search Overlay Dropdown ── */}
            {searchFocused && searchTerm.trim().length > 0 && (
              <div
                className={classes.searchDropdown}
                onMouseDown={(e) => e.preventDefault()} // prevent blur on click
              >
                {searchResults.matchedRestaurants.length === 0 &&
                searchResults.matchedDishes.length === 0 ? (
                  <Box p="md" ta="center">
                    <Text size="xs" c="dimmed">
                      No matching restaurants or dishes for "{searchTerm}"
                    </Text>
                  </Box>
                ) : (
                  <>
                    {/* Restaurants section */}
                    {searchResults.matchedRestaurants.length > 0 && (
                      <Box mb="xs">
                        <div className={classes.searchGroupTitle}>
                          <IconBuildingStore size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                          Restaurants ({searchResults.matchedRestaurants.length})
                        </div>
                        {searchResults.matchedRestaurants.map((r) => (
                          <div
                            key={r._id}
                            className={classes.searchItemRow}
                            onClick={() => {
                              navigate(`/restaurant/${r._id}`);
                              setSearchFocused(false);
                              setSearchTerm("");
                            }}
                          >
                            <img
                              src={r.image || Logo}
                              className={classes.searchItemImg}
                              alt={r.name}
                            />
                            <div className={classes.searchItemInfo}>
                              <div className={classes.searchItemTitle}>{r.name}</div>
                              <div className={classes.searchItemSub}>
                                ⭐ {r.rating || "4.2"} · {r.cuisine?.join(", ") || "Multi-cuisine"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </Box>
                    )}

                    {/* Dishes section */}
                    {searchResults.matchedDishes.length > 0 && (
                      <Box mb="xs">
                        <div className={classes.searchGroupTitle}>
                          <IconToolsKitchen2 size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                          Dishes ({searchResults.matchedDishes.length})
                        </div>
                        {searchResults.matchedDishes.map((dish) => (
                          <div
                            key={dish._id}
                            className={classes.searchItemRow}
                            onClick={() => {
                              navigate(`/restaurant/${dish.restaurantId}`);
                              setSearchFocused(false);
                              setSearchTerm("");
                            }}
                          >
                            <img
                              src={dish.img_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100"}
                              className={classes.searchItemImg}
                              alt={dish.name}
                            />
                            <div className={classes.searchItemInfo}>
                              <div className={classes.searchItemTitle}>
                                {dish.name} <span style={{ color: "#f97316", fontWeight: 700 }}>₹{dish.price}</span>
                              </div>
                              <div className={classes.searchItemSub}>
                                from {dish.restaurantName}
                              </div>
                            </div>
                          </div>
                        ))}
                      </Box>
                    )}

                    <button
                      className={classes.searchSeeAll}
                      onClick={() => handleSearchSubmit()}
                    >
                      See all results for "{searchTerm}" →
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Cart + Auth (desktop) */}
          <div className={classes.rightSection}>
            {/* Cart button with hover dropdown */}
            <div
              className={classes.cartWrap}
              onMouseEnter={() => setCartOpen(true)}
              onMouseLeave={() => setCartOpen(false)}
            >
              <button className={classes.cartBtn}>
                <IconShoppingCart size={20} stroke={1.8} />
                <span className={classes.cartLabel}>Cart</span>
                {cartCount > 0 && (
                  <span className={classes.cartBadge}>{cartCount}</span>
                )}
              </button>

              {/* Cart dropdown */}
              {cartOpen && (
                <div className={classes.cartDropdown}>
                  {cartCount === 0 ? (
                    <div className={classes.cartEmpty}>
                      <IconShoppingCart size={36} color="#cbd5e1" />
                      <Text size="sm" fw={600} mt="xs" c="#64748b">
                        Your cart is empty
                      </Text>
                      <Text size="xs" c="#94a3b8" ta="center" mt={4}>
                        Add items from a restaurant to get started
                      </Text>
                    </div>
                  ) : (
                    <>
                      <div className={classes.cartRestHeader}>
                        <Image
                          src={cart.selectedRestaurantImage || Logo}
                          className={classes.cartRestImg}
                          radius="md"
                          alt="restaurant"
                        />
                        <div>
                          <Text size="xs" c="#94a3b8" fw={600}>
                            Ordering from
                          </Text>
                          <Text size="sm" fw={700} c="#1e293b">
                            {cart.selectedRestaurantName || "Restaurant"}
                          </Text>
                        </div>
                      </div>
                      <Divider my={8} color="#f1f5f9" />
                      <div className={classes.cartItems}>
                        {cart.cartItems.map((item, i) => (
                          <div key={i} className={classes.cartItemRow}>
                            <div className={classes.cartItemLeft}>
                              <Image
                                src={item.is_veg ? IconVeg : IconNonVeg}
                                style={{ width: 14, height: 14 }}
                              />
                              <Text size="sm" c="#334155">
                                {item.name}
                                <Text span size="xs" c="#94a3b8">
                                  {" "}
                                  x{item.quantity}
                                </Text>
                              </Text>
                            </div>
                            <Text size="sm" fw={600} c="#334155">
                              ₹{item.price}
                            </Text>
                          </div>
                        ))}
                      </div>
                      <Divider my={8} color="#f1f5f9" />
                      <div className={classes.cartFooter}>
                        <div className={classes.cartTotal}>
                          <Text size="sm" c="#64748b">
                            Subtotal
                          </Text>
                          <Text size="sm" fw={700} c="#1e293b">
                            ₹{cartTotal}
                          </Text>
                        </div>
                        <button className={classes.checkoutBtn} onClick={handleCheckout}>
                          Checkout →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Auth */}
            <div className={classes.authSection}>
              {isAuthenticated ? (
                <Menu
                  trigger="hover"
                  openDelay={80}
                  closeDelay={300}
                  shadow="lg"
                  width={210}
                  position="bottom-end"
                  radius="md"
                >
                  <Menu.Target>
                    <button className={classes.userBtn}>
                      <Avatar
                        size={32}
                        src={avatarUrl}
                        radius="xl"
                        className={classes.userAvatar}
                      >
                        <IconUser size={16} />
                      </Avatar>
                      <span className={classes.userName}>{user?.name?.split(" ")[0]}</span>
                      <IconChevronDown size={12} stroke={2} color="#64748b" />
                    </button>
                  </Menu.Target>
                  <Menu.Dropdown className={classes.userDropdown}>
                    <div className={classes.userDropdownHeader}>
                      <Avatar size={40} src={avatarUrl} radius="xl">
                        <IconUser size={20} />
                      </Avatar>
                      <div>
                        <Text size="sm" fw={700} c="#1e293b">{user?.name}</Text>
                        <Text size="xs" c="#94a3b8">{user?.email || "Manage account"}</Text>
                      </div>
                    </div>
                    <Divider my={8} color="#f1f5f9" />
                    <Menu.Item
                      leftSection={<IconUser size={16} />}
                      onClick={() => navigate("/my-account")}
                      className={classes.menuItem}
                    >
                      Profile Settings
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconReceipt size={16} />}
                      onClick={handleOrderBtn}
                      className={classes.menuItem}
                    >
                      My Orders
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconLayoutDashboard size={16} />}
                      onClick={() => (window.location.href = "https://mern-dashboard-blond.vercel.app")}
                      className={classes.menuItem}
                    >
                      Dashboard
                    </Menu.Item>
                    <Divider my={8} color="#f1f5f9" />
                    <Menu.Item
                      leftSection={<IconLogout size={16} />}
                      onClick={handleLogoutBtn}
                      className={classes.menuItemDanger}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <LoginDrawer variant="default" title="Sign In" />
              )}
            </div>

            {/* Mobile burger */}
            <Burger
              opened={mobileMenuOpened}
              onClick={openMobileMenu}
              hiddenFrom="md"
              size="sm"
              className={classes.burger}
            />
          </div>
        </div>
      </header>

      {/* ─── Mobile drawer ─── */}
      <Drawer
        opened={mobileMenuOpened}
        onClose={closeMobileMenu}
        position="right"
        size="xs"
        title={<Image src={Logo} className={classes.logo} alt="Foodd" />}
        padding="md"
        radius="lg"
        overlayProps={{ backgroundOpacity: 0.4, blur: 8 }}
        styles={{
          content: {
            borderRadius: "20px 0 0 20px",
          },
        }}
      >
        <Stack gap="sm">
          {/* Location in drawer */}
          <button
            className={classes.locationPillMobile}
            onClick={() => {
              closeMobileMenu();
              openLocationModal();
            }}
          >
            <IconMapPin size={14} color="#f97316" />
            <span>{city || "Set location"}</span>
            <IconChevronDown size={12} style={{ marginLeft: "auto", color: "#94a3b8" }} />
          </button>

          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className={classes.mobileSearchWrap}>
            <IconSearch size={15} className={classes.searchIcon} />
            <input
              className={classes.mobileSearchInput}
              placeholder="Search restaurants, food…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className={classes.clearSearchBtn}
                onClick={() => setSearchTerm("")}
              >
                <IconX size={14} />
              </button>
            )}
          </form>

          <Divider />

          <Link to="/" className={classes.mobileLink} onClick={closeMobileMenu}>
            Home
          </Link>

          <Divider />

          {/* Mobile Cart */}
          <Box>
            <Text fw={700} mb="xs" size="sm">
              Cart{" "}
              {cartCount > 0 && (
                <Text span c="orange">({cartCount})</Text>
              )}
            </Text>
            {cartCount === 0 ? (
              <Text size="xs" c="dimmed">Your cart is empty</Text>
            ) : (
              <Stack gap="xs">
                {cart.cartItems.map((item, i) => (
                  <Flex key={i} justify="space-between">
                    <Text size="sm">{item.name} x{item.quantity}</Text>
                    <Text size="sm" fw={600}>₹{item.price}</Text>
                  </Flex>
                ))}
                <Flex justify="space-between" mt="xs">
                  <Text fw={700} size="sm">Subtotal</Text>
                  <Text fw={700} size="sm">₹{cartTotal}</Text>
                </Flex>
                <Button fullWidth onClick={handleCheckout} mt="xs" radius="md">
                  Checkout
                </Button>
              </Stack>
            )}
          </Box>

          <Divider />

          {/* Mobile Auth */}
          {isAuthenticated ? (
            <Stack gap="xs">
              <Group
                onClick={() => {
                  navigate("/my-account");
                  closeMobileMenu();
                }}
                style={{ cursor: "pointer" }}
              >
                <Avatar size="sm" src={avatarUrl} radius="xl">
                  <IconUser size={14} />
                </Avatar>
                <Text fw={600} size="sm">Settings</Text>
              </Group>
              <Button
                variant="subtle"
                fullWidth
                onClick={() => (window.location.href = "https://mern-dashboard-blond.vercel.app")}
                radius="md"
              >
                Dashboard
              </Button>
              <Button variant="outline" color="red" fullWidth onClick={handleLogoutBtn} radius="md">
                Logout
              </Button>
            </Stack>
          ) : (
            <LoginDrawer variant="default" title="Sign In" />
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export default memo(NavBar);
