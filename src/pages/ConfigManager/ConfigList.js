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
  notification,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
//v1.7.0 权限控制
import Authorized from '@/utils/Authorized';

import styles from './ConfigList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const configTypeMap = ['10', '20', '30', '40'];
const configType = ['缓存生效', '缓存失效', '限流', 'Token'];

//添加，修改Form
const AddUpdateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleUpdate,
    handleModalVisible,
    formVals,
    addOrUpdateDataFlag,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      //添加
      if (addOrUpdateDataFlag == 1) {
        handleAdd(fieldsValue, form);
      }
      //修改
      else if (addOrUpdateDataFlag == 2) {
        const updateValues = {
          id: formVals.id,
          ...fieldsValue,
        };
        handleUpdate(updateValues, form);
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      title={addOrUpdateDataFlag == 1 ? '新建配置' : '修改配置'}
      visible={modalVisible}
      width={640}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务名">
        {form.getFieldDecorator('serviceName', {
          initialValue: formVals.serviceName,
          rules: [{ required: true, message: '请输入最多100个字符的服务名！', max: 100 }],
        })(<Input placeholder="" autocomplete="off" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="配置类型">
        {form.getFieldDecorator('configType', {
          initialValue: formVals.configType,
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select placeholder="" style={{ width: '30%' }}>
            <Option value={10}>{configType[0]}</Option>
            <Option value={20}>{configType[1]}</Option>
            <Option value={30}>{configType[2]}</Option>
            <Option value={40}>{configType[3]}</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="配置Key">
        {form.getFieldDecorator('configKey', {
          initialValue: formVals.configKey,
          rules: [{ required: true, message: '请输入最多100个字符的配置Key！', max: 100 }],
        })(<Input placeholder="" autocomplete="off" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Key名称">
        {form.getFieldDecorator('keyName', {
          initialValue: formVals.keyName,
          rules: [{ required: true, message: '请输入最多100个字符的Key名称！', max: 100 }],
        })(<Input placeholder="" autocomplete="off" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="配置内容">
        {form.getFieldDecorator('content', {
          initialValue: formVals.content,
          rules: [{ required: true, message: '请输入最多200个字符的配置内容！' }],
        })(<TextArea placeholder="配置内容(JSON格式)" rows={3} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('note', {
          initialValue: formVals.note,
          rules: [{ required: false, message: '请输入最多300个字符的备注！', max: 300 }],
        })(<TextArea placeholder="备注" rows={2} />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ configmanager, loading }) => ({
  configmanager,
  loading: loading.models.configmanager,
}))
@Form.create()
class ConfigList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    //v1.7.0 更新的数据
    updateData: {},
    //v1.7.0 添加或者修改的标识，1：添加，2：修改
    addOrUpdateDataFlag: null,
  };

  columns = [
    {
      title: '服务名',
      dataIndex: 'serviceName',
      ellipsis: true,
    },
    {
      title: '配置类型',
      dataIndex: 'configType',
      ellipsis: true,
      width: 120,
      filters: [
        {
          text: configType[0],
          value: 10,
        },
        {
          text: configType[1],
          value: 20,
        },
        {
          text: configType[2],
          value: 30,
        },
        {
          text: configType[3],
          value: 40,
        },
      ],
      render(val) {
        if (val == 10) {
          return configType[0];
        } else if (val == 20) {
          return configType[1];
        } else if (val == 30) {
          return configType[2];
        } else if (val == 40) {
          return configType[3];
        } else {
          return '未知';
        }
      },
    },
    {
      title: '配置Key',
      dataIndex: 'configKey',
      ellipsis: true,
    },
    {
      title: 'Key名称',
      dataIndex: 'keyName',
      ellipsis: true,
    },
    {
      title: '备注',
      //dataIndex: 'note',
      ellipsis: true,
      render: (text, record) => {
        return record.note || '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'creater',
      ellipsis: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      ellipsis: true,
    },
    {
      title: '修改人',
      dataIndex: 'updater',
      ellipsis: true,
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
    return (
      <Fragment>
        <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
        <Divider type="vertical" />
        <a onClick={() => this.handleDelModel(record)} style={{color:"red"}}>删除</a>
      </Fragment>
    );
  };

  componentDidMount() {
    console.log('init');
    const { dispatch } = this.props;
    dispatch({
      type: 'configmanager/fetch',
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
      },
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
      type: 'configmanager/fetch',
      payload: params,
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
      },
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
      type: 'configmanager/fetch',
      payload: {},
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
      },
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
        this.handleBatchDelModel();
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
        type: 'configmanager/fetch',
        payload: values,
        callback: response => {
          //错误提示信息
          let flag = this.tipMsg(response);
          if (!flag) {
            return;
          }
        },
      });
    });
  };

  //v1.7.0 ‘新建’按钮显示弹窗
  handleModalVisible = flag => {
    this.setState({
      //v1.7.0 控制是否展示添加修改配置的弹窗
      modalVisible: !!flag,
      //v1.7.0 重置配置数据
      updateData: {
        //v1.7.0 初始化状态数据，默认选中启用
        status: 1,
      },
      addOrUpdateDataFlag: 1,
    });
  };

  //v1.7.0 ‘修改’按钮显示弹窗
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      //v1.7.0 控制是否展示添加修改配置的弹窗
      modalVisible: !!flag,
      //v1.7.0 修改的配置数据
      updateData: record || {},
      addOrUpdateDataFlag: 2,
    });
  };

  //启用、禁用弹窗 v1.7.0
  handleStatusModel = (status, record) => {
    let statusMsg = '';
    if (status == 1) {
      statusMsg = '启用';
    } else {
      statusMsg = '禁用';
    }

    Modal.confirm({
      title: statusMsg,
      content: `确定${statusMsg}【${record.configKey}】这个配置吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleStatus(status, record),
    });
  };

  //启用、禁用 v1.7.0
  handleStatus = (status, record) => {
    const { dispatch } = this.props;
    const ids = [];
    ids.push(record.id);
    dispatch({
      type: 'configmanager/updateStatus',
      payload: {
        ids: ids,
        status: status,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        if (status == 1) {
          message.success('配置【' + record.configKey + '】启用成功！');
        } else if (status == 0) {
          message.success('配置【' + record.configKey + '】禁用成功！');
        }
        this.handleSearch();
      },
    });
  };

  //批量启用、禁用弹窗 v1.7.0
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
      content: `确定${statusMsg}这${selectedRows.length}个配置吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleBatchStatus(status),
    });
  };

  //批量启用、禁用 v1.7.0
  handleBatchStatus = status => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'configmanager/updateStatus',
      payload: {
        ids: selectedRows.map(row => row.id),
        status: status,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
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

  //删除弹窗 v1.7.0
  handleDelModel = (record) => {
    let statusMsg = '删除';
    Modal.confirm({
      title: statusMsg,
      content: `确定${statusMsg}【${record.configKey}】这个配置吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDel(record),
    });
  };

  //删除 v1.7.0
  handleDel = (record) => {
    const { dispatch } = this.props;
    const ids = [];
    ids.push(record.id);
    dispatch({
      type: 'configmanager/remove',
      payload: {
        ids: ids,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        message.success('配置【' + record.configKey + '】删除成功！');
        this.handleSearch();
      },
    });
  };

  //批量删除弹窗 v1.7.0
  handleBatchDelModel = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;

    let msg = '删除';

    Modal.confirm({
      title: '批量' + msg,
      content: `确定${msg}这${selectedRows.length}个配置吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleBatchDel(),
    });
  };

  //批量删除 v1.7.0
  handleBatchDel = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'configmanager/remove',
      payload: {
        ids: selectedRows.map(row => row.id),
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        this.setState({
          selectedRows: [],
        });
        message.success('批量删除成功！');
        this.handleSearch();
      },
    });
  };

  //v1.7.0 添加
  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configmanager/add',
      payload: {
        ...fields,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        //重置表单
        form.resetFields();
        //关闭弹窗
        this.handleModalVisible();
        //查询数据
        this.handleSearch();
        message.success('配置【' + fields.configKey + '】添加成功！');
      },
    });
  };

  //v1.7.0 修改
  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configmanager/update',
      payload: {
        ...fields,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        //重置表单
        form.resetFields();
        //关闭弹窗
        this.handleUpdateModalVisible();
        //查询数据
        this.handleSearch();
        message.success('配置【' + fields.configKey + '】修改成功！');
      },
    });
  };

  //v1.7.0 消息提示
  tipMsg = response => {
    let flag = false;
    let notifyType = 'warning';
    let msg = '操作失败! ';
    let showTime = 4.5;
    if (response && response.code == '200') {
      flag = true;
      return flag;
    } else if (response && response.msg && response.msg != '') {
      msg = msg + response.msg;
      showTime = 10;
      notification[notifyType]({
        message: '提示信息',
        description: msg,
        duration: showTime,
      });
    }
    return flag;
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xxl={3} xl={5} lg={6} md={6} sm={10} xs={10} style={{ paddingLeft: '24px' }}>
            <FormItem label="服务名">
              {getFieldDecorator('serviceName')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col xxl={3} xl={5} lg={6} md={6} sm={10} xs={10} style={{ paddingLeft: '0px' }}>
            <FormItem label="配置Key">
              {getFieldDecorator('configKey')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col xxl={3} xl={5} lg={6} md={6} sm={10} xs={10} style={{ paddingLeft: '0px' }}>
            <FormItem label="Key名称">
              {getFieldDecorator('keyName')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col xxl={3} xl={4} lg={5} md={5} sm={7} xs={7} style={{ paddingLeft: '0px' }}>
            <FormItem label="配置类型">
              {getFieldDecorator('configType')(
                <Select placeholder="" style={{ width: '100%' }}>
                  <Option value="10">{configType[0]}</Option>
                  <Option value="20">{configType[1]}</Option>
                  <Option value="30">{configType[2]}</Option>
                  <Option value="40">{configType[3]}</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={3} xl={4} lg={5} md={5} sm={7} xs={7} style={{ paddingLeft: '0px' }}>
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
            <FormItem label="配置名称">
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
      configmanager: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      updateData,
      addOrUpdateDataFlag,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        {/*<Menu.Item key="batchEnableStatus">批量启用</Menu.Item>
        <Menu.Item key="batchDisableStatus">批量禁用</Menu.Item>*/}
        <Menu.Item key="batchDel">批量删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      /*v1.7.0 权限控制*/
      <Authorized authority={['superadmin']}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
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

        <AddUpdateForm
          {...parentMethods}
          modalVisible={modalVisible}
          formVals={updateData}
          addOrUpdateDataFlag={addOrUpdateDataFlag}
        />
      </Authorized>
    );
  }
}

export default ConfigList;
