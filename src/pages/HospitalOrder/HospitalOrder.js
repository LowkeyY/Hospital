import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Department from '../../components/Lowkey/Department';
import styles from './HospitalOrder.less';

@connect(({ hospitalOrder }) => ({
  hospitalOrder,
}))
class HospitalOrder extends Component {
  componentDidMount() {
    const deptType = localStorage.getItem('deptType');
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    if (deptType !== '2' || deptId !== '') {
      dispatch({
        type: 'hospitalOrder/fetchCount',
        payload: {
          deptId,
        },
      });
      dispatch({
        type: 'hospitalOrder/fetchEarlyCount',
        payload: {
          deptId,
          pageSize: 10,
          nowPage: 1,
        },
      });
    }
  }

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
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-ordering',
        query: {
          deptId,
        },
      })
    );
  };

  handlerQuickOrderingClick = () => {
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-quickordering',
        query: {
          deptId,
        },
      })
    );
  };

  handlerDisposeClick = () => {
    const {
      dispatch,
      hospitalOrder: { deptId },
    } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/backstage/hospital-dispose',
        query: {
          deptId,
        },
      })
    );
  };

  hanlerSelect = val => {
    let route = 'fetchInventory';
    const {
      dispatch,
      location: { pathname = '' },
    } = this.props;
    dispatch({
      type: 'hospitalOrder/updateState',
      payload: {
        deptId: val,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchCount',
      payload: {
        deptId: val,
      },
    });
    dispatch({
      type: 'hospitalOrder/fetchEarlyCount',
      payload: {
        deptId: val,
        nowPage: 1,
        pageSize: 10,
      },
    });
    if (pathname === '/backstage/hospital-order/Shortage') {
      route = 'fetchShortage';
    }
    if (pathname === '/backstage/hospital-order/early-warning') {
      route = 'fetchEarlyWarning';
    }
    if (pathname === '/backstage/hospital-order/overdue') {
      route = 'fetchOverdue';
    }

    dispatch({
      type: `hospitalOrder/${route}`,
      payload: {
        nowPage: 1,
        pageSize: 10,
        deptId: val,
      },
    });
    dispatch({
      type: 'global/getSupplier',
      payload: { deptId: val },
    });
  };

  getTabList = () => {
    const {
      hospitalOrder: { count, earlyCount, hasButton },
    } = this.props;
    if (!hasButton) {
      return [
        {
          key: 'Shortage',
          tab: '缺货清单',
          count,
        },
      ];
    }
    return [
      {
        key: 'inventory',
        tab: '库存清单',
        count: 0,
      },
      {
        key: 'Shortage',
        tab: '缺货清单',
        count,
      },
      {
        key: 'early-warning',
        tab: '效期预警',
        count: earlyCount,
      },
      {
        key: 'overdue',
        tab: '过期报损',
        count: 0,
      },
    ];
  };

  render() {
    const extraContent = deptType => {
      const {
        hospitalOrder: { deptId },
      } = this.props;
      return (
        <div className={styles.buttons}>
          <div>
            <Button
              type="primary"
              style={{ marginRight: '20px' }}
              onClick={this.handlerQuickOrderingClick}
              disabled={deptType === '2' && deptId === ''}
            >
              一键补货
            </Button>
            <Button
              type="primary"
              style={{ marginRight: '20px' }}
              onClick={this.handlerOrderingClick}
              disabled={deptType === '2' && deptId === ''}
            >
              订货
            </Button>
          </div>
          {/*{*/}
          {/*hasButton ?*/}
          {/*<div className={styles.dispose}>*/}
          {/*<Button*/}
          {/*type="primary"*/}
          {/*onClick={this.handlerDisposeClick}*/}
          {/*disabled={deptType === '2' && deptId === ''}*/}
          {/*>*/}
          {/*库存配置*/}
          {/*</Button>*/}
          {/*</div>*/}
          {/*:*/}
          {/*null*/}
          {/*}*/}
          <div className={styles.dispose}>
            <Button
              type="primary"
              onClick={this.handlerDisposeClick}
              disabled={deptType === '2' && deptId === ''}
            >
              库存配置
            </Button>
          </div>
        </div>
      );
    };

    const {
      match,
      children,
      location,
      hospitalOrder: { deptId },
    } = this.props;
    const deptType = localStorage.getItem('deptType');
    return (
      <PageHeaderWrapper
        title={extraContent(deptType)}
        content={
          deptType === '2' ? <Department deptId={deptId} onSelect={this.hanlerSelect} /> : null
        }
        tabList={this.getTabList()}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default HospitalOrder;
