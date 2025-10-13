import { Box, Button, Flex, Group, Image, Text } from "@mantine/core";
import { useCart } from "../../../hooks/useCart";
import { ICartItem } from "../../../types";
import classes from "./CheckoutCard.module.css";
import IconVeg from "/icons/veg-icon.png";

interface ICheckoutCardProps {
  item: ICartItem;
}

const CheckoutCard = (props: ICheckoutCardProps) => {
  // console.log(props)
  const { addItem, removeItem, removeAllFromCart, cart } = useCart();

  const handleMinusBtn = () => {
    removeItem(props.item);

    if (cart.totalItems <= 1) {
      removeAllFromCart();
    }
  };

  const handlePlusBtn = () => {
    addItem(props.item);
  };

  return (
    <Group>
      <Flex align={"center"}>
        <Image src={props.item.image_url || IconVeg} className={classes.icon} />
        <Box>
          <Text>{props.item.name}</Text>
          {Object.entries(props.item.options).map(([key, value]) => (
            <Flex key={key}>
              {Array.isArray(value) ? (
                value.map((item, index) => (
                  <Text className="description_sm_bold" key={index}>
                    {item.label}
                  </Text>
                ))
              ) : (
                <Text className="description_sm_bold">{value.label}</Text>
              )}
            </Flex>
          ))}
        </Box>
        <Group>
          <Flex align={"center"}>
            <Button variant="transparent" color="gray" onClick={handleMinusBtn}>
              -
            </Button>
            {props.item.quantity}
            <Button variant="transparent" color="green" onClick={handlePlusBtn}>
              +
            </Button>
          </Flex>
          <Text>{props.item.price}</Text>
        </Group>
      </Flex>
    </Group>
  );
};

export default CheckoutCard;
