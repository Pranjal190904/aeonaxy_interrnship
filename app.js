const express=require('express');
const app=express();
const {PORT}=require('./config/env.config');
const userRoutes=require('./routes/user.routes');

app.use(express.json());
app.use('/v1/user',userRoutes);
app.listen(PORT);