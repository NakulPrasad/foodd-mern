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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddressCard from "../../components/Cards/AddressCard/AddressCard";
import CheckoutCard from "../../components/Cards/CheckoutCard/CheckoutCard";
import { useCart } from "../../hooks/useCart";
import { usePostOrderMutation } from "../../redux/slices/apiSlice";
import classes from "./Checkout.module.css";
import IconVeg from "/icons/veg-icon.png";
import RestrauntLogo from "/img/restaurant/pizzahut.jpg";

// Saved addresses — in a real app these come from the user's profile API
const SAVED_ADDRESSES = [
  {
    label: "Home",
    address: "Flat 302, Green Valley Apartments, MG Road, Bangalore 560001",
    deliveryTime: "30 Mins",
  },
  {
    label: "Work",
    address: "Tower B, Cyber Towers, Hitech City, Hyderabad 500081",
    deliveryTime: "45 Mins",
  },
  {
    label: "Parents",
    address: "12-3-456, Banjara Hills, Hyderabad 500034",
    deliveryTime: "55 Mins",
  },
  {
    label: "Other",
    address: "Mukunda Jwellers, KPHB, Hyderabad 500072",
    deliveryTime: "71 Mins",
  },
];

const Checkout = () => {
  const { cart, removeAllFromCart } = useCart();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  // Transform `items`
  const flattenedItems = cart.cartItems.map((item) => ({
    foodItemId: item._id,
    quantity: item.quantity,
    price: item.price,
  }));

  const [postOrder, { isLoading: isPostOrderLoading }] = usePostOrderMutation();

  const handleProceeedToPay = async () => {
    if (!selectedAddress) {
      toast.warning("Please select a delivery address before proceeding.");
      return;
    }

    const placeOrderJson = {
      restaurantId: cart.selectedRestaurantId,
      items: flattenedItems,
      totalAmount: cart.totalPrice,
      deliveryFee: cart.deliveryFee,
      gstAndCharges: cart.tax,
      status: "confirmed",
      paymentStatus: "pending",
      deliveryAddress: selectedAddress,
    };

    const response = await postOrder(placeOrderJson);

    if (!isPostOrderLoading && response) {
      toast.success("Order Placed Successfully");
      removeAllFromCart();
    }
  };

  useEffect(() => {
    if (cart.cartItems.length === 0) {
      navigate("/");
    }
  }, [cart.cartItems, navigate]);

  return (
    <section id="checkout" className={classes.section}>
      <Grid justify="space-between" className={classes.rootGrid}>
        <Grid.Col
          span={{ base: 12, md: 8, lg: 8 }}
          className={classes.gridColumn}
        >
          <Container>
            <Title order={3}>Choose a delivery address</Title>
            <Title order={5}>Multiple addresses in this location</Title>
          </Container>
          <SimpleGrid cols={{ base: 1, sm: 2 }} className={classes.addressGrid}>
            {SAVED_ADDRESSES.map((addr) => (
              <AddressCard
                key={addr.label}
                label={addr.label}
                address={addr.address}
                deliveryTime={addr.deliveryTime}
                isSelected={selectedAddress === addr.address}
                onSelect={setSelectedAddress}
              />
            ))}
          </SimpleGrid>
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
              <CheckoutCard key={item._id} item={item} />
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

            {selectedAddress && (
              <Flex direction="column">
                <Title order={5}>Delivering to</Title>
                <Text size="sm" c="dimmed">{selectedAddress}</Text>
              </Flex>
            )}

            <Title order={4}>Bill Details</Title>
            <Group justify="space-between">
              <Text>Item Total</Text>
              <Text>₹{cart.totalPrice}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Delivery Fee</Text>
              <Text>{cart.deliveryFee === 0 ? "FREE" : `₹${cart.deliveryFee}`}</Text>
            </Group>
            <Group justify="space-between">
              <Text>GST &amp; Other Charges</Text>
              <Text>₹{cart.tax.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Title order={5}>Total</Title>
              <Title order={5}>
                ₹{(cart.totalPrice + cart.deliveryFee + cart.tax).toFixed(2)}
              </Title>
            </Group>
            <Flex justify={"center"}>
              <Button
                onClick={handleProceeedToPay}
                className={classes.payButton}
                disabled={!selectedAddress}
              >
                {selectedAddress ? "Proceed To Pay" : "Select Address First"}
              </Button>
            </Flex>
          </Stack>
        </Grid.Col>
      </Grid>
    </section>
  );
};

export default Checkout;
