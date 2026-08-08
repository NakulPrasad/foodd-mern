import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
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
import { useAppSelector } from "../../hooks/reduxHooks";
import { useCart } from "../../hooks/useCart";
import { usePostOrderMutation } from "../../redux/slices/apiSlice";
import { RootState } from "../../redux/store";
import classes from "./Checkout.module.css";
import Logo from "/img/logo/LOGO-bgremove.png";

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
    address: "Mukunda Jewellers, KPHB, Hyderabad 500072",
    deliveryTime: "71 Mins",
  },
];

const Checkout = () => {
  const { cart, removeAllFromCart } = useCart();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const selectedRestaurant = useAppSelector((state: RootState) => state.restaurant.selected);

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
      toast.success("Order Placed Successfully!");
      removeAllFromCart();
    }
  };

  useEffect(() => {
    if (cart.cartItems.length === 0) {
      navigate("/");
    }
  }, [cart.cartItems, navigate]);

  const restaurantImage = cart.selectedRestaurantImage || (selectedRestaurant as any)?.image || Logo;

  return (
    <section id="checkout" className={classes.section}>
      <Grid gutter="xl" className={classes.rootGrid}>
        {/* Left Column - Delivery Addresses */}
        <Grid.Col span={{ base: 12, md: 7, lg: 7.5 }}>
          <Box className={classes.leftCard}>
            <Title order={3} mb={4}>Choose a Delivery Address</Title>
            <Text size="sm" c="dimmed" mb="md">
              Select your preferred address for fast doorstep delivery
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className={classes.addressGrid}>
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
          </Box>
        </Grid.Col>

        {/* Right Column - Order Summary & Bill Details */}
        <Grid.Col span={{ base: 12, md: 5, lg: 4.5 }}>
          <Box className={classes.rightCard}>
            <Stack gap="sm">
              <Flex align="center" className={classes.restaurantHeader}>
                <Image src={restaurantImage} className={classes.restaurantLogo} alt="Restaurant" />
                <Flex direction="column">
                  <Title order={4}>{cart.selectedRestaurantName || "Selected Restaurant"}</Title>
                  <Text size="xs" c="dimmed">Order Summary</Text>
                </Flex>
              </Flex>

              {/* Items List */}
              <Stack gap="xs">
                {cart.cartItems.map((item) => (
                  <CheckoutCard key={item._id} item={item} />
                ))}
              </Stack>

              <Divider my="xs" />

              {/* No Contact Delivery Checkbox */}
              <Flex className={classes.infomsg} align="flex-start" gap="xs">
                <Checkbox style={{ marginTop: 2 }} />
                <Stack gap={2}>
                  <Text fw={600} size="sm">Opt in for No-Contact Delivery</Text>
                  <Text size="xs" c="dimmed">
                    Unwell, or avoiding contact? Delivery partner will safely place the order outside your door.
                  </Text>
                </Stack>
              </Flex>

              {selectedAddress && (
                <Box bg="#f1f5f9" p="xs" style={{ borderRadius: 10 }}>
                  <Text size="xs" fw={700} c="#475569">DELIVERING TO:</Text>
                  <Text size="xs" c="#334155" style={{ wordBreak: "break-word" }}>{selectedAddress}</Text>
                </Box>
              )}

              {/* Bill Details */}
              <Box className={classes.billDetails}>
                <Title order={5} mb="xs">Bill Details</Title>
                <div className={classes.billRow}>
                  <span>Item Total</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
                <div className={classes.billRow}>
                  <span>Delivery Fee</span>
                  <span>{cart.deliveryFee === 0 ? "FREE" : `₹${cart.deliveryFee}`}</span>
                </div>
                <div className={classes.billRow}>
                  <span>GST &amp; Taxes</span>
                  <span>₹{cart.tax.toFixed(2)}</span>
                </div>
                <div className={classes.billTotal}>
                  <span>To Pay</span>
                  <span>₹{(cart.totalPrice + cart.deliveryFee + cart.tax).toFixed(2)}</span>
                </div>
              </Box>

              <Button
                onClick={handleProceeedToPay}
                className={classes.payButton}
                disabled={!selectedAddress}
                mt="xs"
              >
                {selectedAddress ? "Proceed To Pay" : "Select Address First"}
              </Button>
            </Stack>
          </Box>
        </Grid.Col>
      </Grid>
    </section>
  );
};

export default Checkout;
