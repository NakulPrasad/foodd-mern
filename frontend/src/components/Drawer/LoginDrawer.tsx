import {
  Anchor,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/reduxHooks";
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
import { useLocation } from "../../hooks/useLocation";

interface DrawerProps {
  variant: string;
  title: string;
}

const LoginDrawer = ({ variant, title }: DrawerProps) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [loginRequest, { isLoading: isLoginLoading }] =
    useLoginRequestMutation();
  const [registerRequest, { isLoading: isRegisterLoading }] =
    useRegisterRequestMutation();

  const { addUser } = useUser();

  const {city} = useLocation();

  const dispatch = useAppDispatch();

  const toggleIsLoggedIn = () => {
    setIsNewUser((isNewUser) => !isNewUser);
  };
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

  const LoginUser = {
    title: "Login",
    subTitle: "create an account",
    message:
      "By clicking on Login, I accept the Terms & Conditions & Privacy Policy",
  };

  const RegisterUser = {
    title: "Sign Up",
    subTitle: "login to your account",
    message:
      "By creating an account, I accept the Terms & Conditions & Privacy Policy",
  };

  const handleLoginBtn = async () => {
    console.log("Current values:", form.values);
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
      console.log("User Login Successfully");
      close();
    }
  };

  const handleLoginGoogle = () => {
    // navigate("http://localhost:3000/auth/google");
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleSignUp = async () => {
    const response = await registerRequest(form.values);
    if (response.data && response.data.message) {
      console.log("User Registered Successfully");
      toast.success("User Registered Successfully");
    }
    else{
      toast.error(response?.error.data.message)
    }
  };

  return (
    <>
      {isLoginLoading || (isRegisterLoading && <Spinner />)}
      <Drawer opened={opened} onClose={close} position="right" padding={"xl"}>
        <Title order={2}>
          {isNewUser ? RegisterUser.title : LoginUser.title}
        </Title>
        <Text span size="xs">
          or{" "}
        </Text>
        <Anchor
          underline="never"
          size="xs"
          fw={800}
          c={"orange"}
          onClick={toggleIsLoggedIn}
        >
          {isNewUser ? RegisterUser.subTitle : LoginUser.subTitle}
        </Anchor>
        <Divider className={classes.my_4} />
        <form onSubmit={form.onSubmit(handleLoginBtn)}>
          <InputEmail form={form} />
          {!isNewUser && <InputPassword form={form} />}
          {isNewUser && (
            <>
              <TextInput
                label="Name"
                withAsterisk
                placeholder="John Doe"
                key={form.key("name")}
                id={form.key("name")}
                {...form.getInputProps("name")}
              />
              <InputPasswordReq form={form} />
            </>
          )}
          <Group mt="md">
            <Button fullWidth type="submit" >
              {isNewUser ? "CONTINUE" : "LOGIN"}
            </Button>
            <Button fullWidth onClick={handleLoginGoogle}>
              <Image
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "8px",
                }}
              />
              Login with Google
            </Button>

            <Text size="sm">
              {isNewUser ? RegisterUser.message : LoginUser.message}
            </Text>
          </Group>
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
