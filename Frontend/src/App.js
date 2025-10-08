const { startTransition } = require("react");

startTransition(() => {
  console.log("This is a transition");
});

console.log("This is not a transition");    