import { app } from "./app.js";
import { env } from "./config/env.js";



app.listen(env.PORT,()=>{
    console.log("App is Running on the port:",env.PORT)
})