import { Flex, Image, Box, Text, Title, useMantineTheme } from "@mantine/core"
import DealOfDay from '/icons/deal-of-day.png'
import classes from './CouponCard.module.css'
import { ICoupon } from "../../types/coupon.types"

interface ICouponProps{
  coupon: ICoupon
}


const CouponCard = (props : ICouponProps) => {
  const theme = useMantineTheme();
  return (
    <Flex id="couponcard" p={theme.spacing.md} className={classes.couponcard}>
        <Image src={DealOfDay} className={classes.icon} />
        <Box><Title order={4} >{props.coupon.title}</Title>
        <Text className="description_sm_bold">{props.coupon.validity.end_date}</Text>
        </Box>
    </Flex>
  )
}

export default CouponCard