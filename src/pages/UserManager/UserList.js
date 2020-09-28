import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  BackTop,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
//v1.4.0 权限控制
import Authorized from '@/utils/Authorized';

import styles from './UserList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['0', '1'];
const status = ['禁用', '启用'];

/* eslint react/no-multi-comp:0 */
@connect(({ usermanager, loading }) => ({
  usermanager,
  loading: loading.models.usermanager,
}))
@Form.create()
class UserList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 75,
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '描述',
      dataIndex: 'note',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      dataIndex: 'creater',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
    },
    {
      title: '修改人',
      dataIndex: 'updater',
    },
    {
      title: '操作',
      width: 135,
      render: (text, record) => {
        return this.getOptHtml(record);
      },
    },
  ];

  getOptHtml = record => {
    if (record && record.status == 1) {
      return (
        <Fragment>
          <a onClick={() => this.handleStatusModel(0, record)}>禁用</a>
          <Divider type="vertical" />
          <a onClick={() => this.resetPwdModel(record)}>重置密码</a>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <a onClick={() => this.handleStatusModel(1, record)}>启用</a>
          <Divider type="vertical" />
          <a onClick={() => this.resetPwdModel(record)}>重置密码</a>
        </Fragment>
      );
    }
  };

  componentDidMount() {
    console.log('init');
    const { dispatch } = this.props;
    dispatch({
      type: 'usermanager/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    console.log('change');
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'usermanager/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'usermanager/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'batchEnableStatus':
        this.handleBatchStatusModel(1);
        break;
      case 'batchDisableStatus':
        this.handleBatchStatusModel(0);
        break;
      case 'batchDel':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'usermanager/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  //重置密码弹窗 v1.4.0
  resetPwdModel = record => {
    Modal.confirm({
      title: '重置密码',
      content: `确定重置【${
        record.name
      }】这个用户的密码吗？备注：重置后的默认密码为123456，请提示用户登录后及时修改默认密码。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.resetPwd(record),
    });
  };

  //重置密码 v1.4.0
  resetPwd = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usermanager/resetPwd',
      payload: {
        id: record.id,
      },
      callback: () => {
        this.handleSearch();
        message.success('用户【' + record.name + '】重置密码成功！');
      },
    });
  };

  //启用、禁用弹窗 v1.4.0
  handleStatusModel = (status, record) => {
    let statusMsg = '';
    if (status == 1) {
      statusMsg = '启用';
    } else {
      statusMsg = '禁用';
    }

    Modal.confirm({
      title: statusMsg,
      content: `确定${statusMsg}【${record.name}】这个用户吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleStatus(status, record),
    });
  };

  //启用、禁用 v1.4.0
  handleStatus = (status, record) => {
    const { dispatch } = this.props;
    const ids = [];
    ids.push(record.id);
    dispatch({
      type: 'usermanager/updateStatus',
      payload: {
        ids: ids,
        status: status,
      },
      callback: () => {
        if (status == 1) {
          message.success('用户【' + record.name + '】启用成功！');
        } else if (status == 0) {
          message.success('用户【' + record.name + '】禁用成功！');
        }
        this.handleSearch();
      },
    });
  };

  //批量启用、禁用弹窗 v1.4.0
  handleBatchStatusModel = status => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;

    let statusMsg = '';
    if (status == 1) {
      statusMsg = '启用';
    } else {
      statusMsg = '禁用';
    }

    Modal.confirm({
      title: '批量' + statusMsg,
      content: `确定${statusMsg}这${selectedRows.length}个用户吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleBatchStatus(status),
    });
  };

  //批量启用、禁用 v1.4.0
  handleBatchStatus = status => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'usermanager/updateStatus',
      payload: {
        ids: selectedRows.map(row => row.id),
        status: status,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        if (status == 1) {
          message.success('批量启用成功！');
        } else if (status == 0) {
          message.success('批量禁用成功！');
        }
        this.handleSearch();
      },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/*<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>*/}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      usermanager: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="batchEnableStatus">批量启用</Menu.Item>
        <Menu.Item key="batchDisableStatus">批量禁用</Menu.Item>
        {/*<Menu.Item key="batchDel">批量删除</Menu.Item>*/}
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      /*v1.3.0 权限控制*/
      <Authorized authority={['superadmin']}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/*<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>*/}
              {selectedRows.length > 0 && (
                <span>
                  {/*<Button>批量启用</Button>*/}
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            {/*返回顶部*/}
            <BackTop />
          </div>
        </Card>
      </Authorized>
    );
  }
}

export default UserList;
