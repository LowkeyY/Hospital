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
  Pagination,
  Switch,
  Spin,
  Tag,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import TreeModal from './components/TreeModal';
import styles from './Organization.less';
import UserModal from './components/UserModal';

const { TreeNode } = Tree;
const { confirm } = Modal;

@connect(({ loading, organization, roleManage }) => ({
  organization,
  roleManage,
  treeLoading: loading.effects['organization/fetch'],
  userLoading: loading.effects['organization/queryList'],
}))
class Organization extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/fetch',
    });
  }

  editorBox = treeItem => {
    const {
      organization: { selectedKey },
    } = this.props;
    return (
      <div>
        <TreeModal
          record={treeItem}
          selectedKey={selectedKey}
          type="create"
          onOk={this.createHandler}
        >
          <Button type="primary" size="small" ghost style={{ marginRight: '5px' }}>
            新建
          </Button>
        </TreeModal>
        <TreeModal record={treeItem} selectedKey={selectedKey} onOk={this.editHandler}>
          <Button
            type="primary"
            size="small"
            ghost
            onClick={this.editMenu}
            style={{ marginRight: '5px' }}
          >
            修改
          </Button>
        </TreeModal>
      </div>
    );
  };

  editorUserBox = () => {
    const {
      organization: { selectedKey },
    } = this.props;
    return (
      <div>
        <UserModal record={{}} selectedKey={selectedKey} onOk={this.createUserHandler}>
          <Button type="primary" style={{ marginBottom: '10px' }}>
            添加人员
          </Button>
        </UserModal>
      </div>
    );
  };

  createHandler = values => {
    const {
      dispatch,
      organization: { selectedKey },
    } = this.props;
    if (selectedKey === '') {
      message.error('请选择一个菜单');
    } else {
      dispatch({
        type: 'organization/createTree',
        payload: {
          ...values,
          parentDept: selectedKey,
        },
      });
    }
  };

  editHandler = values => {
    const {
      dispatch,
      organization: { selectedKey, treeItem },
    } = this.props;
    dispatch({
      type: 'organization/editorTree',
      payload: {
        ...values,
        deptId: selectedKey,
        parentDept: treeItem.parentDept || '',
      },
    });
  };

  editUserHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/editor',
      payload: {
        ...values,
        userId: id,
      },
    });
  };

  editMenu = () => {
    const {
      organization: { selectedKey },
    } = this.props;
    if (selectedKey === '') {
      message.error('请选择一个菜单');
    }
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      organization: { pageSize },
    } = this.props;
    dispatch({
      type: 'organization/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'organization/queryList',
      payload: {
        nowPage: page,
        pageSize,
      },
    });
  };

  createUserHandler = values => {
    const {
      dispatch,
      organization: { selectedKey, treeItem },
    } = this.props;
    if (selectedKey === '') {
      message.error('请选择一个菜单');
    } else {
      dispatch({
        type: 'organization/create',
        payload: {
          ...values,
          deptId: treeItem.deptId,
        },
      });
    }
  };

  handlerTreeSelect = (key, e) => {
    const { dispatch } = this.props;
    if (key.length > 0) {
      dispatch({
        type: 'organization/updateState',
        payload: {
          selectedKey: key.join(''),
        },
      });
      dispatch({
        type: 'organization/queryTreeItem',
        payload: { deptId: key.join('') },
      });
      dispatch({
        type: 'organization/queryList',
        payload: { deptId: key.join('') },
      });
    } else {
      dispatch({
        type: 'organization/updateState',
        payload: {
          selectedKey: '',
        },
      });
      message.error('未选择菜单');
    }
  };

  handlerSwitch = (userId, checked, e) => {
    const { dispatch } = this.props;
    confirm({
      title: '确定要改变状态吗？',
      content: '点击确定改变状态',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (checked) {
          dispatch({
            type: 'organization/enableUser',
            payload: {
              userId,
            },
          });
        } else {
          dispatch({
            type: 'organization/blockUser',
            payload: {
              userId,
            },
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            icon={<Icon type={item.icon} style={{ color: '#666' }} />}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.title}
          key={item.key}
          icon={<Icon type={item.icon} style={{ color: '#666' }} />}
        />
      );
    });

  render() {
    const {
      organization: { organizationTree, treeItem, list, totalCount, nowPage, pageSize },
      treeLoading,
      userLoading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '姓名',
        dataIndex: 'userRealName',
      },
      {
        title: '性别',
        dataIndex: 'userSex',
        render: (text, record) => (record.userSex === '0' ? '男' : '女'),
      },
      {
        title: '年龄',
        dataIndex: 'userAge',
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
      },
      {
        title: '状态',
        dataIndex: 'userState',
        render: (text, record) => {
          if (record.userState === '1') {
            return <Tag color="green">正常</Tag>;
          }
          if (record.userState === '2') {
            return <Tag color="red">冻结</Tag>;
          }
          if (record.userState === '3') {
            return <Tag color="gray">停用</Tag>;
          }
          return '-';
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <UserModal record={record} onOk={values => this.editUserHandler(record.userId, values)}>
              <Icon className={styles.icon} type="edit" />
            </UserModal>
            <Switch
              checked={record.userState === '1'}
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={checked => this.handlerSwitch(record.userId, checked)}
            />
          </span>
        ),
      },
    ];
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              bordered={false}
              style={{ marginBottom: 24, textAlign: 'center' }}
              title="组织机构管理"
              extra={this.editorBox(treeItem)}
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
                  {this.renderTreeNodes(organizationTree)}
                </Tree>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card title={treeItem.deptName || '用户管理'} extra={this.editorUserBox()}>
              <Table
                columns={columns}
                dataSource={list}
                rowKey={record => record.id}
                loading={userLoading}
                pagination={false}
                onChange={this.pageChangeHandler}
              />
              <Pagination
                className="ant-table-pagination"
                total={totalCount}
                current={nowPage}
                pageSize={pageSize}
                onChange={this.pageChangeHandler}
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
              />
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Organization;
