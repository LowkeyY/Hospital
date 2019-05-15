import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi-plugin-react/locale';
import { queryMenus } from '@/services/api';

function formatter(data) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.menuName || !item.menuEntrance) {
        return null;
      }
      const result = {
        name: item.menuName,
        path: item.menuEntrance,
        icon: item.menuIcon,
      };
      if (item.children) {
        const children = formatter(item.children);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData(_, { call, put }) {
      const response = yield call(queryMenus);
      if (response.success) {
        const originalMenuData = memoizeOneFormatter(response.data);
        const menuData = originalMenuData;
        const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
        yield put({
          type: 'save',
          payload: { menuData, breadcrumbNameMap },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
