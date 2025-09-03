import {
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import AddressCard from "../../components/Cards/AddressCard/AddressCard";
import { useCart } from "../../hooks/useCart";
import classes from "./Checkout.module.css";
import IconVeg from "/icons/veg-icon.png";
import RestrauntLogo from "/img/pizzahut.jpg";

const Checkout = () => {
  // const {cartItems} = useSelector((state: RootState) => state.cart)
  const { cartItems, currentRestaurant } = useCart();
  // toast.info(cartItems);
  // console.log(cartItems, currentRestaurant);

  return (
    <section id="checkout" className={classes.section}>
      <Grid justify="space-between" className={classes.rootGrid}>
        <Grid.Col
          span={{ base: 12, md: 8, lg: 8 }}
          className={classes.gridColumn}
        >
          <Container>
            <Title order={3}>Choose a deliver address</Title>
            <Title order={5}>Multiple addresses in this location</Title>
          </Container>
          <SimpleGrid cols={2} className={classes.addressGrid}>
            <AddressCard />
            <AddressCard />
            <AddressCard />
            <AddressCard />
          </SimpleGrid>
          <Flex justify={"center"}>
            <Button className={classes.payButton}>Proceed To Pay</Button>
          </Flex>
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, md: 5.5, lg: 3.5 }}
          className={classes.gridColumn}
        >
          <Stack>
            <Flex align={"center"} justify={"start"}>
              <Image src={RestrauntLogo} className={classes.restaurantLogo} />

              <Flex direction={"column"}>
                <Title order={3}>{currentRestaurant}</Title>
                <Title order={5}>Hyderabad</Title>
              </Flex>
            </Flex>
            <Group>
              <Flex align={"center"}>
                <Image src={IconVeg} className={classes.icon} />
                <Text>Paneer Butter Masala</Text>
              </Flex>
              <Group>
                <Flex>
                  <Button variant="transparent" color="gray">
                    -
                  </Button>
                  0{" "}
                  <Button variant="transparent" color="green">
                    +
                  </Button>
                </Flex>
                <Text>100</Text>
              </Group>
            </Group>

            <Flex className={classes.infomsg}>
              <Checkbox />
              <Stack>
                <Title order={5}>Opt in for No-contact Delivery</Title>
                <Text>
                  Unwell, or avoiding contact? Please select no-contact
                  delivery. Partner will safely place the order outside your
                  door (not for COD)
                </Text>
              </Stack>
            </Flex>

            <Group>
              <Image src={IconVeg} className={"foodIcon"} />
              <Text>Apply Coupon</Text>
            </Group>
            <Title order={4}>Bill Details</Title>
            <Group justify="space-between">
              <Text>Item Total</Text>
              <Text>222</Text>
            </Group>
            <Group justify="space-between">
              <Text>Delivery Fee</Text>
              <Text>55</Text>
            </Group>
            <Group justify="space-between">
              <Text>GST & Other Charges</Text>
              <Text>14</Text>
            </Group>
            <Group justify="space-between">
              <Title order={5}>Total</Title>
              <Title order={5}>585</Title>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </section>
  );
};

export default Checkout;
