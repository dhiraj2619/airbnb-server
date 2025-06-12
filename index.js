const express = require('express');
const { PORT } = require('./config/config');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const app = express();  


const port = PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.get('/', (req, res) => {
 res.send(`<center><h1>Server is Started...</h1></center>`);
});


app.use('/api/user',userRouter);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});