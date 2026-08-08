import { Box, Button, Center, Loader, Stack, Text, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useVerifyPaymentMutation } from "../../redux/slices/apiSlice";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import classes from "./PaymentSuccess.module.css";

type Status = "verifying" | "success" | "failed";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { removeAllFromCart } = useCart();
  const { authToken, checkAuth } = useAuth();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Verifying your payment with Stripe...");
  const hasVerified = useRef(false);

  // Step 1: Ensure auth is initialized when we land here from a Stripe redirect.
  // The Redux store resets on full page navigation, so we call checkAuth() once
  // to restore the token from cookie/dev-mode before trying the protected API.
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 2: Once authToken is available in Redux, fire the verify call.
  useEffect(() => {
    // Wait until auth has been resolved (token present or confirmed absent in dev)
    if (!authToken) return;

    // Prevent double-firing in React Strict Mode
    if (hasVerified.current) return;
    hasVerified.current = true;

    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("failed");
      setMessage("Invalid payment session. Please contact support.");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyPayment({ sessionId }).unwrap();
        if (result.paymentStatus === "paid") {
          removeAllFromCart();
          setStatus("success");
          setMessage("Payment confirmed! Your order is being prepared.");
          toast.success("Payment successful! Order confirmed 🎉");
        } else {
          setStatus("failed");
          setMessage("Payment was not completed. Please try again.");
        }
      } catch (err: any) {
        console.error("Payment verification failed:", err);
        // If the session was already verified (order already marked paid),
        // treat it as success to avoid frustrating the user
        if (err?.status === 402) {
          setStatus("failed");
          setMessage("Payment was not completed. Please try again.");
        } else {
          setStatus("failed");
          setMessage("Could not verify payment. Please contact support.");
        }
      }
    };

    verify();
  }, [authToken, searchParams, verifyPayment, removeAllFromCart]);

  return (
    <section className={classes.section}>
      <Center style={{ minHeight: "70vh" }}>
        <Box className={classes.card}>
          {status === "verifying" && (
            <Stack align="center" gap="lg">
              <div className={classes.loaderWrap}>
                <Loader color="#635BFF" size="xl" type="dots" />
              </div>
              <Title order={3} c="#0f172a">
                Verifying Payment
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                {message}
              </Text>
              <Text size="xs" c="dimmed">
                Please do not close or refresh this page.
              </Text>
            </Stack>
          )}

          {status === "success" && (
            <Stack align="center" gap="lg">
              <div className={classes.successRing}>
                <div className={classes.checkmarkWrap}>
                  <IconCheck size={48} stroke={3} color="white" />
                </div>
              </div>
              <Title order={2} c="#16a34a">
                Payment Successful! 🎉
              </Title>
              <Text size="md" c="#475569" ta="center" maw={340}>
                {message}
              </Text>
              <Box
                p="sm"
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 10,
                  textAlign: "center",
                }}
              >
                <Text size="xs" c="#15803d" fw={600}>
                  ✅ Your order has been confirmed and the restaurant has been notified.
                </Text>
              </Box>
              <Stack gap="xs" style={{ width: "100%" }}>
                <Button
                  fullWidth
                  color="#635BFF"
                  radius="md"
                  size="md"
                  onClick={() => navigate("/order")}
                >
                  Track My Order
                </Button>
                <Button
                  fullWidth
                  variant="light"
                  color="gray"
                  radius="md"
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </Stack>
            </Stack>
          )}

          {status === "failed" && (
            <Stack align="center" gap="lg">
              <div className={classes.failRing}>
                <div className={classes.failIconWrap}>
                  <IconX size={48} stroke={3} color="white" />
                </div>
              </div>
              <Title order={2} c="#dc2626">
                Payment Failed
              </Title>
              <Text size="md" c="#475569" ta="center" maw={340}>
                {message}
              </Text>
              <Stack gap="xs" style={{ width: "100%" }}>
                <Button
                  fullWidth
                  color="orange"
                  radius="md"
                  size="md"
                  onClick={() => navigate("/checkout")}
                >
                  Try Again
                </Button>
                <Button
                  fullWidth
                  variant="light"
                  color="gray"
                  radius="md"
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Center>
    </section>
  );
};

export default PaymentSuccess;
