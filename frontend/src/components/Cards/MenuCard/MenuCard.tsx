import { Box, Flex, Image, Text, Title, useMantineTheme } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { IFoodItem } from "../../../types/cart.types";
import ModalCart from "../../Modal/ModalCart";
import classes from "./MenuCard.module.css";
import IconVeg from "/icons/veg-icon.png";
import Pizza from "/img/pizza.jpg";

interface IMenuCardProps {
  foodItem: IFoodItem;
  // category?: string
}

const MenuCard = (props: IMenuCardProps) => {
  const theme = useMantineTheme();
  // console.log(props.foodItem)

  return (
    <Flex justify={"space-between"} className={classes.bd}>
      <Flex direction={"column"}>
        <Box>
          <Image src={IconVeg} className={classes.icon} />
        </Box>
        <Title order={3} pb={theme.spacing.xs}>
          {props.foodItem.name}
        </Title>
        <Title order={4} pb={theme.spacing.xs}>₹{props.foodItem.price}</Title>
        <Flex pb={theme.spacing.xs}>
          <IconStarFilled color="green" size={14} />

          <Title order={4} className="rating">
            {props.foodItem.rating}(27)
          </Title>
        </Flex>
        <Text className="description">{props.foodItem.description}</Text>
      </Flex>
      <Flex
        direction={"column"}
        justify={"center"}
        align={"center"}
        className={classes.ml}
      >
        <Image radius={theme.radius.sm} src={Pizza} className={classes.img} />
        <Flex direction={"column"} className={classes.translate}>
          <ModalCart item={props.foodItem} />
          
          <Text className="description_sm">Customisable</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MenuCard;
