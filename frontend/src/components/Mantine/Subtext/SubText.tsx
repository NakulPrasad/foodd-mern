import { Text, useMantineTheme } from "@mantine/core";

interface SubTextProps {
  children: React.ReactNode;
  clamp?: number;
}

export function SubText({ children, clamp }: SubTextProps) {
  const theme = useMantineTheme();

  return (
    <Text
      size={theme.fontSizes.xs}
      c={theme.colors.secondary[5]}
      fw={600}
      lh={"16px"}
      lineClamp={clamp}
      mb="sm"
    >
      {children}
    </Text>
  );
}
