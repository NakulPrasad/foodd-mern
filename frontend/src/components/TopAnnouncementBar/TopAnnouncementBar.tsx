import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCode,
  IconDownload,
  IconExternalLink,
  IconFileText,
  IconGitFork,
  IconRocket,
  IconSparkles,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from "./TopAnnouncementBar.module.css";

interface IGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
}

// Fallback primary projects in case GitHub API rate limits
const FALLBACK_PROJECTS = [
  {
    name: "foodd-mern",
    description: "A feature-rich food delivery platform with Stripe payment gateway & RESTful API V1.",
    language: "TypeScript",
    stargazers_count: 1,
    forks_count: 0,
    html_url: "https://github.com/NakulPrasad/foodd-mern",
    homepage: "https://foodd-mern.vercel.app",
    fork: false,
  },
  {
    name: "InvoiceX",
    description: "Simple & modern invoice generation app built for quick business billing.",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/NakulPrasad/InvoiceX",
    homepage: "https://invoice-x.vercel.app",
    fork: false,
  },
  {
    name: "ChatX",
    description: "Real-time messaging application with instant chat & responsive UI.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/NakulPrasad/ChatX",
    homepage: "https://chat-x-dun.vercel.app",
    fork: false,
  },
  {
    name: "mern-dashboard",
    description: "Sales Analytics Dashboard made with MongoDB, Express, React, Node, and Nivo charts.",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    html_url: "https://github.com/NakulPrasad/mern-dashboard",
    homepage: "https://mern-dashboard.azurewebsites.net/",
    fork: false,
  },
  {
    name: "Library-Management",
    description: "Full-stack Library Management System with book reservations & member controls.",
    language: "JavaScript",
    stargazers_count: 1,
    forks_count: 3,
    html_url: "https://github.com/NakulPrasad/Library-Management",
    homepage: "https://librarry.azurewebsites.net/",
    fork: false,
  },
];

const RESUME_URL =
  import.meta.env.VITE_RESUME_URL ||
  "https://drive.google.com/file/d/1_your_google_drive_resume_link/view?usp=sharing";

