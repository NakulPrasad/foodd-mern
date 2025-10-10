import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import classes from "./OrderCard.module.css";
import Pizza from "/img/foodItem/pizza.jpg";
import { IOrder } from "../../../types/order.types";

interface OrderCardProps {
  order: IOrder;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const theme = useMantineTheme();

  return (
    <>
      {order.items.map((item, index) => (
        <Flex key={index} direction="column" className={classes.mainContainer}>
          <Group className={classes.itemCard}>
            <Image
              src={item.foodItemId.img_url || Pizza}
              className={classes.itemImage}
            />
            <Box w="82%">
              <Group justify="space-between">
                <Text fw="var(--font-weight-bold)">
                  {order.restaurantId.name
                  }
                </Text>
                <Text>{order.status}</Text>
              </Group>
              <Stack>
                <Text size={theme.fontSizes.sm}>
                  {order.restaurantId.location.address}
                </Text>
                <Text size={theme.fontSizes.sm} fw="var(--font-weight-light)">
                  ORDER #{order._id} | {order.createdAt}
                </Text>
                <Text fw="var(--font-weight-bold)" c={theme.colors.primary[6]}>
                  VIEW DETAILS
                </Text>
              </Stack>
            </Box>
          </Group>
          <Stack>
            <Group justify="space-between">
              <Text fw="var(--font-weight-semi-bold)">
                {item.foodItemId.name} x {item.quantity}
              </Text>
              <Text fw="var(--font-weight-semi-bold)">
                Total Paid: {order.totalAmount}
              </Text>
            </Group>
            <Group>
              <Button variant="unstyled">Reorder</Button>
              <Button>Help</Button>
            </Group>
          </Stack>
        </Flex>
      ))}
    </>
  );
};

export default OrderCard;
