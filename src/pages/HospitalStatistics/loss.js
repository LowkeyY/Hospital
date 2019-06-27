import React, { Component } from 'react';
import { Card, Tabs, Statistic, Empty } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ loading, hospitalStatistics }) => ({
  hospitalStatistics,
  loading: loading.effects['hospitalStatistics/queryTwoYear'],
}))
class Loss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectKey: '1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'hospitalStatistics/queryTwoYear' });
    dispatch({ type: 'hospitalStatistics/queryThreeYear' });
  }

  getExtra = (key = '1') => {
    const {
      hospitalStatistics: { towYearTotal, threeYearTotal },
    } = this.props;
    const now = new Date();
    const year = now.getFullYear() - (key === '1' ? 1 : 2);
    const passed = moment(`${year}-01-01`).format('YYYY-MM-DD');
    const nowTime = moment(now).format('YYYY-MM-DD');
    return (
      <div className={styles.Extra}>
        <div>报表统计——过期报损报表</div>
        <Statistic
          title={`${passed}至${nowTime}`}
          value={` 总金额：${key === '1' ? towYearTotal : threeYearTotal}`}
        />
      </div>
    );
  };

  handlerTabChange = key => {
    this.setState({
      selectKey: key,
    });
  };

  render() {
    const {
      hospitalStatistics: { towYearDate, threeYearDate, depts },
      loading,
    } = this.props;

    const ds = new DataSet();
    const towYear = ds.createView().source(towYearDate);
    towYear.transform({
      type: 'fold',
      fields: depts,
      // 展开字段集
      key: '年份',
      // key字段
      value: '部门金额', // value字段
    });
    const threeYear = ds.createView().source(threeYearDate);
    threeYear.transform({
      type: 'fold',
      fields: depts,
      // 展开字段集
      key: '年份',
      // key字段
      value: '部门金额', // value字段
    });
    return (
      <PageHeaderWrapper title={this.getExtra(this.state.selectKey)}>
        <div className={styles.container}>
          <Card
            loading={loading}
            bordered={false}
            bodyStyle={{ padding: '10px', minHeight: '300px' }}
          >
            <Tabs size="large" tabBarStyle={{ marginBottom: 24 }} onChange={this.handlerTabChange}>
              <TabPane tab="近二年" key="1">
                {towYearDate && towYearDate.length < 0 ? (
                  <Empty />
                ) : (
                  <Chart height={400} data={towYear} forceFit>
                    <Axis name="年份" />
                    <Axis name="部门金额" />
                    <Legend />
                    <Tooltip
                      crosshairs={{
                        type: 'y',
                      }}
                    />
                    <Geom
                      type="interval"
                      position="年份*部门金额"
                      color="name"
                      adjust={[
                        {
                          type: 'dodge',
                          marginRatio: 1 / 32,
                        },
                      ]}
                    />
                  </Chart>
                )}
              </TabPane>
              <TabPane tab="近三年" key="2">
                {threeYearDate && threeYearDate.length < 1 ? (
                  <Empty />
                ) : (
                  <Chart height={400} data={threeYear} forceFit>
                    <Axis name="年份" />
                    <Axis name="部门金额" />
                    <Legend />
                    <Tooltip
                      crosshairs={{
                        type: 'y',
                      }}
                    />
                    <Geom
                      type="interval"
                      position="年份*部门金额"
                      color="name"
                      adjust={[
                        {
                          type: 'dodge',
                          marginRatio: 1 / 32,
                        },
                      ]}
                    />
                  </Chart>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Loss;
