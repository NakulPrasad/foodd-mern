const DBConfig = {
    mongodb_connection_uri:
        process.env.MONGODB_CONNECTION_URI ||
        "mongodb+srv://nakul:qwerty123@foodd.5qdwl8g.mongodb.net/Foodd?retryWrites=true&w=majority",
}

export default DBConfig
