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
  TextInput,
  UnstyledButton,
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
  IconTag,
  IconTicket,
} from "@tabler/icons-react";
import AddressCard from "../../components/Cards/AddressCard/AddressCard";
import CheckoutCard from "../../components/Cards/CheckoutCard/CheckoutCard";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useCart } from "../../hooks/useCart";
import {
  usePostOrderMutation,
  useCreateCheckoutSessionMutation,
  useValidateCouponMutation,
  useGetAvailableCouponsQuery,
} from "../../redux/slices/apiSlice";
import { applyCoupon, removeCoupon } from "../../redux/slices/cartSlice";
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const selectedRestaurant = useAppSelector((state: RootState) => state.restaurant.selected);

  // Coupon state & API hooks
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();
  const { data: availableCouponsData } = useGetAvailableCouponsQuery();

  // Modal control
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);
  const [availableCouponsModalOpened, setAvailableCouponsModalOpened] = useState(false);
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
   * Handle applying coupon code
   */
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim();
    if (!code) {
      toast.info("Please enter a promo code");
      return;
    }

    try {
      const res = await validateCoupon({
        code,
        itemTotal: cart.totalPrice,
      }).unwrap();

      if (res.valid) {
        dispatch(
          applyCoupon({
            coupon: {
              code: res.coupon.code,
              title: res.coupon.title,
              discountType: res.coupon.discountType,
              discountValue: res.coupon.discountValue,
              maxDiscount: res.coupon.maxDiscount,
              minOrderAmount: res.coupon.minOrderAmount,
            },
            discountAmount: res.discountAmount,
          }),
        );
        toast.success(res.message);
        setCouponCodeInput("");
        setAvailableCouponsModalOpened(false);
      }
    } catch (err: any) {
      console.error("Coupon validation error:", err);
      const errMsg = err?.data?.message || err?.message || "Invalid coupon code";
      toast.error(errMsg);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.info("Coupon removed");
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
        couponCode: cart.appliedCoupon?.code,
        discountAmount: cart.discountAmount,
        cartItems: cart.cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: item.description || undefined,
        })),
      }).unwrap();

      setProcessingMsg("Redirecting to Stripe Checkout...");

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
   * COD path
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
        couponCode: cart.appliedCoupon?.code,
        discountAmount: cart.discountAmount,
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
  
  // Grand total calculation: Item Total - Discount + Delivery Fee + GST
  const netItemTotal = Math.max(0, cart.totalPrice - cart.discountAmount);
  const totalAmountToPay = netItemTotal + cart.deliveryFee + cart.tax;

  const availableCouponsList = availableCouponsData?.data || [
    { code: "FOODD50", title: "50% OFF up to ₹100", minOrderAmount: 199, description: "On food orders above ₹199" },
    { code: "FLAT100", title: "₹100 FLAT OFF", minOrderAmount: 399, description: "On orders above ₹399" },
    { code: "WELCOME20", title: "20% OFF up to ₹60", minOrderAmount: 99, description: "On orders above ₹99" },
    { code: "FREEDEL30", title: "₹30 Delivery Waiver", minOrderAmount: 150, description: "On orders above ₹150" },
  ];

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

              {/* ─── Coupon / Promo Code Section ─── */}
              <Box bg="#fff7ed" p="sm" style={{ borderRadius: 12, border: "1px stroke #ffedd5" }}>
                <Flex align="center" gap="xs" mb={8}>
                  <IconTag size={18} color="#ea580c" />
                  <Text fw={700} size="sm" c="#c2410c">Coupons &amp; Offers</Text>
                </Flex>

                {cart.appliedCoupon ? (
                  <Flex
                    align="center"
                    justify="space-between"
                    p="xs"
                    bg="#f0fdf4"
                    style={{ borderRadius: 8, border: "1px solid #bbf7d0" }}
                  >
                    <Flex align="center" gap={8}>
                      <IconCheck size={18} color="#16a34a" />
                      <Stack gap={0}>
                        <Flex align="center" gap={6}>
                          <Text fw={700} size="xs" c="#15803d">
                            '{cart.appliedCoupon.code}' APPLIED
                          </Text>
                          <Badge color="green" size="xs" variant="light">
                            -₹{cart.discountAmount}
                          </Badge>
                        </Flex>
                        <Text size="xs" c="#166534">
                          You saved ₹{cart.discountAmount} with this code!
                        </Text>
                      </Stack>
                    </Flex>
                    <UnstyledButton onClick={handleRemoveCoupon} style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>
                      Remove
                    </UnstyledButton>
                  </Flex>
                ) : (
                  <Stack gap="xs">
                    <Flex gap="xs">
                      <TextInput
                        placeholder="ENTER PROMO CODE (e.g. FOODD50)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.currentTarget.value.toUpperCase())}
                        style={{ flex: 1 }}
                        size="xs"
                        leftSection={<IconTicket size={14} color="#9a3412" />}
                      />
                      <Button
                        color="orange"
                        size="xs"
                        onClick={() => handleApplyCoupon()}
                        loading={isValidatingCoupon}
                      >
                        Apply
                      </Button>
                    </Flex>

                    <Flex align="center" justify="space-between">
                      <Text size="xs" c="#9a3412">Available offers from restaurant</Text>
                      <UnstyledButton
                        onClick={() => setAvailableCouponsModalOpened(true)}
                        style={{ color: "#ea580c", fontSize: 12, fontWeight: 700 }}
                      >
                        View Offers ({availableCouponsList.length}) →
                      </UnstyledButton>
                    </Flex>
                  </Stack>
                )}
              </Box>

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

                {cart.discountAmount > 0 && (
                  <div className={classes.billRow} style={{ color: "#16a34a", fontWeight: 600 }}>
                    <span>Coupon Discount ({cart.appliedCoupon?.code})</span>
                    <span>- ₹{cart.discountAmount.toFixed(2)}</span>
                  </div>
                )}

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
                {selectedAddress ? `Proceed To Pay ₹${totalAmountToPay.toFixed(2)}` : "Select Address First"}
              </Button>
            </Stack>
          </Box>
        </Grid.Col>
      </Grid>

      {/* ─── Available Coupons Modal ─── */}
      <Modal
        opened={availableCouponsModalOpened}
        onClose={() => setAvailableCouponsModalOpened(false)}
        title={
          <Flex align="center" gap="xs">
            <IconTag size={22} color="#ea580c" />
            <Title order={4}>Available Promotional Coupons</Title>
          </Flex>
        }
        centered
        radius="lg"
        size="md"
      >
        <Stack gap="md">
          <Text size="xs" c="dimmed">
            Click on any promo code to apply it directly to your cart:
          </Text>
          {availableCouponsList.map((cp: any) => {
            const isEligible = cart.totalPrice >= (cp.minOrderAmount || 0);
            return (
              <Box
                key={cp.code}
                p="md"
                style={{
                  borderRadius: 12,
                  border: isEligible ? "1px solid #fdba74" : "1px solid #e2e8f0",
                  background: isEligible ? "#fff7ed" : "#f8fafc",
                }}
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Flex align="center" gap="xs">
                    <Badge color="orange" size="lg" variant="filled">
                      {cp.code}
                    </Badge>
                    <Text fw={700} size="sm" c="#0f172a">
                      {cp.title}
                    </Text>
                  </Flex>
                  <Button
                    size="xs"
                    color="orange"
                    variant={isEligible ? "filled" : "outline"}
                    disabled={!isEligible}
                    onClick={() => handleApplyCoupon(cp.code)}
                  >
                    {isEligible ? "APPLY" : `Min ₹${cp.minOrderAmount}`}
                  </Button>
                </Flex>
                <Text size="xs" c="#64748b">
                  {cp.description}
                </Text>
                {!isEligible && (
                  <Text size="xs" c="#dc2626" mt={4} fw={600}>
                    Add ₹{((cp.minOrderAmount || 0) - cart.totalPrice).toFixed(0)} more items to unlock
                  </Text>
                )}
              </Box>
            );
          })}
        </Stack>
      </Modal>

      {/* ─── Interactive Payment Modal ─── */}
      <Modal
        opened={paymentModalOpened}
        onClose={() => paymentStep === "idle" && setPaymentModalOpened(false)}
        title={paymentStep === "idle" ? "Select Payment Method" : ""}
        centered
        radius="lg"
        size="md"
        withCloseButton={paymentStep === "idle"}
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
                size="xs"
              >
                Card
              </Button>
              <Button
                variant={activeTab === "upi" ? "filled" : "light"}
                color="orange"
                onClick={() => setActiveTab("upi")}
                leftSection={<IconDeviceMobile size={18} />}
                radius="md"
                size="xs"
              >
                UPI
              </Button>
              <Button
                variant={activeTab === "cod" ? "filled" : "light"}
                color="orange"
                onClick={() => setActiveTab("cod")}
                leftSection={<IconTruckDelivery size={18} />}
                radius="md"
                size="xs"
              >
                COD
              </Button>
            </Group>

            <Divider color="#f1f5f9" />

            <form onSubmit={handlePaymentSubmit}>
              {/* Card & UPI — both go through Stripe Checkout */}
              {(activeTab === "card" || activeTab === "upi") && (
                <Stack gap="sm">
                  <Flex
                    align="center"
                    gap="xs"
                    p="sm"
                    style={{
                      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      borderRadius: 12,
                      border: "1px solid #bae6fd",
                      flexWrap: "wrap",
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
                    <Stack gap={2} style={{ flex: 1, minWidth: 200 }}>
                      <Flex align="center" gap={6} wrap="wrap">
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
                    <IconShieldLock size={14} color="#64748b" style={{ flexShrink: 0 }} />
                    <Text size="xs" c="dimmed">
                      Your payment info is never stored on our servers. Stripe handles all card data securely.
                    </Text>
                  </Flex>

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
                    <Text size="xs" c="#78350f" style={{ fontFamily: "monospace", wordBreak: "break-word", lineHeight: 1.5 }}>
                      Card: 4242 4242 4242 4242 &nbsp;|&nbsp; Expiry: any future date &nbsp;|&nbsp; CVV: 123
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
