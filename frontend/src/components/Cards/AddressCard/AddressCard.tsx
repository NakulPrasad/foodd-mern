import {
  Button,
  Container,
  Flex,
  Image,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { SubText } from "../../Mantine/Subtext/SubText";
import classes from "./AddressCard.module.css";
import IconVeg from "/icons/veg-icon.png";

const AddressCard = () => {
  const theme = useMantineTheme();
  return (
    <Flex
      align={"flex-start"}
      justify={"space-around"}
      className={classes.main}
    >
      <Image src={IconVeg} className={"foodIcon"} mx={8} />
      <Container>
        <Title order={4} mb={theme.spacing.xs}>
          Home
        </Title>
        <SubText>
          Mukunda Jwellers, KPHB, Hyderabad, Telengana 826001, India
        </SubText>
        <Title order={5}>71 Mins</Title>
        <Button color="green"> Deliver Here</Button>
      </Container>
    </Flex>
  );
};
export default AddressCard;
