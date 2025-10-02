import { Box, Flex, Paper, Text, Title } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconStar from "../../../assets/icons/starFilled.svg?react";
import { setSelectedRestaurant } from "../../../redux/slices/restaurantSlie";
import { IRestaurant } from "../../../types";
import classes from "./RestaurantCard.module.css";
import { useRestaurant } from "../../../hooks/useRestaurant";

interface RestrauntCardProps {
  restaurant: IRestaurant;
}

const RestaurantCard = (props: RestrauntCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {setCurrentRestaurant} = useRestaurant();
  const handleClick = (address: string) => {
    dispatch(setSelectedRestaurant(props.restaurant));
    setCurrentRestaurant(JSON.stringify(props.restaurant))
    navigate("restaurant/" + address);
  };

  return (
    <Flex
      direction={"column"}
      className={classes.card}
      onClick={() =>
        handleClick(
          props.restaurant._id,
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
