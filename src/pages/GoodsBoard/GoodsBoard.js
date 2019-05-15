import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Switch, Tag, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import GoodsBoardModal from './components/GoodsBoardModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './GoodsBoard.less';

const { confirm } = Modal;

@connect(({ loading, goodsBoard }) => ({
  goodsBoard,
  loading: loading.effects['goodsBoard/fetch'],
}))
class GoodsBoard extends PureComponent {
  componentDidMount() {}

  createHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsBoard/create',
      payload: {
        ...values,
      },
    });
  };

  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsBoard/editor',
      payload: {
        ...values,
        goodsId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      goodsBoard: { pageSize },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/goods-board',
        query: { nowPage: page, pageSize },
      })
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsBoard/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handlerSwitch = (goodsId, checked, e) => {
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
            type: 'goodsBoard/enable',
            payload: {
              goodsId,
            },
          });
        } else {
          dispatch({
            type: 'goodsBoard/block',
            payload: {
              goodsId,
            },
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  render() {
    const {
      goodsBoard: { list, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '分类',
        dataIndex: 'dirBase',
        key: 'dirBase',
        render: (text, record) => record.dirBase.dirName,
      },
      {
        title: '中文名',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
      },
      {
        title: '注册号',
        dataIndex: 'registMark',
        key: 'registMark',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.isImportef === '0' ? '进口' : '国产'),
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
      },
      {
        title: '方法学',
        dataIndex: 'methodBase',
        key: 'methodBase',
        render: (text, record) => record.methodBase.methodName || '',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (record.state === '1') {
            return <Tag color="green">正常</Tag>;
          }
          if (record.state === '2') {
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
            <GoodsBoardModal
              record={record}
              isEdit={true}
              onOk={values => this.editHandler(record.goodsId, values)}
            >
              <Icon className={styles.icon} type="edit" />
            </GoodsBoardModal>
            <Switch
              checked={record.state === '1'}
              checkedChildren="启用"
              unCheckedChildren="停用"
              onChange={checked => this.handlerSwitch(record.goodsId, checked)}
            />
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <div className={styles.commonList}>
          <div>
            <GoodsBoardModal record={{}} onOk={this.createHandler}>
              <Button type="primary" style={{ marginBottom: '10px' }}>
                添加货品
              </Button>
            </GoodsBoardModal>
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
      </PageHeaderWrapper>
    );
  }
}

export default GoodsBoard;
