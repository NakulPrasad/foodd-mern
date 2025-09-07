import { Button } from "@mantine/core";

const Partner = () => {
  return (
    <section className="">
      <div className="flex h-10 items-center justify-center bg-hero-image">
        {/* <img className='absolute object-fill' src={banner} alt="banner" /> */}
        <div className="flex">
          <span>
            <Button variant="filled" size="xl">
              Button
            </Button>
            ;<button className="btn-primary">Register your restaurant</button>
          </span>
          {/* <Modal2/> */}
        </div>
      </div>
      {/* <Accordian /> */}
    </section>
  );
};

export default Partner;
