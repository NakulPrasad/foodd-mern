import {
  Anchor,
  Button,
  Card,
  Checkbox,
  Code,
  createTheme,
  defaultVariantColorsResolver,
  Divider,
  HoverCard,
  Input,
  MantineColorsTuple,
  Modal,
  Paper,
  Popover,
  rem,
  Select,
  Switch,
  Tooltip,
} from "@mantine/core";

import "./fonts/Gilroy.css";
import "./fonts/ProximaNova.css";

const grayColors: MantineColorsTuple = [
  "#f9fafb",
  "#f3f4f6",
  "#e5e7eb",
  "#d1d5db",
  "#9ca3af",
  "#4b5563",
  "#374151",
  "#1f2937",
  "#111827",
  "#030712",
  "#6B7280",
];
const redColors: MantineColorsTuple = [
  "#FEF2F2",
  "#FEE2E2",
  "#FECACA",
  "#FCA5A5",
  "#F87171",
  "#DC2626",
  "#B91C1C",
  "#991B1B",
  "#7F1D1D",
  "#450A0A",
  "#EF4444",
];
const orangeColors: MantineColorsTuple = [
  "#fff7ed",
  "#ffedd5",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#9a3412",
  "#7c2d12",
  "#431407",
  "#F97316",
];

const amberColors: MantineColorsTuple = [
  "#FFFBEB",
  "#FEF3C7",
  "#FDE68A",
  "#FCD34D",
  "#FBBF24",
  "#D97706",
  "#B45309",
  "#92400E",
  "#78350F",
  "#451A03",
  "#F59E0B",
];

