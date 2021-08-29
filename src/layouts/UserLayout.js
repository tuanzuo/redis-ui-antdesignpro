import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon, Avatar } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import getPageTitle from '@/utils/getPageTitle';

const links = [
  {
    key: 'RedisManger',
    //title: <Icon type="github" />,
    //---gitee---
    //stars：https://gitee.com/tuanzuo/redismanager/badge/star.svg
    //forks：https://gitee.com/tuanzuo/redismanager/badge/fork.svg
    //---github---
    //stars：https://img.shields.io/github/stars/tuanzuo/redismanager?style=flat-square&logo=GitHub
    //forks：https://img.shields.io/github/forks/tuanzuo/redismanager?style=flat-square&logo=GitHub
    //watchers：https://img.shields.io/github/watchers/tuanzuo/redismanager?style=flat-square&logo=GitHub
    //issues：https://img.shields.io/github/issues/tuanzuo/redismanager.svg?style=flat-square&logo=GitHub
    //license：https://img.shields.io/github/license/tuanzuo/redismanager.svg?style=flat-square
    //图片加载失败了就用默认的icon v1.7.0
    title: <Avatar style={{borderRadius:5,height:'5%',width:'3.3%',background:'rgb(255 255 255 / 0%)'}} shape="square" src="https://img.shields.io/github/stars/tuanzuo/redismanager?style=flat-square&logo=GitHub" icon={<Icon type="github" style={{color:"rgb(132 133 135)"}} /> }  />,
    href: 'https://github.com/tuanzuo/redismanager',
    blankTarget: true,
  },
  {
    key: 'RedisMangerUI',
    //title: <Icon type="github" />,
    //图片加载失败了就用默认的icon v1.7.0
    title: <Avatar style={{borderRadius:5,height:'5%',width:'3.3%',background:'rgb(255 255 255 / 0%)'}} shape="square" src="https://img.shields.io/github/stars/tuanzuo/redis-ui-antdesignpro?style=flat-square&logo=GitHub" icon={<Icon type="github" style={{color:"rgb(132 133 135)"}} /> }  />,
    href: 'https://github.com/tuanzuo/redis-ui-antdesignpro',
    blankTarget: true,
  },
  {
    key: 'Ant Design Pro',
    title: 'Ant Design Pro',
    href: 'https://pro.ant.design',
    blankTarget: true,
  },
  {
    key: 'Ant Design Pro',
    title: <Icon type="github" />,
    href: 'https://github.com/ant-design/ant-design-pro',
    blankTarget: true,
  },
  {
    key: 'Ant Design',
    title: 'Ant Design',
    href: 'https://ant.design',
    blankTarget: true,
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019-{new Date().getFullYear()} tuanzuo
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Redis Manager</span>
                </Link>
              </div>
              <div className={styles.desc}>
                Redis单机和集群下数据的查询，添加，修改，删除；支持自定义key，value的序列化方式
              </div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
