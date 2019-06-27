import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Pagination, Tag, Modal, Statistic } from 'antd';
import SearchForm from './components/SearchForm';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OrderingModal from './components/OrderingModal';
import { baseUrl } from '@/utils/config';
import styles from './SupplierDistributionList.less';

const { confirm } = Modal;

@connect(({ loading, supplierDistributionList, printing }) => ({
  supplierDistributionList,
  loading: loading.effects['supplierDistributionList/fetch'],
  loadingDetails: loading.effects['printing/querySupplierDetails'],
  loadingBase: loading.effects['printing/querySupplierBase'],
  printing,
}))
class SupplierDistributionList extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      supplierDistributionList: { pageSize },
    } = this.props;
    dispatch({
      type: 'supplierDistributionList/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  }

  pageChangeHandler = page => {
    const {
      dispatch,
      supplierDistributionList: { pageSize },
    } = this.props;
    dispatch({
      type: 'supplierDistributionList/updateNowPage',
      payload: {
        nowPage: page,
      },
    });
    dispatch({
      type: 'supplierDistributionList/fetch',
      payload: {
        nowPage: page,
        pageSize,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierDistributionList/updatePageSize',
      payload: {
        pageSize,
      },
    });
    dispatch({
      type: 'supplierDistributionList/fetch',
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  handleGetOrderClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierDistributionList/updateState',
      payload: {
        baseId: record.distributionId,
      },
    });
    dispatch({
      type: 'supplierDistributionList/fetchDetails',
      payload: {
        baseId: record.distributionId,
      },
    });
  };

  hanlerReset = () => {
    const {
      dispatch,
      supplierDistributionList: { pageSize },
    } = this.props;
    dispatch({
      type: 'supplierDistributionList/fetch',
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      supplierDistributionList: { pageSize },
    } = this.props;
    const { state = '', hospitalId = '', deptId = '', beginDate = '', endDate = '' } = values;
    const res = {
      state: state === '' ? undefined : state,
      hospitalId: hospitalId === '' ? undefined : hospitalId,
      deptId: deptId === '' ? undefined : deptId,
      endDate: endDate === '' ? undefined : endDate,
      beginDate: beginDate === '' ? undefined : beginDate,
      nowPage: 1,
      pageSize,
    };
    dispatch({
      type: 'supplierDistributionList/fetch',
      payload: {
        ...res,
      },
    });
  };

  getExtra = () => {
    const {
      supplierDistributionList: { sum = '' },
    } = this.props;
    return (
      <div className={styles.Extra}>
        <div>配货单记录</div>
        {sum !== '' ? <Statistic title="总金额(元)" value={sum} /> : null}
      </div>
    );
  };

  renderSupplierDetails = data => {
    const { details = [], goodsHead = '' } = data;
    const result = [];
    if (details.length > 0) {
      details.map(item => {
        const {
          goodsNumber = 1,
          goodsBase: { goodsNameCn = '', goodsSpec = '' },
          termOfValidity = '',
          allDetailCode = [],
        } = item;
        for (let i = 0; i < goodsNumber; i++) {
          result.push(
            <div
              style={{
                width: '52.5mm',
                height: '29.6mm',
                fontSize: '11px',
                display: 'inline-block',
                marginTop: '10',
              }}
            >
              <div
                style={{
                  width: '85%',
                  height: '29.6mm',
                  margin: '0 auto',
                }}
              >
                <div>
                  <img
                    style={{
                      width: '70%',
                      height: '28px',
                    }}
                    src={`${baseUrl}/qrCodeImg/${allDetailCode[i] && allDetailCode[i].qrCode}.png`}
                    alt="图片获取失败"
                  />
                </div>
                <div>{`${goodsHead}${allDetailCode[i] && allDetailCode[i].qrCode}`}</div>
                <div>{goodsNameCn}</div>
                <div>{`规格:${goodsSpec}`}</div>
                <div>{`有效期:${termOfValidity.slice(0, 10)}`}</div>
              </div>
            </div>
          );
        }
      });
      return result;
    }
  };

  renderSupplierBase = data => {
    const {
      hospitalBase = {},
      suppilerBase = {},
      creatDate = '',
      arrivalTime = '',
      userBase = {},
      header = '',
      phoneNumber = '',
      details = [],
      distributionId = '',
    } = data;
    const { hospitalName = '' } = hospitalBase;
    const { suppilerName = '' } = suppilerBase;
    const { userRealName = '' } = userBase;
    const getList = arr => {
      const result = [];
      if (!arr) {
        return undefined;
      }
      arr.map((item, i) => {
        result.push({
          ...item,
          key: i + 1,
        });
      });
      return result;
    };
    const getTotal = arr => {
      let sum = 0;
      arr.map(item => {
        sum += item.goodsNumber;
      });
      return sum;
    };
    const columns = [
      {
        title: '编号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '货品名称',
        dataIndex: 'goodsNameCn',
        key: 'goodsNameCn',
        width: 80,
        render: (text, record) => record.goodsBase.goodsNameCn,
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
        dataIndex: 'methodName',
        key: 'methodName',
        width: 80,
        render: (text, record) => record.goodsBase.methodBase.methodName,
      },
      {
        title: '生产厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        width: 80,
        render: (text, record) => record.goodsBase.manufacturer,
      },
      {
        title: '数量',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber',
        render: (text, record) => record.goodsNumber,
      },
      {
        title: '有效期',
        dataIndex: 'termOfValidity',
        key: 'termOfValidity',
        width: 50,
        render: (text, record) => record.termOfValidity,
      },
      {
        title: '灭菌日期',
        dataIndex: 'sterilizationDate',
        key: 'sterilizationDate',
        width: 50,
        render: (text, record) => record.sterilizationDate,
      },
      {
        title: '批号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        render: (text, record) => record.batchNumber,
      },
      {
        title: '注册证号',
        dataIndex: 'registMark',
        key: 'registMark',
        width: 80,
        render: (text, record) => record.goodsBase.registMark,
      },
    ];
    return (
      <div>
        <div
          style={{
            width: '90%',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginRight: '40px',
              }}
            >
              {`${hospitalName}条码入库单`}
            </div>
            <div style={{ textAlign: 'center' }}>
              <img
                style={{ maxHeight: '60px' }}
                src={`${baseUrl}/qrCodeImg/${distributionId}Base.png`}
                alt=""
              />
              <div>{header + distributionId}</div>
            </div>
          </div>
          <div
            style={{
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                marginTop: '10px',
                fontSize: '16px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ width: '50%' }}>{`配货单位：${suppilerName}`}</span>
              <span style={{ width: '40%' }}>{`订货日期：${creatDate}`}</span>
            </div>
            <div
              style={{
                marginTop: '10px',
                fontSize: '16px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ marginRight: '20px' }}>{`制单人：${userRealName}`}</span>
                <span>{`联系电话：${phoneNumber}`}</span>
              </div>
              <span style={{ width: '40%' }}>{`送货日期：${arrivalTime}`}</span>
            </div>
          </div>
          <Table
            className={styles.printTable}
            columns={columns}
            dataSource={getList(details)}
            rowKey={record => record.key}
            pagination={false}
          />
          <div
            style={{
              marginTop: '10px',
              paddingRight: '20px',
              fontSize: '16px',
              textAlign: 'right',
            }}
          >
            <span>总计：</span>
            <span>{getTotal(details)}</span>
          </div>
        </div>
      </div>
    );
  };

  printingDetailsClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'printing/querySupplierDetails',
      payload: {
        baseId: record.distributionId,
      },
    });
    this.handlerShowConfirm('details');
  };

  doPrinting = type => {
    if (type === 'details') {
      const win = window.open('', 'printwindow');
      win.document.write(window.document.getElementById('billDetails').innerHTML);
      win.print();
      win.close();
    } else {
      window.document.body.innerHTML = window.document.getElementById('billBase').innerHTML;
      window.print.portrait = false;
      window.print();
      window.location.reload();
    }
  };

  handlerShowConfirm = type => {
    confirm({
      title: '确定要打印吗?',
      content: '点击确定按钮执行打印',
      onOk: () => this.doPrinting(type),
      okText: '确认',
      cancelText: '取消',
    });
  };

  printingClick = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'printing/querySupplierBase',
      payload: {
        baseId: record.distributionId,
      },
    });
    this.handlerShowConfirm('base');
  };

  render() {
    const {
      supplierDistributionList: { list, totalCount, nowPage, pageSize },
      loading,
      loadingDetails,
      loadingBase,
      printing: { supplierDetails, supplierBase },
    } = this.props;
    const columns = [
      {
        title: '订货单ID',
        dataIndex: 'purchaseId',
        key: 'purchaseId',
        width: '10%',
      },
      {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        render: (text, record) => record.hospitalBase.hospitalName,
      },
      {
        title: '科室',
        dataIndex: 'deptBase',
        key: 'deptBase',
        render: (text, record) => record.deptBase.deptName,
      },
      {
        title: '出单人',
        dataIndex: 'userRealName',
        key: 'userRealName',
        render: (text, record) => record.userBase.userRealName,
      },
      {
        title: '送货人',
        dataIndex: 'distributor',
        key: 'distributor',
      },
      {
        title: '送货人电话',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: '预计到达时间',
        dataIndex: 'arrivalTime',
        key: 'arrivalTime',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          if (record.state === '1') {
            return <Tag color="gold">配货中</Tag>;
          }
          if (record.state === '2') {
            return <Tag color="cyan">已入库</Tag>;
          }
          return '-';
        },
      },
      {
        title: '合计（元）',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => (
          <div>
            <OrderingModal record={record}>
              <Button type="primary" size="small" onClick={() => this.handleGetOrderClick(record)}>
                配货详情
              </Button>
            </OrderingModal>
          </div>
        ),
      },
      {
        title: '打印',
        key: 'printing',
        fixed: 'right',
        render: (text, record) => (
          <div className={styles.btn}>
            <Button
              style={{ marginBottom: '6px' }}
              type="primary"
              ghost
              size="small"
              onClick={() => this.printingClick(record)}
              loading={loadingBase}
            >
              条码入库单
            </Button>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => this.printingDetailsClick(record)}
              loading={loadingDetails}
            >
              打印条码
            </Button>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title={this.getExtra()}>
        <div className={styles.commonList}>
          <div className={styles.tableForm}>
            <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
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
        <div id="billDetails" style={{ display: 'none' }}>
          <div
            style={{
              width: '210mm',
            }}
          >
            {this.renderSupplierDetails(supplierDetails)}
          </div>
        </div>
        <div id="billBase" style={{ display: 'none' }}>
          <div
            style={{
              width: '210mm',
              marginTop: '20px',
            }}
          >
            {this.renderSupplierBase(supplierBase)}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SupplierDistributionList;
