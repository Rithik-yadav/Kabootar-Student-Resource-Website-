import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "Kabootar",
  })
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((e) => {
    console.log(e);
  });

const kabootarSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("users", kabootarSchema);

module.exports = collection;
