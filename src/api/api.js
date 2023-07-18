import request from "../request";

export function getProvinces() {
    return request({
        method: 'get',
        url: 'provinces'
    })
}

export function getDistricts() {
    return request({
        method: 'get',
        url: 'districts'
    })
}

export function getWards() {
    return request({
        method: 'get',
        url: 'wards'
    })
}