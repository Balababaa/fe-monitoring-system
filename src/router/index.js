// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';

/**
 * 基础管理
 */

// 设备管理
import device from '@/views/base/device';

// 设备管理
import info from '@/views/base/info';


/**
 * 设备中心
 */

// 实时监控
import realTime from '@/views/play/realTime';

// 监控回放
import replay from '@/views/play/replay';

// 监控回放文件
import replayFile from '@/views/play/replayFile';

/**
 * 系统管理
 */

// 用户管理
import user from '@/views/system/user';

// 角色管理
import role from '@/views/system/role';

// 权限管理
import permission from '@/views/system/permission';

// 启用路由
Vue.use(Router);

// 导出路由 
export default new Router({
    routes: [{
        path: '/',
        name: '',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/login',
        name: '登录',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/index',
        name: '首页',
        component: index,
        iconCls: 'el-icon-tickets',
        children: [
        {
            path: '/base/device',
            name: '设备管理',
            component: device,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/base/info',
            name: '个人中心',
            component: info,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/play/realTime',
            name: '实时监控',
            component: realTime,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/play/replay',
            name: '监控回放',
            component: replay,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/play/replayFile',
            name: '回放文件',
            component: replayFile,
            meta: {
                requireAuth: true
            }
        }, 
        {
            path: '/system/user',
            name: '用户管理',
            component: user,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/system/role',
            name: '角色管理',
            component: role,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/system/permission',
            name: '权限管理',
            component: permission,
            meta: {
                requireAuth: true
            }
        }]
    }]
})