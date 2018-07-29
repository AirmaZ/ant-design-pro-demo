import { queryNotices, getMenuDataInfo } from '../services/api';
import { isUrl } from '../utils/utils';
import uuidV4 from 'uuid/v4';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menuDataInfo: [],
  },

  effects: {
    *fetchMenuData(_, { call, put }) {
      const data = yield call(getMenuDataInfo);
      yield put({
        type: 'setMenu',
        payload: data.module,
      });
    },
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    setMenu(state, { payload }) {
      const menuData = [
        {
          name: 'dashboard',
          icon: 'dashboard',
          path: 'dashboard',
          menuKey: 'menu_1',
          children: [
            {
              name: '分析页',
              path: 'analysis',
            },
            {
              name: '监控页',
              path: 'monitor',
            },
            {
              name: '工作台',
              path: 'dashboard/workplace',
              // hideInBreadcrumb: true,
              // hideInMenu: true,
            },
          ],
        },
        {
          name: '外链页面',
          icon: 'dashboard',
          path: 'link',
          menuKey: 'menu_2',
          children: [
            {
              name: '百度',
              path: 'baidu',
              menuKey: 'menu_2_1',
              children: [
                {
                  name: '百度首页',
                  path: 'link?link=http://www.baidu.com',
                },
              ],
            },
            {
              name: '搜狐',
              path: 'http://www.souhu.com',
            },
          ],
        },
        {
          name: '表单页',
          icon: 'form',
          path: 'form',
          children: [
            {
              name: '基础表单',
              path: 'basic-form',
            },
            {
              name: '分步表单',
              path: 'step-form',
            },
            {
              name: '高级表单',
              authority: 'admin',
              path: 'advanced-form',
            },
          ],
        },
        {
          name: '列表页',
          icon: 'table',
          path: 'list',
          children: [
            {
              name: '查询表格',
              path: 'table-list',
            },
            {
              name: '标准列表',
              path: 'basic-list',
            },
            {
              name: '卡片列表',
              path: 'card-list',
            },
            {
              name: '搜索列表',
              path: 'search',
              children: [
                {
                  name: '搜索列表（文章）',
                  path: 'articles',
                },
                {
                  name: '搜索列表（项目）',
                  path: 'projects',
                },
                {
                  name: '搜索列表（应用）',
                  path: 'applications',
                },
              ],
            },
          ],
        },
        {
          name: '详情页',
          icon: 'profile',
          path: 'profile',
          children: [
            {
              name: '基础详情页',
              path: 'basic',
            },
            {
              name: '高级详情页',
              path: 'advanced',
              authority: 'admin',
            },
          ],
        },
        {
          name: '结果页',
          icon: 'check-circle-o',
          path: 'result',
          children: [
            {
              name: '成功',
              path: 'success',
            },
            {
              name: '失败',
              path: 'fail',
            },
          ],
        },
        {
          name: '异常页',
          icon: 'warning',
          path: 'exception',
          children: [
            {
              name: '403',
              path: 'exception/403',
            },
            {
              name: '404',
              path: 'exception/404',
            },
            {
              name: '500',
              path: 'exception/500',
            },
            {
              name: '触发异常',
              path: 'trigger',
              hideInMenu: true,
            },
          ],
        },
        {
          name: '账户',
          icon: 'user',
          path: 'user',
          authority: 'guest',
          children: [
            {
              name: '登录',
              path: 'login',
            },
            {
              name: '注册',
              path: 'register',
            },
            {
              name: '注册结果',
              path: 'register-result',
            },
          ],
        },
      ];

      function findChildren(aclMenuId) {
        let result = [];
        payload.forEach(item => {
          if (item.parentNode === aclMenuId) {
            let resultItem = {
              name: item.menuName,
              icon: item.icon || 'appstore',
              path: item.menuUrl.split('../')[1],
              rank: item.rank,
              menuKey: uuidV4(),
              children: findChildren(item.aclMenuId),
            };
            if (resultItem.children.length === 0 || !resultItem.children)
              delete resultItem.children;
            result.push(resultItem);
          }
        });
        result.sort((a, b) => {
          return a.rank - b.rank;
        });
        return result;
      }

      function setMenuData() {
        let result = [];
        payload.forEach(item => {
          if (item.rank === 1 && item.parentNode === -1) {
            let resultItem = {
              name: item.menuName,
              icon: item.icon || 'appstore',
              path: item.menuUrl.split('../')[1],
              rank: item.rank,
              menuKey: uuidV4(),
              children: findChildren(item.aclMenuId),
            };
            if (resultItem.children.length === 0 || !resultItem.children)
              delete resultItem.children;
            result.push(resultItem);
          }
        });
        result.sort((a, b) => {
          return a.rank - b.rank;
        });
        return result;
      }

      function formatter(data, parentPath = '/', parentAuthority) {
        return data.map(item => {
          let { path } = item;
          // if (!isUrl(path)) {
          //   path = parentPath + item.path;
          // }
          const result = {
            ...item,
            path,
            authority: item.authority || parentAuthority,
          };
          if (item.children) {
            result.children = formatter(
              item.children,
              `${parentPath}${item.path}/`,
              item.authority
            );
          }
          return result;
        });
      }
      return {
        ...state,
        menuDataInfo: formatter(setMenuData()),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
