import { buildSchema } from "graphql";

// Define your GraphQL schema
const schema = buildSchema(`
  type Query {
  hello:String
    quoteOfTheDay: String
    random: Float!
    rollDice(numDice: Int!, numSides: Int): [Int]
    
  }

  type Mutation {
    updateMessage(newMessage: String): String
  }
`);

export default schema;
