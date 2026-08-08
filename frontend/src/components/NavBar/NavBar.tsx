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
  Title,
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
} from "@tabler/icons-react";
import { memo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useCart } from "../../hooks/useCart";
import { useLocation } from "../../hooks/useLocation";
import { useUser } from "../../hooks/useUser";
import { clearAuth } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import LoginDrawer from "../Drawer/LoginDrawer";
import Spinner from "../Loader/Spinner";
import { SubText } from "../Mantine/Subtext/SubText";
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
  const dispatch = useAppDispatch();

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
  const { city, getLocation, loading, error } = useLocation();

  const handleOrderBtn = () => {
    navigate("/order");
    closeMobileMenu();
  };

  const cartCount = cart.cartItems.length;
  const cartTotal = cart.totalPrice;

  return (
    <>
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
              onClick={getLocation}
              title="Update location"
            >
              <IconMapPin size={14} stroke={2.5} className={classes.locationIcon} />
              <span className={classes.locationCity}>{city || "Set location"}</span>
              <IconChevronDown size={12} stroke={2} className={classes.locationChev} />
              {loading && <Spinner />}
            </button>
            {error && toast.error(error)}
          </div>

          {/* CENTER — Search */}
          <div className={`${classes.searchWrap} ${searchFocused ? classes.searchFocused : ""}`}>
            <IconSearch size={16} className={classes.searchIcon} />
            <input
              className={classes.searchInput}
              placeholder="Search for restaurants, food…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
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
                      <Text size="sm" fw={600} mt="xs" c="#64748b">Your cart is empty</Text>
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
                          <Text size="xs" c="#94a3b8" fw={600}>Ordering from</Text>
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
                                <Text span size="xs" c="#94a3b8"> x{item.quantity}</Text>
                              </Text>
                            </div>
                            <Text size="sm" fw={600} c="#334155">₹{item.price}</Text>
                          </div>
                        ))}
                      </div>
                      <Divider my={8} color="#f1f5f9" />
                      <div className={classes.cartFooter}>
                        <div className={classes.cartTotal}>
                          <Text size="sm" c="#64748b">Subtotal</Text>
                          <Text size="sm" fw={700} c="#1e293b">₹{cartTotal}</Text>
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
              hiddenFrom="sm"
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
      >
        <Stack gap="sm">
          {/* Location in drawer */}
          <button className={classes.locationPillMobile} onClick={getLocation}>
            <IconMapPin size={14} />
            <span>{city || "Set location"}</span>
          </button>

          {/* Mobile search */}
          <div className={classes.mobileSearchWrap}>
            <IconSearch size={15} className={classes.searchIcon} />
            <input
              className={classes.mobileSearchInput}
              placeholder="Search restaurants, food…"
            />
          </div>

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
              <SubText>Your cart is empty</SubText>
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
              <Group>
                <Avatar size="sm" src={avatarUrl} radius="xl">
                  <IconUser size={14} />
                </Avatar>
                <Text fw={600} size="sm">{user?.name}</Text>
              </Group>
              <Button variant="subtle" fullWidth onClick={handleOrderBtn} radius="md">
                My Orders
              </Button>
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
