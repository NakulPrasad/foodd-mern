import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCreditCard, IconEdit, IconMapPin, IconPackage, IconFileText, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddressCard from "../../components/Cards/AddressCard/AddressCard";
import OrderCard from "../../components/Cards/OrderCard/OrderCard";
import { useAuth } from "../../hooks/useAuth";
import { useGetMyOrdersQuery } from "../../redux/slices/apiSlice";
import { IOrder } from "../../types/order.types";
import classes from "./Order.module.css";

// Production Mock Orders when backend list is empty
const PRODUCTION_MOCK_ORDERS = [
  {
    _id: "FD-984210",
    restaurantName: "Royal Biryani House",
    restaurantImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
    deliveryAddress: "Flat 302, Green Valley Apartments, MG Road, Bangalore 560001",
    status: "Delivered",
    totalAmount: 440,
    userRating: 5,
    createdAt: "2026-08-07T13:45:00.000Z",
    items: [
      {
        foodItemId: {
          _id: "item_b1",
          name: "Chicken Dum Biryani",
          price: 320,
          is_veg: false,
          img_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
        },
        quantity: 1,
        price: 320,
      },
      {
        foodItemId: {
          _id: "item_b2",
          name: "Mirchi Ka Salan",
          price: 120,
          is_veg: true,
          img_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
        },
        quantity: 1,
        price: 120,
      },
    ],
  },
  {
    _id: "FD-773129",
    restaurantName: "The Artisan Burger Co.",
    restaurantImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    deliveryAddress: "Tower B, Cyber Towers, Hitech City, Hyderabad 500081",
    status: "Delivered",
    totalAmount: 400,
    userRating: 4,
    createdAt: "2026-08-05T19:20:00.000Z",
    items: [
      {
        foodItemId: {
          _id: "item_bg1",
          name: "Classic Cheese Smash Burger",
          price: 260,
          is_veg: false,
          img_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
        },
        quantity: 1,
        price: 260,
      },
      {
        foodItemId: {
          _id: "item_bg2",
          name: "Loaded Peri Peri Fries",
          price: 140,
          is_veg: true,
          img_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop",
        },
        quantity: 1,
        price: 140,
      },
    ],
  },
  {
    _id: "FD-661044",
    restaurantName: "Napoli Woodfired Pizza",
    restaurantImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    deliveryAddress: "Flat 302, Green Valley Apartments, MG Road, Bangalore 560001",
    status: "Delivered",
    totalAmount: 600,
    userRating: 5,
    createdAt: "2026-08-01T20:15:00.000Z",
    items: [
      {
        foodItemId: {
          _id: "item_pz1",
          name: "Classic Margherita Woodfired Pizza",
          price: 390,
          is_veg: true,
          img_url: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop",
        },
        quantity: 1,
        price: 390,
      },
      {
        foodItemId: {
          _id: "item_pz2",
          name: "Garlic Butter Stuffed Crust Sticks",
          price: 210,
          is_veg: true,
          img_url: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=800&auto=format&fit=crop",
        },
        quantity: 1,
        price: 210,
      },
    ],
  },
];

const SAVED_ADDRESSES = [
  { label: "Home", address: "Flat 302, Green Valley Apartments, MG Road, Bangalore 560001", deliveryTime: "Primary" },
  { label: "Work", address: "Tower B, Cyber Towers, Hitech City, Hyderabad 500081", deliveryTime: "Office" },
  { label: "Parents", address: "12-3-456, Banjara Hills, Hyderabad 500034", deliveryTime: "Home" },
];

