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
import Pizza from "/img/pizza.jpg";

const OrderCard = () => {
  const theme = useMantineTheme();
  return (
    <Flex direction={"column"} className={classes.mainContainer}>
      <Group className={classes.itemCard}>
        <Image src={Pizza} className={classes.itemImage} />
        <Box w={"82%"}>
          <Group justify={"space-between"}>
            <Text fw={"var(--font-weight-bold)"}>Bharat Family Restraunt</Text>
            <Text>Delivered on Sat, Aug 9, 2025. 07:59 PM</Text>
          </Group>
          <Stack>
            <Text size={theme.fontSizes.sm}>Sardar Patel Nagar</Text>
            <Text size={theme.fontSizes.sm} fw={"var(--font-weight-light)"}>
              ORDER #213717537502488 | Sat, Aug 9, 2025, 07:28 PM{" "}
            </Text>
            <Text fw={"var(--font-weight-bold)"} c={theme.colors.primary[6]}>
              VIEW DETAILS
            </Text>
          </Stack>
        </Box>
      </Group>
      <Stack >
        <Group justify="space-between">
          <Text fw={"var(--font-weight-semi-bold)"}>Chicken Masala x1</Text>
          <Text fw={"var(--font-weight-semi-bold)"}>Total Paid: 209</Text>
        </Group>
        <Group>
          <Button variant="unstyled">Reorder</Button>
          <Button>Help</Button>
        </Group>
      </Stack>
    </Flex>
  );
};

export default OrderCard;
