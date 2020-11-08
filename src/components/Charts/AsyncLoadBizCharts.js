import React from 'react';
import PageLoading from '../PageLoading';
import { importCDN } from '@/utils/utils';

let isLoaderBizChart = false;
const loadBizCharts = async () => {
  if (isLoaderBizChart) {
    return Promise.resolve(true);
  }
  const hostUrl = window.location.protocol + '//' + window.location.host;
  await Promise.all([
    //v1.5.0 加载本地的BizCharts和data-set.min.js；其中BizCharts和data-set.min.js要放在public/js/中
    importCDN(hostUrl + '/js/BizCharts.min.js'),
    importCDN(hostUrl + '/js/data-set.min.js'),
    //importCDN('//gw.alipayobjects.com/os/lib/bizcharts/3.4.3/umd/BizCharts.min.js'),
    //importCDN('//gw.alipayobjects.com/os/lib/antv/data-set/0.10.1/dist/data-set.min.js'),
  ]);
  // eslint-disable-next-line no-console
  console.log('bizCharts load success');
  isLoaderBizChart = true;
  return Promise.resolve(true);
};

class AsyncLoadBizCharts extends React.Component {
  state = {
    loading: !isLoaderBizChart,
  };

  async componentDidMount() {
    await loadBizCharts();
    requestAnimationFrame(() => {
      this.setState({
        loading: false,
      });
    });
  }

  render() {
    const { children } = this.props;
    const { loading } = this.state;
    if (!loading) {
      return children;
    }
    return <PageLoading />;
  }
}

export { loadBizCharts, AsyncLoadBizCharts };
