// Define resolvers for the schema
const root = {
    hello: () => {
      return "Hello, World!";
    },
    quoteOfTheDay() {
      return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
    },
    random() {
      return Math.random()
    },
    rollDice({ numDice, numSides }) {
      var output = []
      for (var i = 0; i < numDice; i++) {
        output.push(1 + Math.floor(Math.random() * (numSides || 6)))
      }
      return output
    },
  };
  
export default root;
  