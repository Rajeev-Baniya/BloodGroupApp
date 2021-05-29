const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT_NO;
const cors = require("cors");

require("./database/mongoose");
const userRouter = require("./routes/users");
app.use(cors());
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log(`Server has started in port ${port}`);
});
