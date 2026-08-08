import {
  Box,
  Button,
  Flex,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { IconBriefcase, IconHome, IconMapPin } from "@tabler/icons-react";
import classes from "./AddressCard.module.css";

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
  const getIcon = () => {
    switch (label.toLowerCase()) {
      case "home":
        return <IconHome size={20} color="#ff5200" />;
      case "work":
        return <IconBriefcase size={20} color="#ff5200" />;
      default:
        return <IconMapPin size={20} color="#ff5200" />;
    }
  };

  return (
    <Box
      className={`${classes.main} ${isSelected ? classes.selected : ""}`}
      onClick={() => onSelect(address)}
    >
      <Box>
        <Group justify="space-between" align="center" mb={6}>
          <Group gap="xs">
            {getIcon()}
            <Title order={4}>{label}</Title>
          </Group>
          {deliveryTime && (
            <Text size="xs" fw={700} c="#16a34a" bg="#dcfce7" px={8} py={2} style={{ borderRadius: 6 }}>
              {deliveryTime}
            </Text>
          )}
        </Group>
        <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>
          {address}
        </Text>
      </Box>
      <Flex mt="md">
        <Button
          fullWidth
          size="xs"
          color={isSelected ? "orange" : "gray"}
          variant={isSelected ? "filled" : "outline"}
          className={classes.addressBtn}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(address);
          }}
        >
          {isSelected ? "✓ DELIVER HERE" : "SELECT ADDRESS"}
        </Button>
      </Flex>
    </Box>
  );
};

export default AddressCard;
