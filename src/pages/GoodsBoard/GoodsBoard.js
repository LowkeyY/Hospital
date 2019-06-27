import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Switch, Tag, Icon, Modal } from 'antd';
import SearchForm from './components/SearchForm';
import GoodsBoardModal from './components/GoodsBoardModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './GoodsBoard.less';

const { confirm } = Modal;

@connect(({ loading, goodsBoard }) => ({
  goodsBoard,
  loading: loading.effects['goodsBoard/fetch'],
}))
class GoodsBoard extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      goodsBoard: { pageSize },
    } = this.props;
    dispatch({
      type: 'global/queryClassify',
    });
    dispatch({
      type: 'global/queryMethod',
    });
    dispatch({
      type: 'goodsBoard/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  }

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
    dispatch({
      type: 'goodsBoard/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'goodsBoard/fetch',
      payload: {
        nowPage: page,
        pageSize,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsBoard/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'goodsBoard/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  hanlerReset = () => {
    const {
      dispatch,
      goodsBoard: { pageSize },
    } = this.props;
    dispatch({
      type: 'goodsBoard/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      goodsBoard: { pageSize },
    } = this.props;
    const { state = '', goodsNameCn = '', dirId = '', methodId = '' } = values;
    const res = {
      state: state === '' ? undefined : state,
      goodsNameCn: goodsNameCn === '' ? undefined : goodsNameCn,
      dirId: dirId === '' ? undefined : dirId,
      methodId: methodId === '' ? undefined : methodId,
      nowPage: 1,
      pageSize,
    };
    dispatch({
      type: 'goodsBoard/fetch',
      payload: {
        ...res,
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
        width: 200,
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
        fixed: 'right',
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
        fixed: 'right',
        render: (text, record) => (
          <span className={styles.operation}>
            <GoodsBoardModal
              record={record}
              isEdit
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
          <div className={styles.tableForm}>
            <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
          </div>
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
            scroll={{ x: 1300 }}
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
