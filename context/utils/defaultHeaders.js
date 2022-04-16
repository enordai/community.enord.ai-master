import axios from 'axios'
import publicIp from 'public-ip'
import {browserName, osName} from 'react-device-detect'

const getIP = async () => {
    return await publicIp.v4()
}

const setDefaultHeaders = async user => {
    const ip = await getIP()
    axios.defaults.headers.common['key'] = process.env.SECRET_API_KEY
    axios.defaults.headers.common['ip'] = ip
    axios.defaults.headers.common['browser'] = browserName
    axios.defaults.headers.common['os'] = osName
    if (user) {
        axios.defaults.headers.common['user_access_token'] = user.access_token
        axios.defaults.headers.common['refresh_token'] = user.refresh_token
    } else {
        delete axios.defaults.headers.common['user_access_token']
        delete axios.defaults.headers.common['refresh_token']
    }
}

export default setDefaultHeaders
