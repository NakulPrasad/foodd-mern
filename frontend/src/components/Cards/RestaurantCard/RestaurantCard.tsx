import { Box, Flex, Paper, Text, Title } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import IconStar from "../../../assets/icons/starFilled.svg?react";
import classes from "./RestaurantCard.module.css";
import { IRestaurant } from "../../../screens/Restaurant/Restaurant";

interface RestrauntCardProps {
  restaurant: IRestaurant;
}

const RestaurantCard = (props: RestrauntCardProps) => {
  const navigate = useNavigate();
  const handleClick = (address: string) => {
    navigate("restaurant/" + address);
  };

  return (
    <Flex
      direction={"column"}
      className={classes.card}
      onClick={() =>
        handleClick(
          props.restaurant.name + "-" + props.restaurant.location.area,
        )
      }
    >
      <Paper
        p="xl"
        radius="md"
        style={{ backgroundImage: `url(${props.restaurant.image})` }}
        className={classes.image}
      ></Paper>
      <Box className={classes.wrapper}>
        <Title order={4} className={classes.h4}>
          {props.restaurant.name}
        </Title>
        <Flex align={"center"}>
          <IconStar />
          <Flex className={classes.mt}>
            <Title order={5}>
              {props.restaurant.rating} <IconPointFilled size={9} />{" "}
              {props.restaurant.deliveryTime}
            </Title>
          </Flex>
        </Flex>
        <Text className={classes.description}>
          {props.restaurant.cuisine.map((item) => item + " ")}
        </Text>
        <Text className={classes.description}>
          {props.restaurant.location.area}
        </Text>
      </Box>
    </Flex>
  );
};

export default RestaurantCard;
