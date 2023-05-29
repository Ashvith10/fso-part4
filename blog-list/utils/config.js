import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = (process.env.NODE_ENV === 'production')
    ? process.env.PROD_MONGODB_URI
    : (process.env.NODE_ENV === 'test')
        ? process.env.TEST_MONGODB_URI
        : process.env.DEV_MONGODB_URI
const PORT = process.env.PORT

export default { MONGODB_URI, PORT }
