import { TextInput } from '@mantine/core'

interface InputEmailProps{
  form : any
}

const InputEmail = ({form} : InputEmailProps) => {
  return (
    <TextInput
    id={form.key('email')}
    withAsterisk
    label="Email"
    placeholder="your@email.com"
    key={form.key('email')}
    {...form.getInputProps('email')}
  />
  )
}

export default InputEmail