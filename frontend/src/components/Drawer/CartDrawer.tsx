import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingCart,
  IconTrash,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useCart } from "../../hooks/useCart";
import {
  addToCart,
  clearCart,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import IconNonVeg from "/icons/non-veg-icon.png";
import IconVeg from "/icons/veg-icon.png";
import Logo from "/img/logo/LOGO-bgremove.png";

interface CartDrawerProps {
  opened: boolean;
  onClose: () => void;
}

const CartDrawer = ({ opened, onClose }: CartDrawerProps) => {
  const { cart } = useCart();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Custom cooking instructions state per item ID
  const [cookingInstructions, setCookingInstructions] = useState<
    Record<string, string>
  >({});

  const handleInstructionChange = (itemId: string, note: string) => {
    setCookingInstructions((prev) => ({
      ...prev,
      [itemId]: note,
    }));
  };

  const handleIncrement = (item: any) => {
    dispatch(addToCart(item));
  };

  const handleDecrement = (item: any) => {
    dispatch(removeFromCart({ _id: item._id }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info("Cart cleared");
  };

  const handleProceedCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const cartCount = cart.cartItems.length;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      padding="lg"
      title={
        <Group gap="xs">
          <IconShoppingCart size={22} color="#f97316" />
          <Title order={4}>Your Food Cart ({cart.totalItems})</Title>
        </Group>
      }
      styles={{
        header: {
          borderBottom: "1px solid var(--mantine-color-default-border)",
          paddingBottom: "12px",
        },
        content: {
          display: "flex",
          flexDirection: "column",
        },
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: "16px",
          paddingBottom: "16px",
        },
      }}
    >
      {cartCount === 0 ? (
        <Stack align="center" justify="center" style={{ flex: 1 }} gap="md">
          <IconShoppingCart size={54} color="#cbd5e1" stroke={1.5} />
          <Title order={4} c="dimmed">Your cart is empty</Title>
          <Text size="sm" c="dimmed" ta="center" maw={280}>
            Explore top restaurants and add delicious meals to your cart.
          </Text>
          <Button
            color="orange"
            radius="md"
            onClick={() => {
              onClose();
              navigate("/");
            }}
          >
            Browse Restaurants
          </Button>
        </Stack>
      ) : (
        <Stack justify="space-between" style={{ flex: 1 }}>
          {/* Top — Restaurant Header & Clear Cart */}
          <Stack gap="md">
            <Flex
              align="center"
              justify="space-between"
              p="sm"
              bg="var(--mantine-color-default-hover)"
              style={{ borderRadius: 12 }}
            >
              <Group gap="xs">
                <Image
                  src={cart.selectedRestaurantImage || Logo}
                  style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }}
                />
                <Stack gap={0}>
                  <Text size="xs" c="dimmed" fw={600}>Ordering from</Text>
                  <Text size="sm" fw={700}>
                    {cart.selectedRestaurantName || "Selected Restaurant"}
                  </Text>
                </Stack>
              </Group>

              <Button
                variant="subtle"
                color="red"
                size="xs"
                leftSection={<IconTrash size={14} />}
                onClick={handleClearCart}
              >
                Clear
              </Button>
            </Flex>

            {/* Cart Items List */}
            <Stack gap="sm" style={{ maxHeight: "42vh", overflowY: "auto" }} pr={4}>
              {cart.cartItems.map((item) => (
                <Box
                  key={item._id}
                  p="sm"
                  style={{
                    borderRadius: 12,
                    border: "1px solid var(--mantine-color-default-border)",
                    background: "var(--mantine-color-body)",
                  }}
                >
                  <Flex justify="space-between" align="flex-start" mb={6}>
                    <Group gap={8}>
                      <Image
                        src={item.is_veg ? IconVeg : IconNonVeg}
                        style={{ width: 14, height: 14, marginTop: 2 }}
                      />
                      <Stack gap={2}>
                        <Text fw={700} size="sm">{item.name}</Text>
                        <Text size="xs" c="orange" fw={700}>₹{item.price}</Text>
                      </Stack>
                    </Group>

                    {/* Quantity Controls (+ / -) */}
                    <Group gap={6} bg="var(--mantine-color-default-hover)" p={3} style={{ borderRadius: 8 }}>
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        color="gray"
                        onClick={() => handleDecrement(item)}
                      >
                        <IconMinus size={12} />
                      </ActionIcon>
                      <Text size="xs" fw={800} style={{ minWidth: 16, textAlign: "center" }}>
                        {item.quantity}
                      </Text>
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        color="orange"
                        onClick={() => handleIncrement(item)}
                      >
                        <IconPlus size={12} />
                      </ActionIcon>
                    </Group>
                  </Flex>

                  {/* Custom Cooking Instructions */}
                  <TextInput
                    placeholder="Custom instructions (e.g. less spicy, no onion)"
                    leftSection={<IconToolsKitchen2 size={13} color="#94a3b8" />}
                    size="xs"
                    radius="md"
                    value={cookingInstructions[item._id] || ""}
                    onChange={(e) => handleInstructionChange(item._id, e.target.value)}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* Bottom — Bill Summary & Checkout Action */}
          <Stack gap="xs" mt="md">
            <Divider color="var(--mantine-color-default-border)" />
            <Box p="xs" bg="var(--mantine-color-default-hover)" style={{ borderRadius: 12 }}>
              <Stack gap={4}>
                <Flex justify="space-between">
                  <Text size="xs" c="dimmed">Item Total</Text>
                  <Text size="xs" fw={600}>₹{cart.totalPrice}</Text>
                </Flex>

                {cart.discountAmount > 0 && (
                  <Flex justify="space-between" c="green">
                    <Text size="xs" fw={600}>Coupon Discount ({cart.appliedCoupon?.code})</Text>
                    <Text size="xs" fw={700}>- ₹{cart.discountAmount}</Text>
                  </Flex>
                )}

                <Flex justify="space-between">
                  <Text size="xs" c="dimmed">Delivery Fee</Text>
                  <Text size="xs" fw={600}>
                    {cart.deliveryFee === 0 ? <Badge color="green" size="xs">FREE</Badge> : `₹${cart.deliveryFee}`}
                  </Text>
                </Flex>

                <Flex justify="space-between">
                  <Text size="xs" c="dimmed">Taxes &amp; Charges (GST)</Text>
                  <Text size="xs" fw={600}>₹{cart.tax.toFixed(2)}</Text>
                </Flex>

                <Divider my={4} color="var(--mantine-color-default-border)" />

                <Flex justify="space-between" align="center">
                  <Text fw={800} size="sm">To Pay</Text>
                  <Text fw={900} size="md" c="orange">
                    ₹{(Math.max(0, cart.totalPrice - cart.discountAmount) + cart.deliveryFee + cart.tax).toFixed(2)}
                  </Text>
                </Flex>
              </Stack>
            </Box>

            <Button
              color="orange"
              size="md"
              radius="md"
              fullWidth
              onClick={handleProceedCheckout}
              leftSection={<IconCheck size={18} />}
            >
              Proceed to Checkout
            </Button>
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
};

export default CartDrawer;
