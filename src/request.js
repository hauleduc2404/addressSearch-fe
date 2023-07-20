import axios from 'axios'

const request = axios.create(
    {
        baseURL: process.env.REACT_APP_BASE_API,
        timeout: 5000,
        headers: {'X-Custom-Header': 'foobar'}
    }
)

export default request;