import { Box, Flex, Image, Text } from "@mantine/core";
import { useCart } from "../../../hooks/useCart";
import { ICartItem } from "../../../types";
import classes from "./CheckoutCard.module.css";
import IconNonVeg from "/icons/non-veg-icon.png";
import IconVeg from "/icons/veg-icon.png";

interface ICheckoutCardProps {
  item: ICartItem;
}

const CheckoutCard = (props: ICheckoutCardProps) => {
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
    <Flex align="center" justify="space-between" className={classes.container}>
      <Flex align="flex-start" gap="xs" style={{ flex: 1 }}>
        <Image src={props.item.is_veg ? IconVeg : IconNonVeg} style={{ width: 14, height: 14, marginTop: 3 }} />
        <Box>
          <Text fw={600} size="sm" style={{ color: "#0f172a" }}>
            {props.item.name}
          </Text>
          {props.item.options &&
            Object.entries(props.item.options).map(([key, value]) => (
              <Flex key={key}>
                {Array.isArray(value) ? (
                  value.map((item, index) => (
                    <Text size="xs" c="dimmed" key={index}>
                      {item.label}
                    </Text>
                  ))
                ) : (
                  <Text size="xs" c="dimmed">{value.label}</Text>
                )}
              </Flex>
            ))}
        </Box>
      </Flex>

      <Flex align="center" gap="md">
        <div className={classes.qtyBox}>
          <button className={classes.qtyBtn} onClick={handleMinusBtn}>-</button>
          <span className={classes.qtyText}>{props.item.quantity}</span>
          <button className={classes.qtyBtn} onClick={handlePlusBtn}>+</button>
        </div>
        <Text fw={700} size="sm" style={{ minWidth: 50, textAlign: "right", color: "#0f172a" }}>
          ₹{props.item.price}
        </Text>
      </Flex>
    </Flex>
  );
};

export default CheckoutCard;
