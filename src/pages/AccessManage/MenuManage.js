import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Button,
  Tree,
  Icon,
  Table,
  message,
  Modal,
  Menu,
  Dropdown,
  Spin,
} from 'antd';
import { isUrl } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import MenuModal from './components/MenuModal';
import styles from './MenuManage.less';

const { TreeNode } = Tree;
const { confirm } = Modal;
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};
const columns = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '创建时间',
    dataIndex: 'creatDate',
  },
];

@connect(({ loading, menuManage, roleManage }) => ({
  menuManage,
  roleManage,
  treeLoading: loading.effects['menuManage/fetch'],
  roleLoading: loading.effects['roleManage/fetch'],
}))
class MenuManage extends PureComponent {
  state = {};

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows = []) => {
      const res = [];
      selectedRows.map(item => {
        res.push(item.roleId);
        return res;
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'menuManage/updateMenuRole',
        payload: res.join(','),
      });
    },
    getCheckboxProps: record => ({
      defaultChecked: this.isChecked(record.roleId),
    }),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManage/fetch',
    });
  }

  editorBox = menuItem => {
    const {
      menuManage: { selectedKey },
    } = this.props;
    return (
      <div>
        <MenuModal record={{}} type="create" onOk={this.createHandler}>
          <Button type="primary" size="small" ghost style={{ marginRight: '5px' }}>
            新建
          </Button>
        </MenuModal>
        <MenuModal record={menuItem} selectedKey={selectedKey} onOk={this.editHandler}>
          <Button
            type="primary"
            size="small"
            ghost
            onClick={this.editMenu}
            style={{ marginRight: '5px' }}
          >
            修改
          </Button>
        </MenuModal>
        <Button type="primary" size="small" ghost onClick={this.showDeleteConfirm}>
          删除
        </Button>
      </div>
    );
  };

  getTitle = (e, title) => {
    return (
      <div className={styles.title}>
        <div>
          <Icon type="tag" style={{ fontSize: '16px', margin: '5px' }} />
          {title}
        </div>
        <div>
          <Button type="primary" ghost onClick={this.updateRole}>
            保存
          </Button>
        </div>
      </div>
    );
  };

  createHandler = values => {
    const {
      dispatch,
      menuManage: { selectedKey },
    } = this.props;
    dispatch({
      type: 'menuManage/create',
      payload: {
        ...values,
        pMenuId: selectedKey,
      },
    });
  };

  editHandler = values => {
    const {
      dispatch,
      menuManage: { selectedKey, menuItem },
    } = this.props;
    dispatch({
      type: 'menuManage/editor',
      payload: {
        ...values,
        menuId: selectedKey,
        pMenuId: menuItem.pMenuId || '',
        menuRoles: this.getMenuRole(menuItem.menuRoles),
      },
    });
  };

  deleteMenu = () => {
    const {
      dispatch,
      menuManage: { selectedKey },
    } = this.props;
    dispatch({
      type: 'menuManage/deleteMenu',
      payload: {
        menuId: selectedKey,
      },
    });
  };

  showDeleteConfirm = () => {
    const {
      menuManage: { selectedKey },
    } = this.props;
    if (selectedKey !== '') {
      confirm({
        title: '确定要删除吗？',
        content: '删除后不可恢复',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: this.deleteMenu,
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      message.error('请选择一个菜单');
    }
  };

  editMenu = () => {
    const {
      menuManage: { selectedKey },
    } = this.props;
    if (selectedKey === '') {
      message.error('请选择一个菜单');
    }
  };

  updateRole = () => {
    const {
      menuManage: { menuItem, menuRole, selectedKey },
      dispatch,
    } = this.props;
    dispatch({
      type: 'menuManage/editor',
      payload: {
        ...menuItem,
        menuRoles: this.getMenuRole(menuRole),
        menuId: selectedKey,
      },
    });
  };

  handlerTreeSelect = (key, e) => {
    if (key.length > 0) {
      const { dispatch } = this.props;
      dispatch({
        type: 'menuManage/updateState',
        payload: {
          selectedKey: key.join(''),
        },
      });
      dispatch({
        type: 'menuManage/queryMenuItem',
        payload: { menuId: key.join('') },
      });
      dispatch({
        type: 'roleManage/fetch',
      });
    } else {
      message.error('未选择菜单');
    }
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} icon={getIcon(item.icon)}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} icon={getIcon(item.icon)} />;
    });

  isChecked = item => {
    const {
      menuManage: { menuRole },
    } = this.props;
    if (menuRole) {
      return menuRole.includes(`[${item}]`);
    }
  };

  getMenuRole = str => {
    const res = [];
    if (!str) {
      return;
    }
    const arr = str.split(',');
    arr.map(item => {
      res.push(`[${item}]`);
    });
    return res.join(',');
  };

  render() {
    const {
      menuManage: { menuTree = [], menuItem },
      roleManage: { roleList },
      treeLoading,
      roleLoading,
    } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              bordered={false}
              style={{ marginBottom: 24, textAlign: 'center' }}
              title="菜单管理"
              extra={this.editorBox(menuItem)}
            >
              {treeLoading ? (
                <Spin />
              ) : (
                <Tree
                  showIcon
                  defaultExpandAll
                  defaultSelectedKeys={[1]}
                  switcherIcon={<Icon type="down" style={{ fontSize: '16px' }} />}
                  onSelect={this.handlerTreeSelect}
                >
                  {this.renderTreeNodes(menuTree)}
                </Tree>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card title="菜单权限控制">
              <Table
                className={styles.table}
                rowSelection={this.rowSelection}
                title={e => this.getTitle(e, menuItem.menuName || '未选择菜单')}
                pagination={false}
                columns={columns}
                dataSource={roleList}
                loading={roleLoading}
              />
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default MenuManage;
