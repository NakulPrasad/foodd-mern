import { Flex, Title, useMantineTheme } from "@mantine/core";
import classes from "./Profile.module.css";
const Profile = () => {
  const theme = useMantineTheme();

  return (
    <>
      <main id="profile" className={classes.section_m}>
        <Title py={theme.spacing.md} order={2}>
          Nakul Prasad Mahato
        </Title>
        <Title py={theme.spacing.md} order={3}>
          8210333793 nakulprasad10@gmail.com
        </Title>
        <Flex direction={"row"}></Flex>
      </main>
      <section></section>;
    </>
  );
};

export default Profile;
