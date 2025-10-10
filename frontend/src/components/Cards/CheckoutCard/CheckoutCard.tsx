import { Button, Flex, Group, Image, Text } from "@mantine/core";
import { useCart } from "../../../hooks/useCart";
import { ICartItem } from "../../../types";
import classes from "./CheckoutCard.module.css";
import IconVeg from "/icons/veg-icon.png";

interface ICheckoutCardProps {
  item: ICartItem;
}

const CheckoutCard = (props: ICheckoutCardProps) => {
  // console.log(props)
  const { removeItem } = useCart();
  const handleMinusBtn = () => {
    removeItem(props.item);
  };
  const handlePlusBtn = () => {};
  return (
    <Group>
      <Flex align={"center"}>
        <Image src={props.item.image_url || IconVeg} className={classes.icon} />
        <Text>{props.item.name}</Text>
      </Flex>
      <Group>
        <Flex>
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
    </Group>
  );
};

export default CheckoutCard;