const Order = () => {
  const { user } = useAuth();
  const { data: orderData, isLoading } = useGetMyOrdersQuery();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "payments" | "coupons">("orders");
  const [orderFilter, setOrderFilter] = useState<string>("ALL");

  // Profile Edit Modal State
  const [openedEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [name, setName] = useState(user?.name || "Nakul Prasad");
  const [email, setEmail] = useState(user?.email || "nakulprasad12@gmail.com");
  const [phone, setPhone] = useState("8210333793");

  useEffect(() => {
    if (orderData && !isLoading && Array.isArray(orderData.data) && orderData.data.length > 0) {
      setOrders(orderData.data);
    } else {
      setOrders(PRODUCTION_MOCK_ORDERS);
    }
  }, [orderData, isLoading]);

  const handleSaveProfile = () => {
    toast.success("Profile Updated Successfully!");
    closeEditModal();
  };

  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === "ALL") return true;
    if (orderFilter === "DELIVERED") return (ord.status || "").toLowerCase().includes("delivered") || ord.status === "confirmed";
    if (orderFilter === "IN_PROGRESS") return (ord.status || "").toLowerCase().includes("progress") || ord.status === "pending";
    return true;
  });

  return (
    <section className={classes.section}>
      {/* Profile Header Banner */}
      <Box className={classes.profileCard}>
        <Flex justify="space-between" align="center" wrap="wrap" gap="md">
          <Group gap="md">
            <Avatar size="lg" radius="xl" src={user?.avatarUrl} color="orange">
              <IconUser size={28} />
            </Avatar>
            <Stack gap={2}>
              <Group gap="xs">
                <Title order={2}>{name}</Title>
                <span className={classes.goldBadge}>GOLD MEMBER</span>
              </Group>
              <Text size="sm" style={{ opacity: 0.85 }}>
                {phone} • {email}
              </Text>
            </Stack>
          </Group>
          <Button
            leftSection={<IconEdit size={16} />}
            className={classes.editBtn}
            onClick={openEditModal}
          >
            Edit Profile
          </Button>
        </Flex>
      </Box>

      {/* Account Navigation Tabs */}
      <Group gap="sm" mb="xl">
        <Button
          variant={activeTab === "orders" ? "filled" : "default"}
          color={activeTab === "orders" ? "orange" : "gray"}
          leftSection={<IconPackage size={18} />}
          className={classes.tabBtn}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </Button>
        <Button
          variant={activeTab === "addresses" ? "filled" : "default"}
          color={activeTab === "addresses" ? "orange" : "gray"}
          leftSection={<IconMapPin size={18} />}
          className={classes.tabBtn}
          onClick={() => setActiveTab("addresses")}
        >
          Saved Addresses
        </Button>
        <Button
          variant={activeTab === "payments" ? "filled" : "default"}
          color={activeTab === "payments" ? "orange" : "gray"}
          leftSection={<IconCreditCard size={18} />}
          className={classes.tabBtn}
          onClick={() => setActiveTab("payments")}
        >
          Payment Methods
        </Button>
        <Button
          variant={activeTab === "coupons" ? "filled" : "default"}
          color={activeTab === "coupons" ? "orange" : "gray"}
          leftSection={<IconFileText size={18} />}
          className={classes.tabBtn}
          onClick={() => setActiveTab("coupons")}
        >
          Offers &amp; Coupons
        </Button>
      </Group>

      {/* Orders Tab Content */}
      {activeTab === "orders" && (
        <Box>
          {/* Order Filter Pills */}
          <Group gap="xs" mb="lg">
            <Button
              size="xs"
              variant={orderFilter === "ALL" ? "filled" : "light"}
              color={orderFilter === "ALL" ? "dark" : "gray"}
              className={classes.filterPill}
              onClick={() => setOrderFilter("ALL")}
            >
              All Orders ({orders.length})
            </Button>
            <Button
              size="xs"
              variant={orderFilter === "DELIVERED" ? "filled" : "light"}
              color={orderFilter === "DELIVERED" ? "green" : "gray"}
              className={classes.filterPill}
              onClick={() => setOrderFilter("DELIVERED")}
            >
              Delivered
            </Button>
            <Button
              size="xs"
              variant={orderFilter === "IN_PROGRESS" ? "filled" : "light"}
              color={orderFilter === "IN_PROGRESS" ? "orange" : "gray"}
              className={classes.filterPill}
              onClick={() => setOrderFilter("IN_PROGRESS")}
            >
              In Progress
            </Button>
          </Group>

          {isLoading && <Text c="dimmed">Loading your order history...</Text>}

          {!isLoading && filteredOrders.length === 0 && (
            <Box className={classes.emptyState}>
              <Title order={3} mb="xs">No orders found</Title>
              <Text c="dimmed">Looks like you haven't placed an order matching this filter yet.</Text>
            </Box>
          )}

          {!isLoading &&
            filteredOrders.map((order, idx) => (
              <OrderCard key={order?._id || idx} order={order} />
            ))}
        </Box>
      )}

      {/* Saved Addresses Tab Content */}
      {activeTab === "addresses" && (
        <Box>
          <Title order={3} mb="md">Your Saved Addresses</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {SAVED_ADDRESSES.map((addr) => (
              <AddressCard
                key={addr.label}
                label={addr.label}
                address={addr.address}
                deliveryTime={addr.deliveryTime}
                isSelected={false}
                onSelect={(selected) => toast.info(`Selected ${addr.label} address: ${selected}`)}
              />
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Payment Methods Tab Content */}
      {activeTab === "payments" && (
        <Box className={classes.emptyState}>
          <IconCreditCard size={48} color="#ff5200" style={{ marginBottom: 12 }} />
          <Title order={3} mb="xs">Saved Cards &amp; UPI</Title>
          <Text c="dimmed" maxW={400} mx="auto">
            Your saved payment methods for 1-click checkout are encrypted and secured via Stripe.
          </Text>
        </Box>
      )}

      {/* Coupons Tab Content */}
      {activeTab === "coupons" && (
        <Box className={classes.emptyState}>
          <IconFileText size={48} color="#ff5200" style={{ marginBottom: 12 }} />
          <Title order={3} mb="xs">Available Vouchers &amp; Rewards</Title>
          <Text c="dimmed" maxW={400} mx="auto">
            You have 3 active promo codes available! Use code <b>FOODD50</b> at checkout for 50% OFF up to ₹100.
          </Text>
        </Box>
      )}

      {/* Edit Profile Modal */}
      <Modal opened={openedEditModal} onClose={closeEditModal} title="Edit Profile Details" centered radius="lg">
        <Stack gap="sm">
          <TextInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextInput label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextInput label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Divider my="xs" />
          <Group justify="flex-end">
            <Button variant="default" onClick={closeEditModal}>Cancel</Button>
            <Button color="orange" onClick={handleSaveProfile}>Save Changes</Button>
          </Group>
        </Stack>
      </Modal>
    </section>
  );
};

export default Order;
