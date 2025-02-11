/*
 * @Description: 文件
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2022-06-21 05:29:36
 * @LastEditors: gumingchen
 * @LastEditTime: 2022-06-21 05:29:36
 */
import service from '@/utils/request'
import { parseJson2Param, getApiBaseUrl } from '@/utils'

/**
 * @description: 分页列表
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function pageApi(params) {
  return service({
    url: '/backstage/file/page',
    method: 'get',
    params: params
  })
}

/**
 * @description: 删除
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function delApi(params) {
  return service({
    url: '/backstage/file/delete',
    method: 'post',
    data: params
  })
}

/**
 * @description: 更新配置
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function updateConfigApi(params) {
  return service({
    url: '/backstage/file/update/config',
    method: 'post',
    data: params
  })
}

/**
 * @description: 上传
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function uploadApi(params) {
  let result = ''
  const options = {
    url: '/backstage/file/upload',
    method: 'get',
    params: params
  }
  result = `${ getApiBaseUrl() + options.url }${ options.params ? parseJson2Param(options.params) : '' }`
  return result
}
