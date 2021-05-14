import axios from 'axios';
import { loginreq, req, get, post, download } from './axiosFun';

// 获取验证码接口
export const getCodeAPI = (params) => { return req("get", "/api/auth/code", {}) };

// 登录接口 
export const loginAPI = (params) => { return loginreq("post", "/api/auth/login", params) };

// 获取设备信息接口 
export const deviceListAPI = (params) => { return get("/api/device/list", params) };

// 保存设备信息接口
export const deviceSaveAPI = (params) => { return post("/api/device/save", params) };

// 更新删除状态设备接口
export const deviceDeleteStatusUpdateAPI = (params) => { return post("/api/device/delete/status", params) }
export const deviceDeleteAPI = (params) => { return post("/api/device/delete", params) }

// 回放文件列表接口
export const videoFileListAPI = (params) => { return get("/api/video/file/list", params) }

export const UserUpdateAPI  = (params) => { return post("/user/modify", params) }

// 回放文件下载接口
export const videoFileDownloadAPI = (filename) => {
    return download(`/api/video/file/play/${filename}`, {}).then(res => {
        innerDownload(res, filename)
    })
}

export function innerDownload(data, fileName) {
    if (!data) {
        return
    }
    const content = data
    const blob = new Blob([content], { type: "video/mp4" })
    if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
    } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
    }
}

export const userList = (params) => { return get("/user/list", params) }

export const roleList = (params) => { return get("/api/role/list", params) }

export const roleListAll = (params) => { return get("/api/role/list_all", params) }

export const permissionList = (params) => { return get("/api/permission/list", params) }

export const permissionListAll = (params) => { return get("/api/permission/list_all", params) }

export const userSave  = (params) => { return post("/user/save", params) }

export const roleSave  = (params) => { return post("/api/role/save", params) }

export const permissionSave = (params) => { return post("/api/permission/save", params) }

export const roleAdd  = (params) => { return post("/user/add", params) }

export const permissionAdd  = (params) => { return post("/api/role/add", params) }