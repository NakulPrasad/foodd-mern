import { Text, TextProps, useMantineTheme } from "@mantine/core";
import { ComponentPropsWithoutRef } from "react";

type SubTextProps = TextProps & ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
  clamp?: number;
};

export function SubText({ children, clamp, ...props }: SubTextProps) {
  const theme = useMantineTheme();

  return (
    <Text
      size={theme.fontSizes.xs}
      c={theme.colors.secondary[5]}
      fw={600}
      lh={"16px"}
      lineClamp={clamp}
      mb="sm"
      {...props}
    >
      {children}
    </Text>
  );
}
