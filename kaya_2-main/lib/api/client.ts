import axios from 'axios'

// Setup an axios instance to call authenticated endpoints from that requires token.
const auth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
})

export { auth, client }
