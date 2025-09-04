import {
  Box,
  Button,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import classes from "./Order.module.css";
import Pizza from "/img/pizza.jpg";
import OrderCard from "../../components/Cards/OrderCard/OrderCard";
const Order = () => {
  const theme = useMantineTheme();
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
        <OrderCard/>
        <OrderCard/>
        <OrderCard/>

      </Container>
    </Box>
  );
};

export default Order;