const shadcnTheme = createTheme({
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
  colors: {
    gray: grayColors,
    red: redColors,
    orange: orangeColors,
    primary: orangeColors,
    error: redColors,
    warning: amberColors,
    secondary: grayColors,
  },
  focusRing: "never",
  scale: 1,
  primaryColor: "primary",
  primaryShade: { light: 5, dark: 6 },
  autoContrast: true,
  luminanceThreshold: 0.6,
  fontFamily: "Gilroy, Arial, sans-serif",
  radius: {
    xs: rem("6px"),
    sm: rem("8px"),
    md: rem("12px"),
    lg: rem("16px"),
    xl: rem("24px"),
  },
  defaultRadius: "md",
  spacing: {
    "4xs": rem("4px"),
    "3xs": rem("4px"),
    "2xs": rem("8px"),
    xs: rem("10px"),
    sm: rem("12px"),
    md: rem("16px"),
    lg: rem("20px"),
    xl: rem("24px"),
    "2xl": rem("28px"),
    "3xl": rem("32px"),
    logo: rem("44px"),
  },
  fontSizes: {
    xs: rem("12px"),
    sm: rem("14px"),
    md: rem("16px"),
    lg: rem("18px"),
    xl: rem("20px"),
    xxl: rem("24px"),
    "3xl": rem("30px"),
    "4xl": rem("36px"),
    "5xl": rem("48px"),
  },
  lineHeights: {
    xs: rem("18px"),
    sm: rem("20px"),
    md: rem("24px"),
    lg: rem("28px"),
  },

  headings: {
    fontFamily: "Gilroy_Bold, Arial, sans-serif",
    sizes: {
      h1: {
        fontSize: rem("48px"),
        lineHeight: rem("48px"),
        fontWeight: "800",
      },
      h2: {
        fontSize: rem("24px"),
        lineHeight: rem("28px"),
        fontWeight: "800",
      },
      h3: {
        fontSize: rem("20px"),
        lineHeight: rem("24px"),
        fontWeight: "800",
      },
      h4: {
        fontSize: rem("18px"),
        lineHeight: rem("19px"),
        fontWeight: "800",
      },
      h5: {
        fontSize: rem("14px"),
        lineHeight: rem("17px"),
        fontWeight: "700",
      },
    },
  },
  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
    xxl: "0 25px 50px rgba(0, 0, 0, 0.25)",
  },

  cursorType: "pointer",
  other: {
    style: "shadcn",
  },
  variantColorResolver: (component) => {
    const defaultResolvedColors = defaultVariantColorsResolver(component);

    if (component.variant === "default") {
      return {
        ...defaultResolvedColors,
        background: "var(--mantine-color-default)",
        border: "1px solid var(--mantine-color-default-border)",
        hover: "var(--mantine-color-default-hover)",
      };
    }

    if (component.variant === "filled") {
      return {
        ...defaultResolvedColors,
        background: "var(--mantine-primary-color-filled)",
        hover: "var(--mantine-primary-color-filled-hover)",
        color: "var(--mantine-primary-color-contrast)",
        
      };
    }

    if (component.variant === "light") {
      return {
        ...defaultResolvedColors,
        background: "var(--mantine-primary-color-light)",
        hover: "var(--mantine-primary-color-light-hover)",
        color: "var(--mantine-primary-color-light-color)",
      };
    }

    if (component.variant === "outline") {
      return {
        ...defaultResolvedColors,
        background: "var(--mantine-color-default)",
        border: "1px solid var(--mantine-color-default-border)",
        hover: "var(--mantine-color-default-hover)",
        color: "var(--mantine-color-default-color)",
      };
    }

    if (component.variant === "subtle") {
      return {
        ...defaultResolvedColors,
        background: "transparent",
        hover: "var(--mantine-color-default-hover)",
        color: "var(--mantine-color-default-color)",
      };
    }

    return defaultResolvedColors;
  },
  components: {
    Card: Card.extend({
      defaultProps: {
        p: "xl",
        shadow: "xl",
        radius: "md",
        withBorder: true,
      },
      classNames: () => ({
        root: "globalMantineCardRoot",
      }),
    }),
    Paper: Paper.extend({
      defaultProps: {
        // p: "md",
        shadow: "xl",
        radius: "md",
        withBorder: true,
      },
    }),
    Popover: Popover.extend({
      styles: () => ({
        dropdown: {
          backgroundColor: "var(--mantine-color-default)",
          borderColor: "var(--mantine-color-default-border)",
        },
      }),
    }),
    Input: Input.extend({
      classNames: (_theme, props) => {
        if (props.variant !== "unstyled")
          return {
            input: "globalMantineInput",
          };

        return {};
      },
      vars: (_theme) => {
        return {
          input: {
            "--input-bd": "var(--mantine-color-default-border)",
            "--input-bd-focus": "var(--mantine-primary-color-filled)",
            "--input-bg": "var(--mantine-color-default)",
          },
          wrapper: {},
        };
      },
    }),
    Divider: Divider.extend({
      styles: () => ({
        root: {
          borderColor: "var(--mantine-color-default-border)",
        },
      }),
    }),
    Checkbox: Checkbox.extend({
      classNames: () => {
        return {
          input: "globalMantineCheckbox",
        };
      },
      vars: () => ({
        root: {
          "--checkbox-color": "var(--mantine-primary-color-filled)",
          "--checkbox-icon-color": "var(--mantine-primary-color-contrast)",
        },
      }),
    }),

    Switch: Switch.extend({
      styles: () => ({
        thumb: {
          backgroundColor: "var(--mantine-color-default)",
          borderColor: "var(--mantine-color-default-border)",
        },
        track: {
          borderColor: "var(--mantine-color-default-border)",
        },
      }),
    }),
    Tooltip: Tooltip.extend({
      styles: () => ({
        tooltip: {
          fontSize: "var(--mantine-font-size-xs)",
          paddingTop: "0px",
          paddingBottom: "0px",
        },
      }),
      vars: () => ({
        tooltip: {
          "--tooltip-bg": "var(--mantine-color-primary-color-filled)",
          "--tooltip-color": "var(--mantine-color-primary-color-contrast)",
        },
      }),
    }),
    Modal: Modal.extend({
      defaultProps: {
        p: "md",
      },
      styles: () => ({
        content: {
          border: "1px solid var(--mantine-color-default-border)",
        },
      }),
    }),
    Code: Code.extend({
      vars: () => ({
        root: {
          "--code-bg": "var(--mantine-color-dark-filled)",
        },
      }),
      styles: () => ({
        root: {
          border: "1px solid var(--mantine-color-default-border)",
          color: "var(--mantine-color-text)",
        },
      }),
    }),
    Button: Button.extend({
      classNames: (_theme, props) => {
        if (props.variant !== "unstyled")
          return {
            root: "globalMantineButton",
          };

        return {};
      },
    }),
    Anchor: Anchor.extend({
      defaultProps: {
        underline: "always",
      },
    }),
    HoverCard: HoverCard.extend({
      classNames: () => ({
        dropdown: "globalMantineHoverCard",
      }),
    }),
    Select: Select.extend({
      defaultProps: {
        checkIconPosition: "right",
      },
    }),
  },
});

export default shadcnTheme;
