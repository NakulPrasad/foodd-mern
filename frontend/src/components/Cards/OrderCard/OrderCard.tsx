import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Rating,
  Stack,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { IconCheck, IconClock, IconFileText, IconHelpCircle, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../../../hooks/useCart";
import classes from "./OrderCard.module.css";
import IconNonVeg from "/icons/non-veg-icon.png";
import IconVeg from "/icons/veg-icon.png";
import Pizza from "/img/foodItem/pizza.jpg";

interface OrderCardProps {
  order: any;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { addItem } = useCart();
  const [rating, setRating] = useState(order?.userRating || 5);

  const isDelivered = (order?.status || "").toLowerCase().includes("delivered") || order?.status === "confirmed";
  const restName = order?.restaurantName || order?.restaurantId?.name || "Royal Biryani House";
  const restAddress = order?.deliveryAddress || order?.restaurantId?.location?.address || "Jubilee Hills, Hyderabad";
  const restImage = order?.restaurantImage || order?.restaurantId?.image || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop";
  const orderId = order?._id ? (order._id.length > 8 ? order._id.slice(-8).toUpperCase() : order._id) : "FD-84920";
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Today, 1:45 PM";

  const handleReorder = () => {
    if (order?.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        const cartPayload = {
          _id: item?.foodItemId?._id || item?._id || "item_1",
          restaurantId: order?.restaurantId?._id || "rest_1",
          restaurantName: restName,
          restaurantImage: restImage,
          name: item?.foodItemId?.name || item?.name || "Chicken Dum Biryani",
          price: item?.price || item?.foodItemId?.price || 320,
          quantity: item?.quantity || 1,
          options: {},
        };
        addItem(cartPayload as any);
      });
      toast.success(`Items from ${restName} added to cart!`);
    } else {
      toast.info("Items added to cart");
    }
  };

  const handleDownloadInvoice = () => {
    toast.info(`Invoice for Order #${orderId} downloaded`);
  };

  const handleSupportHelp = () => {
    toast.info("Connecting to 24/7 Foodd Support");
  };

  return (
    <Box className={classes.card}>
      {/* Order Header */}
      <Flex className={classes.header}>
        <Group gap="sm">
          <Image src={restImage} className={classes.restImage} alt={restName} />
          <Stack gap={2}>
            <Title order={4}>{restName}</Title>
            <Text size="xs" c="dimmed">{restAddress}</Text>
            <Text size="xs" c="dimmed">ORDER #{orderId} • {orderDate}</Text>
          </Stack>
        </Group>
        <Box>
          {isDelivered ? (
            <span className={classes.statusBadgeDelivered}>
              <IconCheck size={14} /> Delivered
            </span>
          ) : (
            <span className={classes.statusBadgeProgress}>
              <IconClock size={14} /> On the way
            </span>
          )}
        </Box>
      </Flex>

      {/* Live Order Tracker Stepper */}
      <Box
        my="md"
        p="sm"
        style={{
          borderRadius: 12,
          background: isDelivered ? "var(--mantine-color-body)" : "#fff7ed",
          border: isDelivered ? "1px solid var(--mantine-color-default-border)" : "1px solid #ffedd5",
        }}
      >
        <Stepper
          active={isDelivered ? 4 : 2}
          size="xs"
          color="orange"
          iconSize={22}
          styles={{
            stepIcon: { fontWeight: 700 },
            stepLabel: { fontSize: 12, fontWeight: 700 },
            stepDescription: { fontSize: 10 },
          }}
        >
          <Stepper.Step label="Placed" description="Order received" />
          <Stepper.Step label="Confirmed" description="Kitchen accepted" />
          <Stepper.Step label="Preparing" description="Cooking meal" />
          <Stepper.Step label="On the Way" description="Out for delivery" />
          <Stepper.Step label="Delivered" description="Doorstep delivery" />
        </Stepper>
      </Box>

      {/* Order Items Breakdown */}
      <Stack gap="xs">
        {order?.items && order.items.length > 0 ? (
          order.items.map((item: any, idx: number) => {
            const itemName = item?.foodItemId?.name || item?.name || "Delicious Food Item";
            const itemQty = item?.quantity || 1;
            const itemPrice = item?.price || item?.foodItemId?.price || 250;
            const itemImg = item?.foodItemId?.img_url || item?.img_url || Pizza;
            const isVeg = item?.foodItemId?.is_veg ?? item?.is_veg ?? true;

            return (
              <Flex key={idx} className={classes.itemRow}>
                <Flex align="center">
                  <Image src={itemImg} className={classes.itemImg} />
                  <Box>
                    <Group gap={6}>
                      <Image src={isVeg ? IconVeg : IconNonVeg} style={{ width: 14, height: 14 }} />
                      <Text fw={600} size="sm" c="#0f172a">{itemName}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">Qty: {itemQty}</Text>
                  </Box>
                </Flex>
                <Text fw={700} size="sm" c="#0f172a">₹{itemPrice * itemQty}</Text>
              </Flex>
            );
          })
        ) : (
          <Flex className={classes.itemRow}>
            <Text size="sm" c="dimmed">1x Special Meal Combo</Text>
            <Text fw={700} size="sm">₹{order?.totalAmount || 450}</Text>
          </Flex>
        )}
      </Stack>

      {/* Footer & Actions */}
      <Flex className={classes.footer}>
        <Group gap="xs" align="center">
          <Text size="xs" fw={600} c="dimmed">Your Rating:</Text>
          <Rating value={rating} onChange={setRating} size="xs" />
        </Group>

        <Group gap="xs">
          <Button
            size="xs"
            variant="outline"
            className={classes.actionBtn}
            leftSection={<IconFileText size={14} />}
            onClick={handleDownloadInvoice}
          >
            Receipt
          </Button>
          <Button
            size="xs"
            variant="outline"
            className={classes.actionBtn}
            leftSection={<IconHelpCircle size={14} />}
            onClick={handleSupportHelp}
          >
            Help
          </Button>
          <Button
            size="xs"
            className={classes.reorderBtn}
            leftSection={<IconRefresh size={14} />}
            onClick={handleReorder}
          >
            Reorder
          </Button>
        </Group>
      </Flex>
    </Box>
  );
};

export default OrderCard;