export const TopAnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return sessionStorage.getItem("dismissed_dev_banner") !== "true";
  });

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [projects, setProjects] = useState<IGitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch non-fork primary repositories directly from official GitHub REST API
  useEffect(() => {
    const fetchGitHubRepos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://api.github.com/users/NakulPrasad/repos?sort=pushed&per_page=20",
        );
        if (response.ok) {
          const data: IGitHubRepo[] = await response.json();
          // Filter out forks & profile README repo so only Nakul's original projects are shown
          const primaryRepos = data.filter(
            (repo) =>
              !repo.fork &&
              repo.name !== "NakulPrasad" &&
              !repo.name.endsWith(".github.io"),
          );
          if (primaryRepos.length > 0) {
            setProjects(primaryRepos);
          } else {
            setProjects(FALLBACK_PROJECTS as any);
          }
        } else {
          setProjects(FALLBACK_PROJECTS as any);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub repositories:", error);
        setProjects(FALLBACK_PROJECTS as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubRepos();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("dismissed_dev_banner", "true");
  };

  return (
    <>
      {isVisible && (
        <div className={classes.announcementBar}>
          <div className={classes.container}>
            <div className={classes.leftSection}>
              <span className={classes.badge}>
                <IconSparkles size={12} /> Recruiter Demo
              </span>
              <span className={classes.text}>
                👋 Exploring <span className={classes.bold}>Foodd MERN</span>? Check out my live GitHub profile &amp; other projects.
              </span>
            </div>

            <Group gap="xs" wrap="nowrap">
              <button className={classes.ctaButton} onClick={openModal}>
                <IconRocket size={14} /> View GitHub Projects ({projects.length || "5"})
              </button>
              <Tooltip label="Dismiss for this session" position="bottom" withArrow>
                <button
                  className={classes.closeButton}
                  onClick={handleDismiss}
                  aria-label="Dismiss banner"
                >
                  <IconX size={16} />
                </button>
              </Tooltip>
            </Group>
          </div>
        </div>
      )}

      {/* ─── Developer Projects & Portfolio Modal ─── */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <div className={classes.modalTitle}>
            <IconCode size={22} color="#ff5200" />
            <Title order={4}>Nakul Prasad — Portfolio &amp; Projects</Title>
          </div>
        }
        size="lg"
        centered
        radius="lg"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Stack gap="md">
          {/* Header Card with Bio & Resume Button */}
          <Box bg="#f1f5f9" p="md" style={{ borderRadius: 12 }}>
            <Group justify="space-between" align="center" wrap="wrap" gap="sm">
              <div>
                <Title order={5} c="#0f172a">
                  Nakul Prasad Mahato
                </Title>
                <Text size="xs" c="dimmed">
                  Full-Stack MERN &amp; React/TypeScript Software Engineer
                </Text>
              </div>
              <Group gap="xs" wrap="wrap">
                {/* Download / View Resume Button (Google Drive / Docs) */}
                <Button
                  component="a"
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="xs"
                  variant="filled"
                  color="orange"
                  leftSection={<IconFileText size={14} />}
                  rightSection={<IconDownload size={12} />}
                >
                  View / Download Resume
                </Button>
                <Button
                  component="a"
                  href="https://github.com/NakulPrasad"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="xs"
                  variant="filled"
                  color="dark"
                  leftSection={<IconBrandGithub size={14} />}
                >
                  GitHub Profile
                </Button>
                <Button
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="xs"
                  variant="light"
                  color="blue"
                  leftSection={<IconBrandLinkedin size={14} />}
                >
                  LinkedIn
                </Button>
              </Group>
            </Group>
          </Box>

          <Flex justify="space-between" align="center">
            <Text size="xs" fw={700} c="#475569" tt="uppercase" lts={1}>
              Pinned / Original Repositories ({projects.length})
            </Text>
            <Badge color="green" variant="light" size="xs">
              Live GitHub API
            </Badge>
          </Flex>

          {/* Scrollable Repository List */}
          {isLoading ? (
            <Flex justify="center" align="center" py="xl">
              <Loader color="orange" size="md" type="dots" />
            </Flex>
          ) : (
            <div className={classes.scrollableRepoList}>
              {projects.map((project) => (
                <Box key={project.id || project.name} className={classes.projectCard}>
                  <Stack gap={6}>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap="xs">
                        <IconBrandGithub size={18} color="#475569" />
                        <Title order={5} c="#0f172a">
                          {project.name}
                        </Title>
                      </Flex>
                      <Group gap={6}>
                        {project.language && (
                          <Badge color="indigo" variant="light" size="xs">
                            {project.language}
                          </Badge>
                        )}
                        {project.stargazers_count > 0 && (
                          <Badge color="yellow" variant="light" size="xs" leftSection={<IconStar size={10} />}>
                            {project.stargazers_count}
                          </Badge>
                        )}
                        {project.forks_count > 0 && (
                          <Badge color="gray" variant="light" size="xs" leftSection={<IconGitFork size={10} />}>
                            {project.forks_count}
                          </Badge>
                        )}
                      </Group>
                    </Flex>

                    <Text size="xs" c="#475569">
                      {project.description || "Full-stack web application developed by Nakul Prasad."}
                    </Text>

                    <Group gap="xs" mt="xs">
                      <Button
                        component="a"
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="xs"
                        variant="outline"
                        color="dark"
                        leftSection={<IconBrandGithub size={14} />}
                      >
                        Source Code
                      </Button>
                      {project.homepage && (
                        <Button
                          component="a"
                          href={
                            project.homepage.startsWith("http")
                              ? project.homepage
                              : `https://${project.homepage}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          size="xs"
                          variant="light"
                          color="orange"
                          rightSection={<IconArrowUpRight size={14} />}
                        >
                          Live Demo
                        </Button>
                      )}
                    </Group>
                  </Stack>
                </Box>
              ))}
            </div>
          )}

          <Divider my="xs" />

          <Flex justify="space-between" align="center">
            <Text size="xs" c="dimmed">
              Looking for a dedicated MERN / Full-Stack Engineer? Let's connect!
            </Text>
            <Button
              component="a"
              href="mailto:nakulprasad10@gmail.com"
              size="xs"
              color="orange"
              radius="md"
              leftSection={<IconExternalLink size={14} />}
            >
              Get In Touch
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};

export default TopAnnouncementBar;
