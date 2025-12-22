import { Carousel } from "@mantine/carousel";
import {
  Box,
  Divider,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { toast } from "react-toastify";
import CollectionCard from "../../components/Cards/CollectionCard/CollectionCard";
import RestaurantCard from "../../components/Cards/RestaurantCard/RestaurantCard";
import CustomCarousel from "../../components/Carousel/Carousel";
import { useLocation } from "../../hooks/useLocation";
import { useRestaurant } from "../../hooks/useRestaurant";
import { IRestaurant } from "../../types";
import classes from "./City.module.css";
import Biryani from "/img/foodCategory/biryani.png";
import Burger from "/img/foodCategory/burger.png";
import Chinese from "/img/foodCategory/chinese.png";
import CityHeader from "/img/homepage/city_header.png";

const City = () => {
  const theme = useMantineTheme();

  const { city } = useLocation();

  const { allRestaurantJson, isLoading, error } = useRestaurant();

  return (
    <section id="city">
      {error && toast.warn("Something went wrong")}
      <header id="banner">
        <Flex
          align={"center"}
          justify={"space-around"}
          className={classes.bg_gradient}
        >
          <Box className={classes.mw}>
            <Title order={1} textWrap="balance" className="h1">
              Order Food <br />
              Online in {city}
            </Title>
            <svg
              width="128px"
              height="10px"
              viewBox="0 0 78 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.25939C27 -0.240624 53.5 -0.2406 77 4.25939"
                stroke="#FF5200"
                strokeWidth="1.5"
              ></path>
            </svg>
          </Box>

          <Image
            src={CityHeader}
            alt=""
            height={300}
            fit="cover"
            className={classes.bg_tansparent}
          />
        </Flex>
      </header>
      <section id="suggestions" className={classes.section_m}>
        <CustomCarousel
          title="What's on your mind?"
          slideSize={{ base: "26%", md: "12%" }}
          slideGap={{ base: "sm", md: "sm" }}
          align="start"
          slidesToScroll={2}
        >
          <Carousel.Slide>
            <CollectionCard image={Biryani} />
          </Carousel.Slide>
          <Carousel.Slide>
            <CollectionCard image={Burger} />
          </Carousel.Slide>
          <Carousel.Slide>
            <CollectionCard image={Chinese} />
          </Carousel.Slide>
        </CustomCarousel>
      </section>
      <section id="topbrands" className={classes.section_m}>
        <CustomCarousel
          title={`Top restaurant chains in ${city}`}
          slideSize={"30%"}
          slideGap={"xl"}
          align="start"
          slidesToScroll={2}
          className="px-5"
        >
          {allRestaurantJson?.data?.map((restaurant: IRestaurant) => {
            return (
              <Carousel.Slide key={restaurant._id}>
                <RestaurantCard restaurant={restaurant} />
              </Carousel.Slide>
            );
          })}
        </CustomCarousel>
      </section>
      <Divider className={classes.divider} />
      <section id="restaurants" className={classes.section_m}>
        <Title order={2} py={theme.spacing.md}>
          Restaurants with online food delivery in {city}
        </Title>
        <SimpleGrid
          cols={4}
          spacing={theme.spacing.xl}
          // onClick={(e) => console.log(e.target)}
        >
          {!isLoading && error && <Text>Loading ...</Text>}
          {/* {restaurants.map((restaurant, index) => {
            return <RestaurantCard restaurant={restaurant} key={index} />;
          })} */}
          {allRestaurantJson?.data?.map((restaurant: IRestaurant) => {
            return (
              <RestaurantCard restaurant={restaurant} key={restaurant._id} />
            );
          })}
        </SimpleGrid>
      </section>
    </section>
  );
};

export default City;
