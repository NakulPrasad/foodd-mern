import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import OrderCard from "../../components/Cards/OrderCard/OrderCard";
import { useGetMyOrdersQuery } from "../../redux/slices/apiSlice";
import { IOrder } from "../../types/order.types";
import classes from "./Order.module.css";

const Order = () => {
  const { data: orderData, isLoading } = useGetMyOrdersQuery();
  const [orders, setOrders] = useState<IOrder[]>([]);
  useEffect(() => {
    if (orderData && !isLoading) {
      setOrders(orderData.data);
    }
  }, [orderData]);

  useEffect(() => {
    console.log("Updated orders:", orders);
  }, [orders]);
  return (
    <Box className={classes.mainContainer}>
      <Container className={classes.subContainer1}>
        <Group justify="space-between">
          <Stack>
            <Title order={2}>Nakul</Title>
            <Title order={5}>8210333792 . nakulprasad12@gmail.com</Title>
          </Stack>
          <Button variant="">Edit Profile</Button>
        </Group>
      </Container>
      <Container className={classes.subContainer2}>
        <Title order={3}>Past Order</Title>
        {isLoading && <Text>Loading</Text>}
        {!isLoading &&
          Array.isArray(orders) &&
          orders?.map((order) => {
            return <OrderCard key={order?._id} order={order} />;
          })}
      </Container>
    </Box>
  );
};

export default Order;
