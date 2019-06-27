import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Switch, Tag, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import Modals from './components/Modal';
import GoodsModal from './components/GoodsModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SupplierGoods.less';

const { confirm } = Modal;

@connect(({ loading, supplierGoods }) => ({
  supplierGoods,
  loading: loading.effects['supplierGoods/fetch'],
}))
class SupplierGoods extends PureComponent {
  componentDidMount() {}

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoods/editor',
      payload: {
        ...values,
        configId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      location: { query },
      supplierGoods: { pageSize },
    } = this.props;
    const { deptId = '' } = query;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/Supplier-Goods',
        query: { nowPage: page, pageSize, deptId },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { deptId } = query;
    dispatch({
      type: 'supplierGoods/fetch',
      payload: {
        nowPage: current,
        pageSize,
        deptId,
      },
    });
  };

  handlerSwitch = (configId, checked, e) => {
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
            type: 'supplierGoods/enable',
            payload: {
              configId,
            },
          });
        } else {
          dispatch({
            type: 'supplierGoods/block',
            payload: {
              configId,
            },
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  handlerFetchGoods = deptId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoods/fetchGoods',
      payload: {
        nowPage: 1,
        pageSize: 10,
        deptId,
      },
    });
  };

  render() {
    const {
      supplierGoods: { list, totalCount, nowPage, pageSize },
      location: { query },
      loading,
    } = this.props;
    const { deptName = '', deptId = '' } = query;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        fixed: 'left',
      },
      {
        title: '货品名称',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
        width: 200,
        fixed: 'left',
        render: (text, record) => record.goodsBase.goodsNameCn,
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.goodsBase.isImportef === '0' ? '进口' : '国产'),
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => record.goodsBase.manufacturer,
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase.goodsSpec,
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '方法学',
        dataIndex: 'methodBase',
        key: 'methodBase',
        render: (text, record) => record.goodsBase.methodBase.methodName || '',
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
      },
      {
        title: '状态',
        dataIndex: 'configState',
        key: 'configState',
        render: (text, record) => {
          if (record.configState === '1') {
            return <Tag color="green">正常</Tag>;
          }
          if (record.configState === '2') {
            return <Tag color="gray">停用</Tag>;
          }
          return '-';
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => (
          <span className={styles.operation}>
            <Modals record={record} onOk={values => this.editHandler(record.configId, values)}>
              <Icon className={styles.icon} type="edit" />
            </Modals>
            <Switch
              checked={record.configState === '1'}
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={checked => this.handlerSwitch(record.configId, checked)}
            />
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title={`${deptName}`}>
        <div className={styles.commonList}>
          <div>
            <GoodsModal deptId={deptId}>
              <Button
                type="primary"
                style={{ marginBottom: '10px' }}
                onClick={() => this.handlerFetchGoods(deptId)}
              >
                添加货品
              </Button>
            </GoodsModal>
          </div>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.userId}
            loading={loading}
            pagination={false}
            onChange={this.pageChangeHandler}
            scroll={{ x: 1100 }}
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
      </PageHeaderWrapper>
    );
  }
}

export default SupplierGoods;
