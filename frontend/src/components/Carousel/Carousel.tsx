import { Carousel } from "@mantine/carousel";
import { ActionIcon, Flex, Group, Title, useMantineTheme } from "@mantine/core";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { EmblaCarouselType } from "embla-carousel-react";
import { useState } from "react";

interface ICustomCarouselProps {
  order?: number | 2;
  title?: string;
  slideSize?: string | {}; // Optional size of each slide
  slideGap?: string | {}; // Optional gap between slides
  align?: "start" | "center" | "end"; // Alignment of slides
  slidesToScroll?: number; // Number of slides to scroll at once
  className?: string; // Additional class for styling
  children: React.ReactNode; // Slides (passed as children)
}

const CustomCarousel = (props: ICustomCarouselProps) => {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const handleNext = () => {
    if (!embla) return;
    embla.scrollNext();
  };
  const handlePrevious = () => {
    if (!embla) return;
    embla.scrollPrev();
  };
  const theme = useMantineTheme();
  return (
    <>
      <Flex justify={"space-between"} py={theme.spacing.md}>
        <Title order={2}>{props.title}</Title>
        <Group>
          <ActionIcon onClick={handlePrevious}>
            <IconArrowNarrowLeft />
          </ActionIcon>
          <ActionIcon onClick={handleNext}>
            <IconArrowNarrowRight />
          </ActionIcon>
        </Group>
      </Flex>
      <Carousel
        withControls={false}
        slideSize={props.slideSize}
        slideGap={props.slideGap}
        align={props.align}
        slidesToScroll={props.slidesToScroll}
        className={props.className}
        getEmblaApi={setEmbla}
      >
        {props.children}
      </Carousel>
    </>
  );
};

export default CustomCarousel;
