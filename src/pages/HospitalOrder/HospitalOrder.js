import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './HospitalOrder.less';

@connect(({ hospitalOrder, loading }) => ({
  hospitalOrder,
  loadHospital: loading.effects['orderForm/applyHospital'],
  loadDepartment: loading.effects['orderForm/applyDepartment'],
}))
class HospitalOrder extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'inventory':
        router.push(`${match.url}/inventory`);
        break;
      case 'early-warning':
        router.push(`${match.url}/early-warning`);
        break;
      case 'Shortage':
        router.push(`${match.url}/Shortage`);
        break;
      case 'overdue':
        router.push(`${match.url}/overdue`);
        break;
      default:
        break;
    }
  };

  handlerOrderingClick = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-ordering',
      })
    );
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
        key: 'inventory',
        tab: '库存清单',
      },
      {
        key: 'Shortage',
        tab: '缺货清单',
      },
      {
        key: 'early-warning',
        tab: '预警清单',
      },
      {
        key: 'overdue',
        tab: '过期清单',
      },
    ];
    const extraContent = () => {
      return (
        <div>
          <Button type="primary" style={{ marginRight: '20px' }}>
            一键补货
          </Button>
          <Button type="primary" onClick={this.handlerOrderingClick}>
            订货
          </Button>
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

export default HospitalOrder;
