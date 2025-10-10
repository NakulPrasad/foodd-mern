import {
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import AddressCard from "../../components/Cards/AddressCard/AddressCard";
import CheckoutCard from "../../components/Cards/CheckoutCard/CheckoutCard";
import { useCart } from "../../hooks/useCart";
import classes from "./Checkout.module.css";
import IconVeg from "/icons/veg-icon.png";
import RestrauntLogo from "/img/restaurant/pizzahut.jpg";

const Checkout = () => {
  // const {cartItems} = useSelector((state: RootState) => state.cart)
  const { cart } = useCart();
  // toast.info(cartItems);
  // console.log("Checkout Items", cartItems, cart.selectedRestaurantName, cart.price);
  const [deliveryFee, setDeliveryFee] = useState(cart.totalPrice > 200 ? 0 : 30);
  const [tax, setTax] = useState(cart.totalPrice * 0.18);

  

  const handleProceeedToPay = () => {
    console.log("Cart Items", cart.cartItems);
  };
  return (
    <section id="checkout" className={classes.section}>
      <Grid justify="space-between" className={classes.rootGrid}>
        <Grid.Col
          span={{ base: 12, md: 8, lg: 8 }}
          className={classes.gridColumn}
        >
          <Container>
            <Title order={3}>Choose a deliver address</Title>
            <Title order={5}>Multiple addresses in this location</Title>
          </Container>
          <SimpleGrid cols={2} className={classes.addressGrid}>
            <AddressCard />
            <AddressCard />
            <AddressCard />
            <AddressCard />
          </SimpleGrid>
          <Flex justify={"center"}>
            <Button onClick={handleProceeedToPay} className={classes.payButton}>
              Proceed To Pay
            </Button>
          </Flex>
        </Grid.Col>
        {/* Second Column - Items */}
        <Grid.Col
          span={{ base: 12, md: 5.5, lg: 3.5 }}
          className={classes.gridColumn}
        >
          <Stack>
            <Flex align={"center"} justify={"start"}>
              <Image src={RestrauntLogo} className={classes.restaurantLogo} />

              <Flex direction={"column"}>
                <Title order={3}>{cart.selectedRestaurantName}</Title>
                <Title order={5}>Hyderabad</Title>
              </Flex>
            </Flex>
              {cart.cartItems.map((item) => (
                <CheckoutCard item={item} />
              ))}
            <Flex className={classes.infomsg}>
              <Checkbox />
              <Stack>
                <Title order={5}>Opt in for No-contact Delivery</Title>
                <Text>
                  Unwell, or avoiding contact? Please select no-contact
                  delivery. Partner will safely place the order outside your
                  door (not for COD)
                </Text>
              </Stack>
            </Flex>

            <Group>
              <Image src={IconVeg} className={"foodIcon"} />
              <Text>Apply Coupon</Text>
            </Group>
            <Title order={4}>Bill Details</Title>
            <Group justify="space-between">
              <Text>Item Total</Text>
              <Text>{cart.totalPrice}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Delivery Fee</Text>
              <Text>{deliveryFee}</Text>
            </Group>
            <Group justify="space-between">
              <Text>GST & Other Charges</Text>
              <Text>{tax}</Text>
            </Group>
            <Group justify="space-between">
              <Title order={5}>Total</Title>
              <Title order={5}>{cart.totalPrice + deliveryFee + tax}</Title>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </section>
  );
};

export default Checkout;
