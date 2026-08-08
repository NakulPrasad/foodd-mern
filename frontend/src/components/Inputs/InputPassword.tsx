import { PasswordInput } from '@mantine/core';

interface InputPasswordProps {
  form: any;
}

const InputPassword = ({ form }: InputPasswordProps) => {
  return (
    <PasswordInput
      id={form.key('password')}
      w="100%"
      label="Password"
      placeholder="••••••••"
      withAsterisk
      key={form.key('password')}
      {...form.getInputProps('password')}
    />
  );
};

export default InputPassword;