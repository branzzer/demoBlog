const { default: mongoose } = require("mongoose")




const connectDB = async () => {
    try {
        mongoose.connect("mongodb://localhost:27017/blogify")
        console.log("connected to mongodb")
    } catch (error) {
        console.log(`Error in connectDB error => ${error}`)
    }
}

module.exports = {
    connectDB
}