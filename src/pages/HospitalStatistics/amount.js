import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Statistic, Empty } from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import SearchForm from './components/SearchForm';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const cols = {
  sales: {
    tickInterval: 1000,
  },
};

@connect(({ loading, hospitalStatistics }) => ({
  hospitalStatistics,
  loading: loading.effects['hospitalStatistics/queryAmount'],
}))
@Form.create()
class Amount extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'hospitalStatistics/queryAmount' });
  }

  hanlerReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hospitalStatistics/queryAmount',
    });
  };

  handlerSearch = values => {
    const { dispatch } = this.props;
    const { beginDate = '', endDate = '' } = values;
    const res = {
      beginDate: beginDate === '' ? undefined : beginDate,
      endDate: endDate === '' ? undefined : endDate,
    };
    dispatch({
      type: 'hospitalStatistics/queryAmount',
      payload: {
        ...res,
      },
    });
  };

  getExtra = () => {
    const {
      hospitalStatistics: { amountTotal = '' },
    } = this.props;
    return (
      <div className={styles.Extra}>
        <div>报表统计---采购清单报表</div>
        <Statistic title="总金额(元)" value={amountTotal} />
      </div>
    );
  };

  render() {
    const {
      hospitalStatistics: { amountData },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper title={this.getExtra()}>
        <div className={styles.tableForm}>
          <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset} />
        </div>
        <div className={styles.container}>
          <Card loading={loading} bordered={false} bodyStyle={{ padding: 0, minHeight: '300px' }}>
            {amountData && amountData.length < 1 ? (
              <Empty />
            ) : (
              <Chart height={400} data={amountData} scale={cols} forceFit>
                <Axis name="dept" />
                <Axis name="金额" />
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Geom type="interval" position="dept*金额" />
              </Chart>
            )}
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Amount;
