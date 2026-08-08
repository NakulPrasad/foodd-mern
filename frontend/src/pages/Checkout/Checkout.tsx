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
  TextInput,
  Group,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconCreditCard, IconDeviceMobile, IconTruckDelivery, IconCheck } from "@tabler/icons-react";
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

  // Modal control
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "upi" | "cod">("card");
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "success">("idle");
  const [processingMsg, setProcessingMsg] = useState("");

  // Card input states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // UPI input states
  const [upiId, setUpiId] = useState("");

  // Transform `items`
  const flattenedItems = cart.cartItems.map((item) => ({
    foodItemId: item._id,
    quantity: item.quantity,
    price: item.price,
  }));

  const [postOrder, { isLoading: isPostOrderLoading }] = usePostOrderMutation();

  const handleProceeedToPay = () => {
    if (!selectedAddress) {
      toast.warning("Please select a delivery address before proceeding.");
      return;
    }
    setPaymentModalOpened(true);
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    setCardNumber(parts.join(" "));
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "card") {
      const cleanCard = cardNumber.replace(/\s/g, "");
      if (cleanCard.length !== 16) {
        toast.warning("Please enter a valid 16-digit card number.");
        return;
      }
      if (expiry.length !== 5) {
        toast.warning("Please enter card expiry as MM/YY.");
        return;
      }
      if (cvv.length !== 3) {
        toast.warning("Please enter a valid 3-digit CVV.");
        return;
      }
      if (!cardHolder.trim()) {
        toast.warning("Please enter cardholder name.");
        return;
      }
    } else if (activeTab === "upi") {
      if (!upiId.includes("@") || upiId.length < 5) {
        toast.warning("Please enter a valid UPI ID (e.g. user@okaxis).");
        return;
      }
    }

    // Begin Simulated processing
    setPaymentStep("processing");
    setProcessingMsg("Initializing secure payment gateway...");

    setTimeout(() => {
      setProcessingMsg("Contacting bank authentication servers...");
    }, 700);

    setTimeout(() => {
      setProcessingMsg("Authorizing secure transaction amount...");
    }, 1400);

    setTimeout(() => {
      setProcessingMsg("Securing payment confirmation...");
    }, 2100);

    setTimeout(async () => {
      const placeOrderJson = {
        restaurantId: cart.selectedRestaurantId,
        items: flattenedItems,
        totalAmount: cart.totalPrice,
        deliveryFee: cart.deliveryFee,
        gstAndCharges: cart.tax,
        status: "confirmed",
        paymentStatus: activeTab === "cod" ? "pending" : "paid",
        deliveryAddress: selectedAddress,
      };

      try {
        const response = await postOrder(placeOrderJson).unwrap();
        setPaymentStep("success");
        toast.success("Order Placed Successfully!");
        removeAllFromCart();

        setTimeout(() => {
          setPaymentModalOpened(false);
          setPaymentStep("idle");
          setCardNumber("");
          setExpiry("");
          setCvv("");
          setCardHolder("");
          setUpiId("");
          navigate("/order");
        }, 1500);
      } catch (error) {
        console.error("Failed to place order:", error);
        toast.error("Failed to create order. Please try again.");
        setPaymentStep("idle");
      }
    }, 2800);
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
              {activeTab === "card" && (
                <Stack gap="sm">
                  <TextInput
                    label="Card Number"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    required
                    radius="md"
                  />
                  <Group grow gap="sm">
                    <TextInput
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      maxLength={5}
                      required
                      radius="md"
                    />
                    <TextInput
                      label="CVV"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      maxLength={3}
                      type="password"
                      required
                      radius="md"
                    />
                  </Group>
                  <TextInput
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                    radius="md"
                  />
                </Stack>
              )}

              {activeTab === "upi" && (
                <Stack gap="sm">
                  <Text size="xs" c="dimmed">
                    Enter your UPI ID linked to your bank account to initiate request.
                  </Text>
                  <TextInput
                    label="UPI ID"
                    placeholder="username@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    radius="md"
                  />
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
                color="orange"
                radius="md"
                size="md"
                mt="xl"
                loading={isPostOrderLoading}
              >
                {activeTab === "cod" ? "Confirm COD Order" : `Pay ₹${totalAmountToPay.toFixed(2)}`}
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
                Payment Successful!
              </Title>
              <Text size="sm" c="dimmed">
                Your order is confirmed and is being prepared.
              </Text>
            </Stack>
          </Center>
        )}
      </Modal>
    </section>
  );
};

export default Checkout;
