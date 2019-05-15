import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Switch, Tag, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import SupplierModal from './components/supplierModal';
import EditorModal from './components/editorModal';
import styles from './SupplierManage.less';

const { confirm } = Modal;

@connect(({ loading, supplier }) => ({
  supplier,
  loading: loading.effects['supplier/fetch'],
}))
class SupplierManage extends PureComponent {
  componentDidMount() {
    // const { dispatch, salesman: { pageSize } } = this.props;
    // dispatch({
    //   type: 'salesman/fetch',
    //   payload: {
    //     nowPage: 1,
    //     pageSize: pageSize,
    //   },
    // });
  }

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/create',
      payload: values,
    });
  };

  editHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/editor',
      payload: values,
    });
  };

  deleteRole = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/deleteRole',
      payload: {
        suppilerId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      supplier: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/supplier-manage',
        query: { nowPage: page, pageSize },
      })
    );
    // dispatch({
    //   type: 'salesman/updateNowPage',
    //   payload: {
    //     nowPage: page,
    //   },
    // });
    // dispatch({
    //   type: 'salesman/fetch',
    //   payload: {
    //     nowPage: page,
    //     pageSize,
    //   },
    // });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'salesman/updatePageSize',
    //   payload: {
    //     pageSize,
    //   },
    // });
    dispatch({
      type: 'supplier/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handlerSwitch = (suppilerId, checked) => {
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
            type: 'supplier/enable',
            payload: {
              suppilerId,
            },
          });
        } else {
          dispatch({
            type: 'supplier/block',
            payload: {
              suppilerId,
            },
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  handlerDistributionClick = record => {
    const { dispatch } = this.props;
    const { suppilerId, suppilerName } = record;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/distribution-list',
        query: { suppilerId, suppilerName },
      })
    );
  };

  render() {
    const {
      supplier: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '简称',
        dataIndex: 'suppilerShortName',
        key: 'suppilerShortName',
      },
      {
        title: '名称',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
      },
      {
        title: '联系人',
        dataIndex: 'conractsName',
        key: 'conractsName',
      },
      {
        title: '手机号',
        dataIndex: 'conractsPhone',
        key: 'conractsPhone',
      },
      {
        title: '状态',
        dataIndex: 'conractsPhone',
        key: 'conractsPhone',
        render: (text, record) => {
          if (record.suppilerState === '1') {
            return <Tag color="green">正常</Tag>;
          }
          if (record.suppilerState === '2') {
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
            <EditorModal title="修改供应商" record={record} onOk={this.editHandler}>
              <Icon className={styles.icon} type="edit" />
            </EditorModal>
            <Switch
              checkedChildren="启用"
              unCheckedChildren="停用"
              checked={record.suppilerState === '1'}
              onChange={checked => this.handlerSwitch(record.suppilerId, checked)}
            />
          </span>
        ),
      },
      {
        title: '查询配货单',
        key: 'order',
        render: (text, record) => (
          <Button size="small" onClick={() => this.handlerDistributionClick(record)}>
            配货单
          </Button>
        ),
      },
    ];
    return (
      <div className={styles.commonList}>
        <div>
          <SupplierModal title="注册供应商" onOk={this.createHandler}>
            <Button type="primary" style={{ marginBottom: '10px' }}>
              注册供应商
            </Button>
          </SupplierModal>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          rowKey={record => record.id}
          loading={loading}
          pagination={false}
          onChange={this.pageChangeHandler}
        />
        <Pagination
          className="ant-table-pagination"
          total={totalCount * 1}
          current={nowPage * 1}
          pageSize={pageSize * 1}
          onChange={this.pageChangeHandler}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
        />
      </div>
    );
  }
}

export default SupplierManage;
