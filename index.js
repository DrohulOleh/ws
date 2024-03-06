const app = require("./app");
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server has been started on \x1b[32;1m${port}\x1b[m`)
);
