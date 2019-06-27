import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Tag } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SupplierDepartment.less';

@connect(({ loading, supplierDepartment }) => ({
  supplierDepartment,
  loading: loading.effects['supplierDepartment/fetch'],
}))
class SupplierDepartment extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { hospitalId = '' } = query;
    dispatch({
      type: 'supplierDepartment/fetch',
      payload: {
        hospitalId,
      },
    });
  }

  handlerGoGoodsClick = record => {
    const { dispatch } = this.props;
    const {
      deptId = '',
      deptBase: { deptName = '' },
    } = record;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/Supplier-goods',
        query: { deptId, deptName },
      })
    );
  };

  render() {
    const {
      supplierDepartment: { list },
      location: { query },
      loading,
    } = this.props;
    const { hospitalName } = query;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '科室',
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '申请时间',
        dataIndex: 'crateDate',
        key: 'crateDate',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (record.state === '0') {
            return <Tag color="pink">未审核</Tag>;
          }
          if (record.state === '1') {
            return <Tag color="green">正常</Tag>;
          }
          if (record.state === '2') {
            return <Tag color="red">审核失败</Tag>;
          }
          if (record.state === '3') {
            return <Tag color="gray">停用</Tag>;
          }
          return '-';
        },
      },
      {
        title: '货品管理',
        key: 'operation',
        render: (text, record) => (
          <Button
            disabled={record.state !== '1'}
            type="primary"
            ghost
            size="small"
            onClick={() => this.handlerGoGoodsClick(record)}
          >
            管理
          </Button>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title={`${hospitalName}的科室`}>
        <div className={styles.commonList}>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.methodId}
            pagination={false}
            loading={loading}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SupplierDepartment;
