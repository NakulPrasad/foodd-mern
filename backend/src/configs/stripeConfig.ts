import Stripe from "stripe";

const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_51QRzWhKNCAJyCqwqdIeNsNKtefS4gHKNq9yHKrrQjd7StL1i6veWEn6oziMOBlBiWYNjS1ME3tKL9zbDXT823XdJ00S3dkgu0l";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export default stripe;
