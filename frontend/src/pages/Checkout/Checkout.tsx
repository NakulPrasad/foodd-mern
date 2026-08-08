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
  Modal,
  Loader,
  Group,
  Center,
  Badge,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IconCreditCard,
  IconDeviceMobile,
  IconTruckDelivery,
  IconCheck,
  IconShieldLock,
  IconBrandStripe,
} from "@tabler/icons-react";
import AddressCard from "../../components/Cards/AddressCard/AddressCard";
import CheckoutCard from "../../components/Cards/CheckoutCard/CheckoutCard";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useCart } from "../../hooks/useCart";
import {
  usePostOrderMutation,
  useCreateCheckoutSessionMutation,
} from "../../redux/slices/apiSlice";
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

  // Modal control
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "upi" | "cod">("card");
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "success">("idle");
  const [processingMsg, setProcessingMsg] = useState("");

  // Transform `items`
  const flattenedItems = cart.cartItems.map((item) => ({
    foodItemId: item._id,
    quantity: item.quantity,
    price: item.price,
  }));

  const [postOrder, { isLoading: isPostOrderLoading }] = usePostOrderMutation();
  const [createCheckoutSession, { isLoading: isCheckoutLoading }] =
    useCreateCheckoutSessionMutation();

  const handleProceeedToPay = () => {
    if (!selectedAddress) {
      toast.warning("Please select a delivery address before proceeding.");
      return;
    }
    setPaymentModalOpened(true);
  };

  /**
   * Handles Stripe Checkout redirect for card/UPI.
   * Creates a pending order in the DB and opens Stripe hosted checkout.
   */
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    setPaymentStep("processing");
    setProcessingMsg("Initializing secure Stripe payment gateway...");

    try {
      const response = await createCheckoutSession({
        restaurantId: cart.selectedRestaurantId as string,
        items: flattenedItems,
        totalAmount: cart.totalPrice,
        deliveryFee: cart.deliveryFee,
        gstAndCharges: cart.tax,
        deliveryAddress: selectedAddress,
        restaurantName: cart.selectedRestaurantName || "Restaurant",
        cartItems: cart.cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: item.description || undefined,
        })),
      }).unwrap();

      setProcessingMsg("Redirecting to Stripe Checkout...");

      // Small delay so user sees the message before redirect
      setTimeout(() => {
        window.location.href = response.url;
      }, 600);
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      const errMsg = error?.data?.message || error?.message || "Failed to initiate payment. Please try again.";
      toast.error(errMsg);
      setPaymentStep("idle");
    }
  };

  /**
   * COD path — same simulated flow as before but without card inputs.
   */
  const handleCODOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setPaymentStep("processing");
    setProcessingMsg("Placing your COD order...");

    setTimeout(async () => {
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

      try {
        await postOrder(placeOrderJson).unwrap();
        setPaymentStep("success");
        toast.success("COD Order Placed Successfully!");
        removeAllFromCart();

        setTimeout(() => {
          setPaymentModalOpened(false);
          setPaymentStep("idle");
          navigate("/order");
        }, 1500);
      } catch (error) {
        console.error("Failed to place COD order:", error);
        toast.error("Failed to create order. Please try again.");
        setPaymentStep("idle");
      }
    }, 1200);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    if (activeTab === "cod") {
      return handleCODOrder(e);
    }
    return handleStripeCheckout(e);
  };

  useEffect(() => {
    if (cart.cartItems.length === 0 && !paymentModalOpened) {
      navigate("/");
    }
  }, [cart.cartItems, navigate, paymentModalOpened]);

  const restaurantImage = cart.selectedRestaurantImage || (selectedRestaurant as any)?.image || Logo;
  const totalAmountToPay = cart.totalPrice + cart.deliveryFee + cart.tax;

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
                  <span>₹{totalAmountToPay.toFixed(2)}</span>
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

      {/* ─── Interactive Payment Modal ─── */}
      <Modal
        opened={paymentModalOpened}
        onClose={() => paymentStep === "idle" && setPaymentModalOpened(false)}
        title={paymentStep === "idle" ? "Select Payment Method" : ""}
        centered
        radius="lg"
        size="md"
        withCloseButton={paymentStep === "idle"}
        withinPortal={false}
        transitionProps={{ duration: 0 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {paymentStep === "idle" && (
          <Stack gap="md">
            {/* Tabs Selector */}
            <Group grow gap="xs">
              <Button
                variant={activeTab === "card" ? "filled" : "light"}
                color="orange"
                onClick={() => setActiveTab("card")}
                leftSection={<IconCreditCard size={18} />}
                radius="md"
                size="sm"
              >
                Card
              </Button>
              <Button
                variant={activeTab === "upi" ? "filled" : "light"}
                color="orange"
                onClick={() => setActiveTab("upi")}
                leftSection={<IconDeviceMobile size={18} />}
                radius="md"
                size="sm"
              >
                UPI
              </Button>
              <Button
                variant={activeTab === "cod" ? "filled" : "light"}
                color="orange"
                onClick={() => setActiveTab("cod")}
                leftSection={<IconTruckDelivery size={18} />}
                radius="md"
                size="sm"
              >
                COD
              </Button>
            </Group>

            <Divider color="#f1f5f9" />

            <form onSubmit={handlePaymentSubmit}>
              {/* Card & UPI — both go through Stripe Checkout */}
              {(activeTab === "card" || activeTab === "upi") && (
                <Stack gap="sm">
                  {/* Stripe badge */}
                  <Flex
                    align="center"
                    gap="xs"
                    p="md"
                    style={{
                      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      borderRadius: 12,
                      border: "1px solid #bae6fd",
                    }}
                  >
                    <Box
                      style={{
                        background: "#635BFF",
                        borderRadius: 8,
                        padding: "6px 8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconBrandStripe size={20} color="white" />
                    </Box>
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Flex align="center" gap={6}>
                        <Text fw={700} size="sm" c="#0f172a">
                          Pay securely with Stripe
                        </Text>
                        <Badge color="green" size="xs" variant="light">
                          Test Mode
                        </Badge>
                      </Flex>
                      <Text size="xs" c="#475569">
                        {activeTab === "card"
                          ? "You'll be redirected to Stripe's secure hosted checkout to enter your card details."
                          : "You'll be redirected to Stripe's secure hosted checkout to complete UPI payment."}
                      </Text>
                    </Stack>
                  </Flex>

                  <Flex align="center" gap={6}>
                    <IconShieldLock size={14} color="#64748b" />
                    <Text size="xs" c="dimmed">
                      Your payment info is never stored on our servers. Stripe handles all card data securely.
                    </Text>
                  </Flex>

                  {/* Test card hint */}
                  <Box
                    p="sm"
                    style={{
                      background: "#fffbeb",
                      borderRadius: 8,
                      border: "1px solid #fde68a",
                    }}
                  >
                    <Text size="xs" fw={700} c="#92400e" mb={2}>
                      🧪 Test Mode — Use test card:
                    </Text>
                    <Text size="xs" c="#78350f" style={{ fontFamily: "monospace" }}>
                      Card: 4242 4242 4242 4242 &nbsp;|&nbsp; Expiry: any future date &nbsp;|&nbsp; CVV: any 3 digits
                    </Text>
                  </Box>
                </Stack>
              )}

              {activeTab === "cod" && (
                <Stack gap="xs" p="sm" bg="#fdf3f0" style={{ borderRadius: 10 }}>
                  <Text fw={700} size="sm" c="#ff5200">Cash On Delivery (COD)</Text>
                  <Text size="xs" c="dimmed">
                    Confirm your order now. You can pay via Cash, Card, or UPI directly to our delivery partner upon receipt.
                  </Text>
                </Stack>
              )}

              <Button
                type="submit"
                fullWidth
                color={activeTab === "cod" ? "orange" : "#635BFF"}
                radius="md"
                size="md"
                mt="xl"
                loading={isCheckoutLoading || isPostOrderLoading}
                leftSection={
                  activeTab !== "cod" ? <IconBrandStripe size={18} /> : undefined
                }
              >
                {activeTab === "cod"
                  ? "Confirm COD Order"
                  : `Pay ₹${totalAmountToPay.toFixed(2)} with Stripe`}
              </Button>
            </form>
          </Stack>
        )}

        {paymentStep === "processing" && (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Loader color="orange" size="xl" type="dots" />
              <Text fw={700} size="sm" c="#0f172a">
                {processingMsg}
              </Text>
              <Text size="xs" c="dimmed">
                Please do not refresh the page or click back.
              </Text>
            </Stack>
          </Center>
        )}

        {paymentStep === "success" && (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <div className={classes.checkmarkWrap}>
                <IconCheck size={40} stroke={3} className={classes.checkmark} />
              </div>
              <Title order={3} c="#22c55e" mt="md">
                Order Placed!
              </Title>
              <Text size="sm" c="dimmed">
                Your COD order is confirmed and is being prepared.
              </Text>
            </Stack>
          </Center>
        )}
      </Modal>
    </section>
  );
};

export default Checkout;
