import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  HoverCard,
  Image,
  Menu,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useCart } from "../../hooks/useCart";
import { useLocation } from "../../hooks/useLocation";
import { clearAuth } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import LoginDrawer from "../Drawer/LoginDrawer";
import Spinner from "../Loader/Spinner";
import { SubText } from "../Mantine/Subtext/SubText";
import classes from "./NavBar.module.css";
import IconNonVeg from "/icons/non-veg-icon.png";
import IconVeg from "/icons/veg-icon.png";
import Logo from "/img/LOGO-bgremove.png";
import KFC from "/img/kfc.jpg";

const NavBar = () => {
  const { removeUser } = useUser();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const { cartItems } = useAppSelector((state: RootState) => state.cart);
  const { currentRestaurant, cart } = useCart();

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    removeUser();
    dispatch(clearAuth());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please Login before continue");
      return;
    }
    
    navigate("/checkout");
  };

  const theme = useMantineTheme();
  const avatarUrl = user?.avatarUrl;
  // console.log(avatarUrl);

  /**
   * @description Fetches current location of user
   */

  const { city, getLocation, loading } = useLocation();
  const handleLocationBtnClick = () => {
    // console.log("LocationButtonClik");
    getLocation();
    toast.success("Fetching Location");
  };

  return (
    <Box>
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
          </Group>

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
                {/* <Link to="/checkout" className={classes.link} onClick={handleCartClick}> */}
                <Box className={classes.link}>
                  <Box component="span" mr={5}>
                    {cartItems.length > 0 && (
                      <Text span c={theme.primaryColor}>
                        {" "}
                        {cartItems.length}{" "}
                      </Text>
                    )}
                    Cart
                  </Box>
                  <IconChevronDown size={16} color={theme.colors.blue[6]} />
                </Box>
                {/* </Link> */}
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                {cartItems.length === 0 && (
                  <Box className={classes.dropdownFooter}>
                    <Text fw={500} fz="sm">
                      Cart Empty
                    </Text>
                    <Text size="xs" c="dimmed">
                      Good food is always cooking! Go ahead, order some yummy
                      items from the menu.
                    </Text>
                  </Box>
                )}
                {cartItems.length > 0 && (
                  <Box className={classes.dropdownFooter_sm}>
                    <Flex direction={"column"}>
                      <Flex justify={"space-between"} pb={theme.spacing.sm}>
                        <Image src={KFC} className={classes.img} />
                        {/* <Text>{currentRestaurant}</Text> */}
                        <Text>Pizza Hut</Text>
                      </Flex>
                      <Divider p={theme.spacing.sm} />
                      <Flex direction={"column"}>
                        {cartItems.map((item) => {
                          return (
                            <Flex
                              key={item.id}
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
                      </Flex>
                      <Divider p={theme.spacing.sm} />
                      <Flex justify={"space-between"}>
                        <Text fw={700}>SubTotal : </Text>
                        <Text fw={700}>{cart.price}</Text>
                      </Flex>
                        <Button onClick={handleCheckout}>CHECKOUT</Button>
                    </Flex>
                  </Box>
                )}
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>

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
                  <Avatar size="sm" src={avatarUrl} alt="it's me" />
                  <Menu.Target>
                    <Text fw={600}>{user?.name}</Text>
                  </Menu.Target>
                  <Menu.Dropdown className={classes.dropdownMenu} fw={600}>
                    <Menu.Item onClick={() => navigate("/my-account")}>
                      Profile
                    </Menu.Item>
                    <Menu.Item>Orders</Menu.Item>
                    <Menu.Item>Logout</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <Button
                  onClick={() =>
                    (window.location.href =
                      "https://mern-dashboard-blond.vercel.app")
                  }
                >
                  Dashboard
                </Button>
                <Button onClick={handleLogout}>Sign Out</Button>
              </>
            ) : (
              <LoginDrawer variant="default" title="Sign In" />
            )}
          </Group>
        </Group>
      </header>
    </Box>
  );
};

export default memo(NavBar);
