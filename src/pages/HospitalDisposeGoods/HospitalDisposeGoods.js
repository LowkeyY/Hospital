import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Table, Button, Form, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Modal from './components/Modal';
import styles from './HospitalDisposeGoods.less';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 8 },
};

@connect(({ loading, dispose, global }) => ({
  dispose,
  global,
  loading: loading.effects['dispose/queryDisposeList'],
}))
class Dispose extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { deptId } = query;
    dispatch({
      type: 'dispose/queryDisposeList',
      payload: {
        deptId,
      },
    });
    dispatch({
      type: 'global/getSupplier',
      payload: {
        deptId,
      },
    });
  }

  handlerSubmit = (record, values) => {
    const {
      dispatch,
      dispose: { infos = {} },
      location: { query },
    } = this.props;
    const { deptId } = query;
    if (!infos.configId) {
      dispatch({
        type: 'dispose/addGoodsConfig',
        payload: {
          ...values,
          goodsId: record.goodsId,
          suppilerId: record.suppilerId,
          deptId,
        },
      });
    } else {
      dispatch({
        type: 'dispose/updateCongif',
        payload: {
          ...values,
          goodsId: record.goodsId,
          configId: infos.configId,
          suppilerId: record.suppilerId,
          deptId,
        },
      });
    }
  };

  handlerQuickSubmit = values => {
    const {
      dispatch,
      location: { query },
      dispose: { suppilerId },
    } = this.props;
    const { deptId } = query;
    dispatch({
      type: 'dispose/quickCongif',
      payload: {
        ...values,
        suppilerId,
        deptId,
      },
    });
  };

  renderGoods = val => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { deptId } = query;
    dispatch({
      type: 'dispose/queryDisposeList',
      payload: {
        suppilerId: val,
        deptId,
      },
    });
    dispatch({
      type: 'dispose/updateState',
      payload: {
        suppilerId: val,
      },
    });
  };

  handlerGetInfoClick = record => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { deptId } = query;
    const { goodsId = '' } = record;
    dispatch({
      type: 'dispose/queryInfos',
      payload: {
        goodsId,
        deptId,
      },
    });
  };

  render() {
    const {
      dispose: { list, infos },
      global: { supplier },
      dispatch,
      loading,
    } = this.props;
    const columns = [
      {
        title: '货品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (text, record) => record.goodsBase.goodsNameCn,
      },
      {
        title: '规格',
        dataIndex: 'goodsSpec',
        key: 'goodsSpec',
        render: (text, record) => record.goodsBase.goodsSpec,
      },
      {
        title: '方法学',
        dataIndex: 'methodName',
        key: 'methodName',
        render: (text, record) => record.goodsBase.methodBase.methodName,
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
        render: (text, record) => record.goodsBase.goodsUnit,
      },
      {
        title: '产地',
        dataIndex: 'isImportef',
        key: 'isImportef',
        render: (text, record) => (record.isImportef === '0' ? '进口' : '国产'),
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => record.goodsBase.manufacturer,
      },
      {
        title: '标准库存值',
        dataIndex: 'inventoryValue',
        key: 'inventoryValue',
        render: (text, record) => record.libraryConfig.inventoryValue || '-',
      },
      {
        title: '效期预警(天)',
        dataIndex: 'varningDate',
        key: 'varningDate',
        render: (text, record) => record.libraryConfig.varningDate || '-',
      },
      {
        title: '操作',
        key: 'order',
        render: (text, record) => (
          <Modal
            record={record}
            infos={infos}
            dispatch={dispatch}
            onOk={values => this.handlerSubmit(record, values)}
          >
            <Button size="small" onClick={() => this.handlerGetInfoClick(record)}>
              库存配置
            </Button>
          </Modal>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title="库存配置">
        <div className={styles.commonList}>
          <div className={styles.title}>
            <Form className={styles.form} horizontal="true">
              <Form.Item {...formItemLayout} label="选择供应商">
                <div id="classifyArea" style={{ position: 'relative' }}>
                  <Select
                    onSelect={val => this.renderGoods(val)}
                    getPopupContainer={() => document.getElementById('classifyArea')}
                  >
                    {supplier.map((item, i) => (
                      <Select.Option key={i} value={item.suppilerBase.suppilerId}>
                        {item.suppilerBase.suppilerName}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Form.Item>
            </Form>
            <Modal infos={{}} dispatch={dispatch} onOk={values => this.handlerQuickSubmit(values)}>
              <Button type="primary">一键配置</Button>
            </Modal>
          </div>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={record => record.configId}
            loading={loading}
            pagination={false}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Dispose;
