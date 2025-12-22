import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Box,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IconStar from "../../assets/icons/starFilled.svg?react";
import IconwaveLeft from "../../assets/icons/waveLeft.svg?react";
import IconwaveRight from "../../assets/icons/waveRight.svg?react";
import MenuCard from "../../components/Cards/MenuCard/MenuCard";
import CustomCrousel from "../../components/Carousel/Carousel";
import CouponCard from "../../components/CouponCard/CouponCard";
import { useGetRestaurantByIdQuery } from "../../redux/slices/apiSlice";
import { IFoodItem, IRestaurant } from "../../types";
import { coupons } from "../../utils/dummyData";
import classes from "./Restaurant.module.css";

interface ICategoryGroup {
  category: string;
  items: IFoodItem[];
}

function groupMenuByCategory(apiData: IRestaurant) {
  if (!apiData) {
    return;
  }
  const groupedMenu: ICategoryGroup[] = apiData.menu.reduce<ICategoryGroup[]>(
    (acc, item) => {
      let categoryGroup = acc.find((cat) => cat.category === item.category);
      if (!categoryGroup) {
        categoryGroup = { category: item.category, items: [] };
        acc.push(categoryGroup);
      }

      categoryGroup.items.push({
        _id: item._id,
        restaurantId: apiData._id,
        name: item.name,
        restaurantName: apiData.name,
        description: item.description || "",
        price: item.price,
        img_url: item.img_url || "https://via.placeholder.com/150",
        rating: item.rating || 0,
        is_veg: item.is_veg,
        options: item.options || [],
        category: item.category,
      });

      return acc;
    },
    [],
  );

  return groupedMenu;
}

const Restaurant = () => {
  const theme = useMantineTheme();
  const { id } = useParams();
  if (!id) return <Text>Restaurant not found</Text>;
  const [items, setItems] = useState<JSX.Element[]>([]);
  const { data: restaurantData, isLoading } = useGetRestaurantByIdQuery(id);

  useEffect(() => {
    if (restaurantData && !isLoading) {
      const groupedCategory: ICategoryGroup[] =
        groupMenuByCategory(restaurantData.data) ?? [];
      // const groupedCategory = groupMenuByCategory(restaurantData);
      // console.log(groupedCategory);

      const foodItems = groupedCategory?.map((item, index) => (
        <Accordion.Item key={index} value={item.category}>
          <Accordion.Control>
            <Title order={3}>{item.category}</Title>
          </Accordion.Control>
          {item.items.map((food) => {
            return (
              <Accordion.Panel key={food._id}>
                <MenuCard foodItem={food} />
                <Divider my="md" />
              </Accordion.Panel>
            );
          })}

          <Divider my="md" />
        </Accordion.Item>
      ));

      setItems(foodItems);
    }
  }, [restaurantData]);

  return (
    <section>
      {isLoading && <p>Loading...</p>}
      <main id="restaurant" className={classes.section_m}>
        <Title py={theme.spacing.md} order={2}>
          {restaurantData?.data?.name || "{Title}"}
        </Title>
        <Flex
          direction={"column"}
          className={classes.overview}
          p={theme.spacing.md}
        >
          <Flex align={"center"}>
            <IconStar />
            <Flex className={classes.mt}>
              <Title order={4}>
                {restaurantData?.data?.rating} (7.1K+ ratings) •
                {restaurantData?.data?.priceRange}
              </Title>
            </Flex>
          </Flex>
          <Group id="cuisine">
            {restaurantData?.data?.cuisine?.map((cuisine, index) => (
              <Text key={index}>{cuisine}</Text>
            ))}
          </Group>
          <Flex direction={"column"}>
            <Text>Outlet </Text>
            <Text fw={"var(--font-weight-bold)"}>Does not deliver </Text>
          </Flex>
        </Flex>
        <Box mb={16} mt={16}>
          <CustomCrousel
            title="Deals for you"
            slideSize={"40%"}
            slideGap={"xl"}
            align="start"
            slidesToScroll={2}
            className="px-5"
          >
            {coupons.map((coupon, index) => {
              return (
                <Carousel.Slide key={index}>
                  <CouponCard coupon={coupon} />
                </Carousel.Slide>
              );
            })}
          </CustomCrousel>
        </Box>
      </main>
      <section className={classes.section_m}>
        <Flex
          content="center"
          justify={"center"}
          className={classes.menu_text_div}
        >
          <IconwaveLeft />
          <Title order={5} className={classes.menu_text}>
            MENU
          </Title>
          <IconwaveRight />
        </Flex>

        {/* <Input.Wrapper>
          <Input variant="filled" placeholder="Search for dishes" />
        </Input.Wrapper> */}

        <Accordion variant="filled" defaultValue="pizza">
          {items}
        </Accordion>
      </section>
    </section>
  );
};

export default Restaurant;
