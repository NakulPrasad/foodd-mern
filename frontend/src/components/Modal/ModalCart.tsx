import {
  Button,
  Checkbox,
  Flex,
  Group,
  Modal,
  Radio,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";
import { IFoodItem } from "../../types";
import { IValue } from "../../types/cart.types";
import classes from "./ModalCart.module.css";

interface IModalCartProps {
  item: IFoodItem;
}

const ModalCart = (props: IModalCartProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { addItem,updateTaxAndFee } = useCart();

  const title = (
    <Flex direction={"column"}>
      <Text>
        {props.item.name} • ₹{props.item.price} - ₹{props.item.price + 650}
      </Text>
      <Title order={3}>Customise as per your taste</Title>
    </Flex>
  );

  const [value, setValue] = useState<
    Record<string, IValue | IValue[] | number>
  >({});
  const [totalPrice, setTotalPrice] = useState(0);
  // const dispatch = useAppDispatch();

  const cartItem = {
    id: props.item.id,
    restaurantId: props.item.restaurantId,
    restaurantName: props.item.restaurantName,
    name: props.item.name,
    price: totalPrice,
    options: value,
    quantity: 1,
  };

  const handleChange = (
    groupName: string,
    selectedValue: IValue | IValue[] | number,
  ) => {
    // console.log(groupName)
    setValue((prev) => ({
      ...prev,
      [groupName]: selectedValue,
    }));
  };

  const handleAddToCart = () => {
    // dispatch(addToCart(cartItem));
    addItem(cartItem);
    toast.success("Item Added successfully");
    // console.log(value);
    console.log("ModalCartProps", props);
    console.log("cartItem", cartItem);

    close();
  };

  useEffect(() => {
    // console.log(value);
    let calculatedTotal = props.item.price;

    Object.entries(value).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        // For arrays, parse each item and add the prices
        val.forEach((item) => {
          const price = Object.values(item)[1];
          calculatedTotal += parseInt(price, 10);
        });
      } else if (typeof val === "object") {
        // For strings, parse JSON and add the price
        const price = Object.values(val)[1];

        calculatedTotal += parseInt(price, 10);
      }
    });

    setTotalPrice(calculatedTotal);
  }, [value]);

  const handleClose = () => {
    close();
    setTotalPrice(props.item.price);
  };

  const handleAddClick = () => {
    if (props.item.options.length < 1) {
      handleAddToCart();
      return;
      // close();
    }
    open();
  };

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title={title} centered>
        <Flex direction={"column"} className={classes.modalBody}>
          {props.item.options.map((option, index) => (
            <div key={index}>
              {option.type === "checkbox" && (
                <Checkbox.Group
                  onChange={(selectedValues) =>
                    handleChange(
                      option.name,
                      selectedValues.map((selected) => JSON.parse(selected)),
                    )
                  }
                  label={`Choose ${option.name}`}
                >
                  {option.values.map((v, idx) => (
                    <Checkbox
                      key={idx}
                      value={JSON.stringify({ label: v.label, price: v.price })}
                      className={classes.checkbox}
                      label={
                        <Flex justify={"space-around"}>
                          <Text>{v.label}</Text>
                          <Text>{v.price}</Text>
                        </Flex>
                      }
                    />
                  ))}
                </Checkbox.Group>
              )}
              {option.type === "select" && (
                <Radio.Group
                  required
                  onChange={(selectedValues) =>
                    handleChange(option.name, JSON.parse(selectedValues))
                  }
                  label={`Choose ${option.name}`}
                >
                  {option.values.map((v, idx) => (
                    <Radio
                      key={idx}
                      value={JSON.stringify({ label: v.label, price: v.price })}
                      label={
                        <Flex justify={"space-around"}>
                          <Text>{v.label} - </Text>
                          <Text>{v.price}</Text>
                        </Flex>
                      }
                    />
                  ))}
                </Radio.Group>
              )}
            </div>
          ))}
        </Flex>

        <Group>
          {totalPrice}
          <Button onClick={handleAddToCart}>Add Item to cart</Button>
        </Group>
      </Modal>

      <Button onClick={handleAddClick}>ADD</Button>
    </>
  );
};

export default ModalCart;
