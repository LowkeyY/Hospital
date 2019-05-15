import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Popconfirm, Button, Icon } from 'antd';
import GoodsModal from './components/modal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './GoodsManage.less';

@connect(({ loading, goods }) => ({
  goods,
  loading: loading.effects['goods/fetch'],
}))
class GoodsManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetch',
    });
  }

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    console.log(id);
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/editor',
      payload: {
        ...values,
        dirId: id,
      },
    });
  };

  deleteGoods = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/deleteGoods',
      payload: {
        dirId: id,
      },
    });
  };

  render() {
    const {
      goods: { list },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '货品分类',
        dataIndex: 'dirName',
        key: 'dirName',
      },
      {
        title: '顺序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '说明',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
            <GoodsModal record={record} onOk={values => this.editHandler(record.dirId, values)}>
              <Icon className={styles.icon} type="edit" />
            </GoodsModal>
            <Popconfirm title="确定删除?" onConfirm={() => this.deleteGoods(record.dirId)}>
              <Icon className={styles.icon} type="delete" />
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.commonList}>
          <div>
            <GoodsModal record={{}} onOk={this.createHandler}>
              <Button type="primary" style={{ marginBottom: '10px' }}>
                新建分类
              </Button>
            </GoodsModal>
          </div>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.dirId}
            pagination={false}
            loading={loading}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default GoodsManage;
