const express = require('express');
const { connection } = require('./config/db');
const { authenticator } = require('./middleware/authentication');
const { postRouter } = require('./routes/post');

const { userRouter } = require('./routes/user');
const cors = require('cors');
const app = express();

app.use(express.json()); app.use(cors());

app.use("/users", userRouter);
app.use("/posts", authenticator);
app.use("/posts", postRouter);

app.listen(8080, async () => {
    try {
        await connection
        console.log("Connected to db at port 8080")
    } catch (error) {
        console.log(error.message);
    }
})