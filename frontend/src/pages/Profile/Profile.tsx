import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import {
  IconAddressBook,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/reduxHooks";
import { RootState } from "../../redux/store";
import classes from "./Profile.module.css";

const Profile = () => {
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const navigate = useNavigate();

  // Local state for editable profile fields (fallback to default value if empty)
  const [name, setName] = useState(user?.name || "Nakul Prasad Mahato");
  const [email, setEmail] = useState(user?.email || "nakulprasad10@gmail.com");
  const [phone, setPhone] = useState(user?.phoneNumber || "8210333793");
  const [location, setLocation] = useState(user?.location || "Hyderabad, India");
  const [bio, setBio] = useState(
    user?.bio || "Food enthusiast and software engineer. Love Dum Biryani and Burgers."
  );

  // Pref states
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  // Address states
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      street: "12/A Jubilee Hills Main Road",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500033",
      country: "India",
    },
    {
      id: 2,
      type: "Work",
      street: "Tech Park, Phase 2, Gachibowli",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500046",
      country: "India",
    },
  ]);

  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPostal, setNewPostal] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile details saved successfully! 🎉");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostal) {
      toast.warning("Please fill in all address fields");
      return;
    }
    const newAddr = {
      id: Date.now(),
      type: "Other",
      street: newStreet,
      city: newCity,
      state: newState || "Telangana",
      postalCode: newPostal,
      country: "India",
    };
    setAddresses((prev) => [...prev, newAddr]);
    setNewStreet("");
    setNewCity("");
    setNewState("");
    setNewPostal("");
    setShowAddAddress(false);
    toast.success("New address added successfully! 🏠");
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.info("Address deleted");
  };

  if (!isAuthenticated) {
    return (
      <main id="profile" className={classes.section_m}>
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          style={{ maxWidth: 500, margin: "6rem auto", textAlign: "center", border: "1px solid #e2e8f0" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <Title order={2} c="#0f172a" mb="xs">
            Sign In Required
          </Title>
          <Text size="sm" c="dimmed" mb="xl">
            You must be logged in to view your profile settings, saved addresses, and preferences.
          </Text>
          <Button color="orange" size="md" radius="md" onClick={() => navigate("/")}>
            Go Back Home
          </Button>
        </Paper>
      </main>
    );
  }

  const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`;

  return (
    <main id="profile" className={classes.section_m}>
      {/* ─── Profile Header / Cover Banner ─── */}
      <div className={classes.profileHeader}>
        <div className={classes.coverBanner} />
        <div className={classes.avatarRow}>
          <div className={classes.avatarWrap}>
            <Avatar src={avatarUrl} size={110} radius="xl" className={classes.avatar} />
          </div>
          <div className={classes.headerMeta}>
            <Title order={2} className={classes.userName}>
              {name}
            </Title>
            <Text size="sm" c="dimmed" className={classes.userJoined}>
              📅 Joined August 2026
            </Text>
          </div>
        </div>
      </div>

      {/* ─── Main Tabs section ─── */}
      <Tabs defaultValue="profile" orientation="horizontal" className={classes.tabsContainer} color="orange">
        <Tabs.List className={classes.tabList}>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />} className={classes.tab}>
            Profile Details
          </Tabs.Tab>
          <Tabs.Tab value="addresses" leftSection={<IconAddressBook size={16} />} className={classes.tab}>
            Saved Addresses
          </Tabs.Tab>
          <Tabs.Tab value="preferences" leftSection={<IconSettings size={16} />} className={classes.tab}>
            Preferences
          </Tabs.Tab>
        </Tabs.List>

        <div className={classes.tabContent}>
          {/* ─── Profile details tab ─── */}
          <Tabs.Panel value="profile">
            <Grid gutter={{ base: "md", md: "xl" }}>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder radius="lg" p="xl" bg="#ffffff">
                  <Title order={3} mb="lg" c="#0f172a" fw={800}>
                    Personal Information
                  </Title>
                  <form onSubmit={handleProfileSave}>
                    <Stack gap="md">
                      <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            radius="md"
                            required
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Email Address"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            radius="md"
                            required
                            disabled
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Phone Number"
                            placeholder="+91 9999999999"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            radius="md"
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Location"
                            placeholder="City, Country"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            radius="md"
                          />
                        </Grid.Col>
                      </Grid>

                      <Textarea
                        label="Bio"
                        placeholder="Write a little about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        radius="md"
                        rows={4}
                      />

                      <Button type="submit" color="orange" radius="md" mt="sm" style={{ alignSelf: "flex-start" }}>
                        Save Changes
                      </Button>
                    </Stack>
                  </form>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper withBorder radius="lg" p="xl" bg="#ffffff">
                  <Title order={3} mb="md" c="#0f172a" fw={800}>
                    Account Status
                  </Title>
                  <Stack gap="sm">
                    <Flex align="center" gap="sm">
                      <div className={classes.statusDot} />
                      <Text size="sm" fw={600} c="#0f172a">Verified Customer</Text>
                    </Flex>
                    <Divider my="xs" />
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Account ID</Text>
                      <Text size="xs" fw={700} c="#0f172a">#FD-{user?.id || 1024}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Joined on</Text>
                      <Text size="xs" fw={700} c="#0f172a">Aug 8, 2026</Text>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* ─── Saved addresses tab ─── */}
          <Tabs.Panel value="addresses">
            <Flex justify="space-between" align="center" mb="lg">
              <Title order={3} c="#0f172a" fw={800}>
                Manage Addresses
              </Title>
              {!showAddAddress && (
                <Button variant="light" color="orange" radius="md" onClick={() => setShowAddAddress(true)}>
                  + Add Address
                </Button>
              )}
            </Flex>

            {showAddAddress && (
              <Paper withBorder radius="lg" p="xl" mb="lg" bg="#ffffff">
                <Title order={4} mb="md">Add New Address</Title>
                <form onSubmit={handleAddAddress}>
                  <Stack gap="md">
                    <TextInput
                      label="Street Address"
                      placeholder="Flat, building, street..."
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      radius="md"
                      required
                    />
                    <Grid gutter="md">
                      <Grid.Col span={{ base: 6 }}>
                        <TextInput
                          label="City"
                          placeholder="Hyderabad"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          radius="md"
                          required
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 6 }}>
                        <TextInput
                          label="Postal Code"
                          placeholder="500081"
                          value={newPostal}
                          onChange={(e) => setNewPostal(e.target.value)}
                          radius="md"
                          required
                        />
                      </Grid.Col>
                    </Grid>
                    <TextInput
                      label="State"
                      placeholder="Telangana"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      radius="md"
                    />
                    <Group mt="md">
                      <Button type="submit" color="orange" radius="md">
                        Save Address
                      </Button>
                      <Button variant="subtle" color="gray" radius="md" onClick={() => setShowAddAddress(false)}>
                        Cancel
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Paper>
            )}

            <Grid gutter="md">
              {addresses.map((addr) => (
                <Grid.Col span={{ base: 12, sm: 6 }} key={addr.id}>
                  <Paper className={classes.addressCard} p="lg" radius="lg">
                    <Flex justify="space-between" align="start">
                      <Group gap="xs">
                        <span className={classes.addressIcon}>
                          {addr.type === "Home" ? "🏠" : addr.type === "Work" ? "🏢" : "📍"}
                        </span>
                        <div>
                          <Text fw={800} c="#0f172a" size="sm">
                            {addr.type}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                          </Text>
                        </div>
                      </Group>
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        radius="md"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Tabs.Panel>

          {/* ─── Preferences tab ─── */}
          <Tabs.Panel value="preferences">
            <Paper withBorder radius="lg" p="xl" bg="#ffffff">
              <Title order={3} mb="xl" c="#0f172a" fw={800}>
                Communication Preferences
              </Title>
              <Stack gap="lg">
                <Flex justify="space-between" align="center">
                  <div>
                    <Text fw={700} size="sm" c="#0f172a">Email Notifications</Text>
                    <Text size="xs" c="dimmed">Receive order updates, receipt invoices, and deals via email</Text>
                  </div>
                  <Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.currentTarget.checked)} color="orange" />
                </Flex>

                <Divider />

                <Flex justify="space-between" align="center">
                  <div>
                    <Text fw={700} size="sm" c="#0f172a">SMS Notifications</Text>
                    <Text size="xs" c="dimmed">Get live text messages for delivery alerts and tracking links</Text>
                  </div>
                  <Switch checked={smsNotif} onChange={(e) => setSmsNotif(e.currentTarget.checked)} color="orange" />
                </Flex>

                <Divider />

                <Flex justify="space-between" align="center">
                  <div>
                    <Text fw={700} size="sm" c="#0f172a">Push Notifications</Text>
                    <Text size="xs" c="dimmed">Receive alerts on your device for active order updates and offers</Text>
                  </div>
                  <Switch checked={pushNotif} onChange={(e) => setPushNotif(e.currentTarget.checked)} color="orange" />
                </Flex>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </div>
      </Tabs>
    </main>
  );
};

export default Profile;
