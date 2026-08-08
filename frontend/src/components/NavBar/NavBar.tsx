import {
  Avatar,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  HoverCard,
  Image,
  Menu,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { memo } from "react";
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
import KFC from "/img/restaurant/kfc.jpg";

/**
 * Main Navigation bar of the app
 *
 * @remarks
 * - Sticks to the top
 * - Contains logo, current location, nav links and user menu
 * - Collapses to a burger menu on mobile
 *
 * @returns Navbar Component
 */

const NavBar = () => {
  const { removeUser } = useUser();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const { cart } = useCart();
  const [mobileMenuOpened, { open: openMobileMenu, close: closeMobileMenu }] =
    useDisclosure(false);

  const dispatch = useAppDispatch();

  const handleLogoutBtn = () => {
    removeUser();
    dispatch(clearAuth());
    closeMobileMenu();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please Login before continue");
      return;
    }
    navigate("/checkout");
    closeMobileMenu();
  };

  const theme = useMantineTheme();
  const avatarUrl = user?.avatarUrl;

  /**
   * @description Fetches current location of user
   */

  const { city, getLocation, loading, error } = useLocation();

  const handleLocationBtnClick = () => {
    getLocation();
  };

  /**
   * @description Handles Order Button Functionality
   */

  const handleOrderBtn = () => {
    navigate("/order");
    closeMobileMenu();
  };

  return (
    <header className={`${classes.header} section-mx`}>
      <Group justify="space-between" h="100%">
        <Group>
          <Link to="/">
            <Image src={Logo} className={classes.logo} />
          </Link>
          <Flex direction={"column"}>
            <Text>{city}</Text>
            <SubText
              className={classes.subText}
              style={{ cursor: "pointer" }}
              onClick={handleLocationBtnClick}
            >
              Wrong Location ?
            </SubText>
          </Flex>
          {loading && <Spinner />}
          {error && toast.error(error)}
        </Group>

        {/* Desktop nav links */}
        <Group h="100%" gap={0} visibleFrom="sm">
          <Link to="/" className={classes.link}>
            Home
          </Link>

          <HoverCard
            width={600}
            position="bottom"
            radius="md"
            shadow="md"
            withinPortal
          >
            <HoverCard.Target>
              <Box className={classes.link}>
                <Box component="span" mr={5}>
                  {cart.cartItems.length > 0 && (
                    <Text span c={theme.primaryColor}>
                      {" "}
                      {cart.cartItems.length}{" "}
                    </Text>
                  )}
                  Cart
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Box>
            </HoverCard.Target>

            <HoverCard.Dropdown style={{ overflow: "hidden" }}>
              {cart.cartItems.length === 0 && (
                <Box className={classes.dropdownFooter}>
                  <Text fw={500} fz="sm">
                    Cart Empty
                  </Text>
                  <SubText>
                    Good food is always cooking! Go ahead, order some yummy
                    items from the menu.
                  </SubText>
                </Box>
              )}
              {cart.cartItems.length > 0 && (
                <Box className={classes.dropdownFooter_sm}>
                  <Flex direction={"column"}>
                    <Flex justify={"space-between"} align="center" pb={theme.spacing.sm}>
                      <Image src={cart.selectedRestaurantImage || selectedRestaurant?.image || Logo} className={classes.img} radius="md" />
                      <Title order={5}>{cart.selectedRestaurantName}</Title>
                    </Flex>
                    <Divider p={theme.spacing.sm} />
                    <Stack>
                      {cart.cartItems.map((item, index) => {
                        return (
                          <Flex
                            key={index}
                            justify={"space-between"}
                            pb={theme.spacing.sm}
                          >
                            <Flex>
                              <Image
                                mx={6}
                                className={classes.icon}
                                src={item.is_veg ? IconNonVeg : IconVeg}
                              />
                              <Text>
                                {item.name} x {item.quantity}
                              </Text>
                            </Flex>
                            <Text>{item.price}</Text>
                          </Flex>
                        );
                      })}
                    </Stack>
                    <Divider p={theme.spacing.sm} />
                    <Flex justify={"space-between"}>
                      <Text fw={"var(--font-weight-bold)"}>SubTotal : </Text>
                      <Text fw={"var(--font-weight-bold)"}>{cart.totalPrice}</Text>
                    </Flex>
                    <Button onClick={handleCheckout}>CHECKOUT</Button>
                  </Flex>
                </Box>
              )}
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>

        {/* Desktop auth */}
        <Group visibleFrom="sm">
          {isAuthenticated ? (
            <>
              <Menu
                trigger="hover"
                openDelay={100}
                closeDelay={400}
                shadow="md"
                width={300}
              >
                <Menu.Target>
                  <Group onClick={handleOrderBtn}>
                    <Avatar size="sm" src={avatarUrl} alt="it's me" />
                    <Text fw={"var(--font-weight-semi-bold)"}>
                      {user?.name}
                    </Text>
                  </Group>
                </Menu.Target>
                <Menu.Dropdown
                  className={classes.dropdownMenu}
                  fw={"var(--font-weight-semi-bold)"}
                >
                  <Menu.Item onClick={handleOrderBtn}>Profile</Menu.Item>
                  <Menu.Item onClick={handleOrderBtn}>Orders</Menu.Item>
                  <Menu.Item onClick={handleLogoutBtn}>Logout</Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Button
                variant="subtle"
                onClick={() =>
                  (window.location.href =
                    "https://mern-dashboard-blond.vercel.app")
                }
              >
                Dashboard
              </Button>
            </>
          ) : (
            <LoginDrawer variant="default" title="Sign In" />
          )}
        </Group>

        {/* Mobile burger */}
        <Burger
          opened={mobileMenuOpened}
          onClick={openMobileMenu}
          hiddenFrom="sm"
          size="sm"
        />
      </Group>

      {/* Mobile slide-in drawer */}
      <Drawer
        opened={mobileMenuOpened}
        onClose={closeMobileMenu}
        position="right"
        size="xs"
        title={
          <Image src={Logo} className={classes.logo} />
        }
        padding="md"
      >
        <Stack gap="sm">
          <Link
            to="/"
            className={classes.mobileLink}
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          <Divider />

          {/* Mobile Cart summary */}
          <Box>
            <Text fw={700} mb="xs">
              Cart{" "}
              {cart.cartItems.length > 0 && (
                <Text span c={theme.primaryColor}>
                  ({cart.cartItems.length})
                </Text>
              )}
            </Text>
            {cart.cartItems.length === 0 ? (
              <SubText>Your cart is empty</SubText>
            ) : (
              <Stack gap="xs">
                {cart.cartItems.map((item, index) => (
                  <Flex key={index} justify="space-between">
                    <Text size="sm">
                      {item.name} x {item.quantity}
                    </Text>
                    <Text size="sm">₹{item.price}</Text>
                  </Flex>
                ))}
                <Flex justify="space-between" mt="xs">
                  <Text fw={700} size="sm">SubTotal:</Text>
                  <Text fw={700} size="sm">₹{cart.totalPrice}</Text>
                </Flex>
                <Button fullWidth onClick={handleCheckout} mt="xs">
                  CHECKOUT
                </Button>
              </Stack>
            )}
          </Box>

          <Divider />

          {/* Mobile auth */}
          {isAuthenticated ? (
            <Stack gap="xs">
              <Group>
                <Avatar size="sm" src={avatarUrl} alt="user" />
                <Text fw={600}>{user?.name}</Text>
              </Group>
              <Button variant="subtle" fullWidth onClick={handleOrderBtn}>
                Profile / Orders
              </Button>
              <Button
                variant="subtle"
                fullWidth
                onClick={() =>
                  (window.location.href =
                    "https://mern-dashboard-blond.vercel.app")
                }
              >
                Dashboard
              </Button>
              <Button variant="outline" fullWidth onClick={handleLogoutBtn}>
                Logout
              </Button>
            </Stack>
          ) : (
            <LoginDrawer variant="default" title="Sign In" />
          )}
        </Stack>
      </Drawer>
    </header>
  );
};

export default memo(NavBar);
