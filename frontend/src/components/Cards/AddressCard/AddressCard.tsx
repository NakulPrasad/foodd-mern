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
import IconHome from "/icons/veg-icon.png";

interface AddressCardProps {
  label: string;
  address: string;
  deliveryTime?: string;
  isSelected?: boolean;
  onSelect: (address: string) => void;
}

const AddressCard = ({
  label,
  address,
  deliveryTime,
  isSelected,
  onSelect,
}: AddressCardProps) => {
  const theme = useMantineTheme();

  return (
    <Flex
      align={"flex-start"}
      justify={"space-around"}
      className={`${classes.main} ${isSelected ? classes.selected : ""}`}
    >
      <Image src={IconHome} className={"foodIcon"} mx={8} />
      <Container>
        <Title order={4} mb={theme.spacing.xs}>
          {label}
        </Title>
        <SubText>{address}</SubText>
        {deliveryTime && <Title order={5}>{deliveryTime}</Title>}
        <Button
          color={isSelected ? "green" : "gray"}
          variant={isSelected ? "filled" : "outline"}
          mt={theme.spacing.xs}
          onClick={() => onSelect(address)}
        >
          {isSelected ? "✓ Selected" : "Deliver Here"}
        </Button>
      </Container>
    </Flex>
  );
};

export default AddressCard;
