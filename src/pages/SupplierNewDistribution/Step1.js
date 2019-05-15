import React, { Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Table, Pagination } from 'antd';
import styles from './style.less';

@connect(({ loading, addNewDistribution }) => ({
  addNewDistribution,
  loading: loading.effects['addNewDistribution/fetchGoods'],
}))
class Step1 extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/fetchGoods',
      payload: {
        nowPage: '1',
        pageSize: '10',
      },
    });
  }

  handlerAddClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addNewDistribution/updateDistribution',
      payload: {
        record,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      hospitalManage: { pageSize },
    } = this.props;
    dispatch({
      type: 'addNewDistribution/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'addNewDistribution/fetchGoods',
      payload: {
        nowPage: page,
        pageSize,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'user/updatePageSize',
    //   payload: {
    //     pageSize,
    //   },
    // });
    dispatch({
      type: 'addNewDistribution/fetchGoods',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  nextClick = () => {
    const {
      addNewDistribution: { distributionList },
    } = this.props;

    router.push('/backstage/Add-supplier/distribution');
  };

  render() {
    const {
      addNewDistribution: { goodsList, distributionList, totalCount, nowPage, pageSize },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '供应商',
        dataIndex: 'suppilerName',
        key: 'suppilerName',
        render: (text, record) => record.suppilerBase.suppilerName,
      },
      {
        title: '货品名称',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
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
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Button type="primary" onClick={() => this.handlerAddClick(record)}>
            添加
          </Button>
        ),
      },
    ];
    return (
      <Fragment>
        <Table
          title={() => '货品列表'}
          columns={columns}
          dataSource={goodsList}
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
        <Button disabled={distributionList.length === 0} type="primary" onClick={this.nextClick}>
          下一步
        </Button>
      </Fragment>
    );
  }
}

export default Step1;
