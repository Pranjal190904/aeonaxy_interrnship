const express=require('express');
const app=express();
const {PORT}=require('./config/env.config');
const userRoutes=require('./routes/user.routes');
const courseRoute=require('./routes/course.route');
const cookieParser=require('cookie-parser');

app.use(express.json());
app.use(cookieParser())
app.use('/v1/user',userRoutes);
app.use('/v1/course',courseRoute);
app.listen(PORT);