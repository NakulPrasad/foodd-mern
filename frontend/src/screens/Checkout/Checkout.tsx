import { Button, Checkbox, Container, Flex, Grid, Text } from "@mantine/core";
const Checkout = () => {
  return (
    <section id="checkout">
      <Grid style={{ height: "100vh", padding: "2rem" }}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Container>
            <Text>Choose a deliver address</Text>
            <Text>Multiple addresses in this location</Text>
          </Container>
          <Flex align="center" justify="space-between" wrap="wrap" gap={"md"}>
            <Container>
              <Text>
                <span>img</span>Home
              </Text>
              <Text>Mukunda Jwellers, KPHB, Hyderabad, Telengana 826001, India</Text>
              <Text>71 Mins</Text>
              <Button color="green"> Deliver Here</Button>
            </Container>
            <Container>
              <Text>
                <span>img</span>Home
              </Text>
              <Text>Mukunda Jwellers, KPHB, Hyderabad, Telengana 826001, India</Text>
              <Text>71 Mins</Text>
              <Button> Deliver Here</Button>
            </Container>
            <Container>
              <Text>
                <span>img</span>Home
              </Text>
              <Text>Mukunda Jwellers, KPHB, Hyderabad, Telengana 826001, India</Text>
              <Text>71 Mins</Text>
              <Button> Deliver Here</Button>
            </Container>
            <Container>
              <Text>
                <span>img</span>Home
              </Text>
              <Text>Mukunda Jwellers, KPHB, Hyderabad, Telengana 826001, India</Text>
              <Text>71 Mins</Text>
              <Button> Deliver Here</Button>
            </Container>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Flex align={"center"} justify={"center"}>
            <span>img</span>
            <Text>
              <Text>The Restraunt</Text>
              <Text>Hyderabad</Text>
            </Text>
          </Flex>
          <Flex align={"center"} justify={"center"}>
            <Text>
              <Text>
                <span>img</span>Paneer Butter Masala
                <span>
                  <Button variant="transparent" color="gray">
                    -
                  </Button>
                  0{" "}
                  <Button variant="transparent" color="green">
                    +
                  </Button>
                </span>
                <span>100</span>
              </Text>
            </Text>
          </Flex>

          <Flex align={"center"} justify={"center"}>
            <Checkbox />
            <Text>
              <span>Opt in for No-contact Delivery</span>
              <br />
              <span>
                Unwell, or avoiding contact? Please select no-contact delivery.
                Partner will safely place the order outside your door (not for
                COD)
              </span>
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
    </section>
  );
};

export default Checkout;
