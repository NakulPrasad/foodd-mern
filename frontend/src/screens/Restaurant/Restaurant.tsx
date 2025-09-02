import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Box,
  Divider,
  Flex,
  Input,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import IconStar from "../../assets/icons/starFilled.svg?react";
import MenuCard from "../../components/Cards/MenuCard/MenuCard";
import CustomCrousel from "../../components/Carousel/Carousel";
import CouponCard from "../../components/CouponCard/CouponCard";
import classes from "./Restaurant.module.css";
import  IconwaveLeft from "../../assets/icons/waveLeft.svg?react"
import { foodItems, foodItems_category } from "../../utils/dummyData";
import IconwaveRight from "../../assets/icons/waveRight.svg?react"
import { coupons } from "../../utils/dummyData";
const Restaurant = () => {
  const theme = useMantineTheme();

  const items = foodItems_category.map((item, index) => (

    <Accordion.Item key={index} value={item.category}>
      <Accordion.Control>
        <Title order={3}>{item.category}</Title>
      </Accordion.Control>
      {
        item.items.map((food, index)=>{
          return(<Accordion.Panel key={index}>
            <MenuCard foodItem = {food}/>
            <Divider my="md" />
          </Accordion.Panel>
          )

        })
      }
      
      <Divider my="md" />
    </Accordion.Item>
  ));

  return (
    <section>
      <main id="restraunt" className={classes.section_m}>
        <Title py={theme.spacing.md} order={2}>
          Domino's Pizza
        </Title>
        <Flex
          direction={"column"}
          className={classes.overview}
          p={theme.spacing.md}
        >
          <Flex align={"center"}>
            <IconStar />
            <Flex className={classes.mt}>
              <Title order={4}>4.3 (7.1K+ ratings) • ₹600 for two</Title>
            </Flex>
          </Flex>
          <Text>Burgers, American</Text>
          <Flex direction={"column"}>
            <Text>Outlet </Text>
            <Text>Does not deliver </Text>
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
            {coupons.map((coupon, index)=>{
              return(

                <Carousel.Slide key={index}>
               <CouponCard coupon={coupon} />
             </Carousel.Slide>
              )
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
          <IconwaveLeft/>
          <Title order={5} className={classes.menu_text}>
            MENU
          </Title>
          <IconwaveRight/>
        </Flex>

        {/* <Input.Wrapper>
          <Input variant="filled" placeholder="Search for dishes" />
        </Input.Wrapper> */}

        <Accordion variant="filled" defaultValue="Apples">
          {items}
        </Accordion>
      </section>
    </section>
  );
};

export default Restaurant;
