import mongoose from "mongoose";
const { Schema } = mongoose;


const UsersSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

const Users = mongoose.model("Users", UsersSchema);

export default Users;