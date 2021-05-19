import axios from 'axios';

axios.defaults.withCredentials = true
axios.defaults.baseURL = "http://localhost:8080"
// const baseURL = "http://localhost:8080"

// 登录请求方法
const loginreq = (method, url, params) => {
    console.log(params)
    return axios({
        method: method,
        url:  url,
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: JSON.stringify(params),
        traditional: true,
    }).then(res => res.data);
};
// 通用公用方法
const req = (method, url, params) => {
    return axios({
        method: method,
        url:  url,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            login_token: localStorage.getItem('login_token')
        },
        data: params,
        traditional: true,
        transformRequest: [
            function(data) {
                console.log(data)
                let ret = ''
                for (let it in data) {
                    ret +=
                        encodeURIComponent(it) +
                        '=' +
                        encodeURIComponent(data[it]) +
                        '&'
                }
                return ret
            }
        ]
    }).then(res => res.data);
};

const post = (uri, params) => {
    return axios.post(uri, JSON.stringify(params),{
        'headers' : {
            'Content-Type': 'application/json;charset=UTF-8',
            login_token: localStorage.getItem('login_token')
        }
    }).then(res => res.data)
};

const get = (uri, params) => {
    return axios.get(uri, {
        'params' : params,
        'headers' : {
            'Content-Type': 'application/json;charset=UTF-8',
            login_token: localStorage.getItem('login_token')
        }
    }).then(res => res.data)
};

const download = (uri, params) => {
    return axios.get(uri, {
        'params' : params,
        // 'baseURL': 'http://192.168.18.103:8808',
        'headers' : {
            login_token: localStorage.getItem('login_token')
        },
        responseType: 'blob',
    }).then(res => res.data)
};


export {
    loginreq,
    req,
    get,
    post,
    download
}