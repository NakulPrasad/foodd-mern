import { TextInput } from '@mantine/core';

interface InputEmailProps {
  form: any;
}

const InputEmail = ({ form }: InputEmailProps) => {
  return (
    <TextInput
      id={form.key('email')}
      withAsterisk
      w="100%"
      label="Email Address"
      placeholder="your@email.com"
      key={form.key('email')}
      {...form.getInputProps('email')}
    />
  );
};

export default InputEmail;