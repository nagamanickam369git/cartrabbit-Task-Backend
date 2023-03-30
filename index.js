const express = require('express');
const app = express();

const port = 5000;
const morgan = require('morgan');
const cors = require('cors')
const router = require('./Router')
const Owner = require('./OwnerSchema')







//Morgan middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());// body-parser


//Router
app.use('/BikeService', router)
app.use('/BikeService', Owner)


app.listen(port, () => {
  console.log(`Server is running on --------------->> ${port}`)

})


