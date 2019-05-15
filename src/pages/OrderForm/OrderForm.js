import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ApplyHospital from './components/ApplyHospital';
import ApplyDepartment from './components/ApplyDepartment';
import styles from './OrderForm.less';

@connect(({ orderForm, loading }) => ({
  orderForm,
  loadHospital: loading.effects['orderForm/applyHospital'],
  loadDepartment: loading.effects['orderForm/applyDepartment'],
}))
class OrderForm extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'order':
        router.push(`${match.url}/order`);
        break;
      case 'apply':
        router.push(`${match.url}/apply`);
        break;
      default:
        break;
    }
  };

  applyHospitalHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderForm/applyHospital',
      payload: {
        ...values,
      },
    });
  };

  applyDepartmentHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderForm/applyDepartment',
      payload: {
        ...values,
      },
    });
  };

  render() {
    const tabList = [
      {
        key: 'order',
        tab: '订货单',
      },
      {
        key: 'apply',
        tab: '申请医院',
      },
    ];
    const extraContent = () => {
      const {
        loadHospital,
        loadDepartment,
        orderForm: { done },
        dispatch,
      } = this.props;
      return (
        <div className={styles.title}>
          <div>医院订货单</div>
          <div>
            <ApplyHospital
              onOk={this.applyHospitalHandler}
              done={done}
              loading={loadHospital}
              dispatch={dispatch}
            >
              <Button type="primary" style={{ marginRight: '20px' }}>
                申请医院
              </Button>
            </ApplyHospital>
            <ApplyDepartment
              onOk={this.applyDepartmentHandler}
              done={done}
              loading={loadDepartment}
              dispatch={dispatch}
            >
              <Button type="primary">申请科室</Button>
            </ApplyDepartment>
          </div>
        </div>
      );
    };

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        title={extraContent()}
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default OrderForm;
