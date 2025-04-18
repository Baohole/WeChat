import mongoose from "mongoose";

export const connect = async () : Promise<void> => {
    try{
        //console.log(process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connect success!')
    }
    catch(err){
        console.log('Database connect failed!')
    }
}