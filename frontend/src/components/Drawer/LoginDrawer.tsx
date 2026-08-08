import {
  Button,
  Drawer,
  Image,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRight,
  IconLock,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-toastify";
import URLs from "../../configs/URLs";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useLocation } from "../../hooks/useLocation";
import { useUser } from "../../hooks/useUser";
import {
  useLoginRequestMutation,
  useRegisterRequestMutation,
} from "../../redux/slices/apiSlice";
import { setAuth } from "../../redux/slices/authSlice";
import InputEmail from "../Inputs/InputEmail";
import InputPassword from "../Inputs/InputPassword";
import InputPasswordReq from "../Inputs/InputPasswordReq";
import Spinner from "../Loader/Spinner";
import classes from "./LoginDrawer.module.css";

interface DrawerProps {
  variant: string;
  title: string;
}

const LoginDrawer = ({ variant, title }: DrawerProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginRequest, { isLoading: isLoginLoading }] =
    useLoginRequestMutation();
  const [registerRequest, { isLoading: isRegisterLoading }] =
    useRegisterRequestMutation();

  const { addUser } = useUser();
  const { city } = useLocation();
  const dispatch = useAppDispatch();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      name: "",
      password: "",
      location: city,
    },
    validateInputOnChange: true,

    validate: {
      email: isEmail("Invalid email"),
      name: (value) => {
        if (!isNewUser) {
          return null;
        }
        return value.length < 2 ? "Name must have at least 2 letters" : null;
      },
    },
  });

  const handleLoginBtn = async () => {
    if (isNewUser) {
      await handleSignUp();
    } else {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    const response = await loginRequest({
      email: form.values.email,
      password: form.values.password,
    });

    if (response.data && response.data.authToken) {
      addUser(response.data.authToken);
      dispatch(setAuth(response.data));
      toast.success("Welcome back!");
      close();
    }
  };

  const handleLoginGoogle = () => {
    window.location.href = URLs.googleAuth;
  };

  const handleSignUp = async () => {
    const response = await registerRequest(form.values);
    if (response.data && response.data.message) {
      toast.success("User Registered Successfully");
      setIsNewUser(false);
    } else {
      toast.error("Failed to register user");
    }
  };

  return (
    <>
      {(isLoginLoading || isRegisterLoading) && <Spinner />}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="md"
        padding="xl"
        radius="lg"
        overlayProps={{ backgroundOpacity: 0.4, blur: 8 }}
        styles={{
          content: {
            borderRadius: "24px 0 0 24px",
            overflow: "hidden",
          },
          header: {
            paddingBottom: 0,
          },
        }}
      >
        {/* Modern Header Banner */}
        <div className={classes.drawerHeader}>
          <div className={classes.heroIconBadge}>
            {isNewUser ? <IconUser size={28} /> : <IconLock size={28} />}
          </div>
          <Title order={2} className={classes.drawerTitle}>
            {isNewUser ? "Create an Account" : "Welcome Back"}
          </Title>
          <Text className={classes.drawerSubtitle}>
            {isNewUser
              ? "Sign up to explore delicious food nearby"
              : "Sign in to manage your orders & profile"}
          </Text>
        </div>

        {/* Tabbed Auth Mode Switcher */}
        <SegmentedControl
          fullWidth
          value={isNewUser ? "signup" : "login"}
          onChange={(val) => setIsNewUser(val === "signup")}
          data={[
            { label: "Sign In", value: "login" },
            { label: "Create Account", value: "signup" },
          ]}
          color="orange"
          radius="md"
          size="sm"
          className={classes.segmentedControl}
        />

        {/* Form Container */}
        <form onSubmit={form.onSubmit(handleLoginBtn)}>
          <Stack gap="md">
            {isNewUser && (
              <TextInput
                label="Full Name"
                withAsterisk
                w="100%"
                placeholder="John Doe"
                key={form.key("name")}
                id={form.key("name")}
                {...form.getInputProps("name")}
              />
            )}

            <InputEmail form={form} />

            {!isNewUser ? (
              <InputPassword form={form} />
            ) : (
              <InputPasswordReq form={form} />
            )}

            <Button
              fullWidth
              type="submit"
              className={classes.submitBtn}
              loading={isLoginLoading || isRegisterLoading}
              rightSection={<IconArrowRight size={18} />}
            >
              {isNewUser ? "CREATE ACCOUNT" : "SIGN IN"}
            </Button>

            <div className={classes.dividerContainer}>OR</div>

            <Button
              fullWidth
              onClick={handleLoginGoogle}
              className={classes.googleBtn}
            >
              <Image
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "10px",
                }}
              />
              Continue with Google
            </Button>

            <div className={classes.footerDisclaimer}>
              <IconShieldCheck
                size={18}
                color="#f97316"
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <Text className={classes.footerDisclaimerText}>
                By continuing, you agree to our Terms of Service & Privacy Policy.
              </Text>
            </div>
          </Stack>
        </form>
      </Drawer>

      <Button onClick={open} className={classes.button} variant={variant}>
        <IconUser size={16} className={classes.mx} />
        {title}
      </Button>
    </>
  );
};

export default LoginDrawer;

