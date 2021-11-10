/* 网络请求接口列表 author: @chh */
import request from './network'

/* ------------------------------------用户相关接口------------------------------- */
/* 账号登陆接口 */
export const login = (params) => {
  return request({
    url: '/login',
    data: params,
  }, '登陆中...', true)
}

/* 用户注册接口 */
export const register = (params) => {
  return request({
    url: '/user',
    data: params,
  }, '注册中...', true)
}

/* 修改用户信息接口 */
export const updateUserInfo = (params) => {
  return request({
    url: '/user/update',
    data: params,
  })
}

/* 用户修改密码接口 */
export const updatePassword = (params) => {
  return request({
    url: '/user/updatePassword',
    data: params,
  }, '修改中...', true)
}

/* ------------------------------------动态相关接口------------------------------- */
/* 获取动态(帖子)列表 */
export const getMomentList = (params) => {
  return request({
    url: '/moment/list',
    data: params,
    method: 'GET'
  })
}

/* 获取某个用户的帖子 */
export const getMomentListByUser = (params) => {
  return request({
    url: '/moment/userList',
    data: params,
    method: 'GET'
  }, '加载中...')
}

/* 获取动态(帖子)详情 */
export const getMomentDetail = (params) => {
  return request({
    url: `/moment/detail/${params.momentId}`,
    method: 'GET',
    data: {
      uid: params.uid || ''
    }
  }, '加载中...')
}

/* 新增动态(帖子) */
export const createMoment = (params) => {
  return request({
    url: `/moment/create`,
    data: params
  }, '发布中...')
}

/* 修改动态(帖子) */
export const updateMoment = (params, momentId) => {
  return request({
    url: `/moment/${momentId}`,
    data: params,
  }, '修改中...')
}

/* 删除动态（帖子） */
export const deleteMoment = (momentId) => {
  return request({
    url: `/moment/${momentId}`,
    method: 'DELETE'
  }, '删除中...')
}

/* 动态(帖子)添加标签 */
export const setMomentLabels = (params, momentId) => {
  return request({
    url: `/moment/${momentId}/labels`,
    data: params
  }, '添加中...')
}



/* -----------------------------------评论相关接口----------------------------------- */
/* 获取动态(帖子)评论 */
export const getCommentList = (params) => {
  return request({
    url: `/comment`,
    data: params,
    method: 'GET'
  }, '加载中...')
}
/* 对动态(帖子)发表评论 */
export const setComment = (params) => {
  return request({
    url: `/comment`,
    data: params,
  })
}
/* 回复评论 */
export const replyComment = (params, commentId) => {
  return request({
    url: `/comment/reply/${commentId}`,
    data: params,
  })
}

/* ----------------------------------------标签相关---------------------------------------- */
/* 获取标签列表 */
export const getLabelList = (params) => {
  return request({
    url: `/label`,
    data: params,
    method: 'GET'
  })
}

/* 获取指定标签下的动态 */
export const getMomentByLabel = (params, labelId) => {
  return request({
    url: `/label/${labelId}`,
    data: params,
    method: 'GET'
  })
}

/* 关注，取消关注标签 */
export const followLabel = (params) => {
  return request({
    url: `/label/follow`,
    data: params,
  })
}

/* 获取用户关注的标签 */
export const getUserLabelList = (params) => {
  return request({
    url: `/label/user`,
    data: params,
    method: 'GET'
  })
}
/* ---------------------------------------------------点赞相关------------------------------------------------------- */
/* 点赞，取消点赞动态 */
export const favorMoment = (params) => {
  return request({
    url: `/favor/moment`,
    data: params,
  })
}

/* 点赞，取消点赞评论 */
export const favorComment = (params) => {
  return request({
    url: `/favor/comment`,
    data: params,
  })
}

/* 获取用户点赞的文章列表 */
export const getFavorMomentList = (params) => {
  return request({
    url: `/favor/getMomentList`,
    data: params,
    method: 'GET'
  })
}

/* ----------------------------------------------收藏相关接口------------------------------------------------- */
/* 获取用户收藏夹 */
export const getCollectionList = (params) => {
  return request({
    url: `/collection/list`,
    data: params,
    method: 'GET'
  })
}

/* 获取用户收藏夹下的文章 */
export const getCollectMoment = (params) => {
  return request({
    url: `/collection/momentList`,
    data: params,
    method: 'GET'
  })
}

/* 收藏，取消收藏文章 */
export const collectMoment = (params) => {
  return request({
    url: `/collection/moment`,
    data: params,
  })
}

/* 用户添加收藏夹 */
export const addCollection = (params) => {
  return request({
    url: `/collection/user`,
    data: params,
  })
}

/* 用户删除收藏夹 */
export const removeCollection = (params) => {
  return request({
    url: `/collection/remove`,
    data: params
  })
}

/* 用户收藏夹重命名 */
export const renameCollection = (params) =>{
  return request({
    url: `/collection/rename`,
    data: params
  })
}

/* ---------------------------------------------浏览相关接口------------------------------------------------ */
/* 添加，修改文章浏览记录 */
export const addFootprint = (params) =>{
  return request({
    url: `/moment/footprint`,
    data: params
  })
}

/* 获取用户的浏览记录 */
export const getFootprint = (params) =>{
  return request({
    url: `/moment/footprintList`,
    data: params,
    method: 'GET'
  })
}



