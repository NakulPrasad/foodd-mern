import {
  ActionIcon,
  Box,
  Container,
  Group,
  Image,
  Text,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconMail,
  IconSparkles,
} from "@tabler/icons-react";
import classes from "./Footer.module.css";
import Logo from "/img/logo/LOGO-bgremove.png";

const RESUME_URL =
  import.meta.env.VITE_RESUME_URL ||
  "https://drive.google.com/file/d/1_your_google_drive_resume_link/view?usp=sharing";

const DEVELOPER_PROJECTS = [
  { label: "GitHub Profile", link: "https://github.com/NakulPrasad", isExternal: true },
  { label: "View / Download Resume", link: RESUME_URL, isExternal: true },
  { label: "InvoiceX (Invoice Generator)", link: "https://invoice-x.vercel.app", isExternal: true },
  { label: "ChatX (Realtime Chat App)", link: "https://chat-x-dun.vercel.app", isExternal: true },
  { label: "MERN Sales Analytics", link: "https://mern-dashboard.azurewebsites.net/", isExternal: true },
];

const TECH_STACK = [
  "React 18",
  "TypeScript",
  "Redux Toolkit",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Stripe API",
  "Mantine UI",
];

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        {/* Brand & Developer Info */}
        <div className={classes.logoCol}>
          <Image src={Logo} alt="Foodd Logo" className={classes.logoImage} />
          <Text className={classes.description}>
            <strong style={{ color: "#f8fafc" }}>Foodd MERN</strong> is a modern full-stack food ordering &amp; delivery web platform featuring Stripe Checkout, real-time cart state, and coupon management.
          </Text>

          <div className={classes.devBadge}>
            <IconSparkles size={13} />
            Designed &amp; Built by Nakul Prasad Mahato
          </div>
        </div>

        {/* Groups */}
        <div className={classes.groups}>
          {/* Projects & Portfolio */}
          <div className={classes.wrapper}>
            <Text className={classes.title}>Developer Showcase</Text>
            {DEVELOPER_PROJECTS.map((item) => (
              <a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                {item.label}
                <IconArrowUpRight size={12} style={{ opacity: 0.7 }} />
              </a>
            ))}
          </div>

          {/* Tech Stack */}
          <div className={classes.wrapper} style={{ maxWidth: 220 }}>
            <Text className={classes.title}>Built With</Text>
            <Box mt={4}>
              {TECH_STACK.map((tech) => (
                <span key={tech} className={classes.techTag}>
                  {tech}
                </span>
              ))}
            </Box>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <Container className={classes.afterFooter}>
        <Text className={classes.copyright}>
          © {new Date().getFullYear()} <strong style={{ color: "#cbd5e1" }}>Nakul Prasad Mahato</strong>. Open Source Full-Stack Portfolio.
        </Text>

        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            component="a"
            href="https://github.com/NakulPrasad"
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            variant="subtle"
            className={classes.socialIcon}
            aria-label="GitHub Profile"
          >
            <IconBrandGithub size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            variant="subtle"
            className={classes.socialIcon}
            aria-label="LinkedIn Profile"
          >
            <IconBrandLinkedin size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            variant="subtle"
            className={classes.socialIcon}
            aria-label="Download Resume"
          >
            <IconFileText size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="mailto:nakulprasad10@gmail.com"
            size="lg"
            variant="subtle"
            className={classes.socialIcon}
            aria-label="Send Email"
          >
            <IconMail size={18} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;