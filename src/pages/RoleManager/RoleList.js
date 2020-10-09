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
//v1.4.0 权限控制
import Authorized from '@/utils/Authorized';

import styles from './RoleList.less';

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

//添加，修改角色Form
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
      title={addOrUpdateDataFlag == 1 ? '新建角色' : '修改角色'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          initialValue: formVals.name,
          rules: [{ required: true, message: '请输入最多32个字符的角色名称！', max: 32 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色编码">
        {form.getFieldDecorator('code', {
          initialValue: formVals.code,
          rules: [{ required: true, message: '请输入最多100个字符的角色编码！', max: 100 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {form.getFieldDecorator('status', {
          initialValue: formVals.status,
          rules: [{ required: true, message: '请选择' }],
        })(
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('note', {
          initialValue: formVals.note,
          rules: [{ required: false, message: '请输入最多200个字符的角色描述！', max: 200 }],
        })(<TextArea placeholder="描述" rows={2} />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ rolemanager, loading }) => ({
  rolemanager,
  loading: loading.models.rolemanager,
}))
@Form.create()
class RoleList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    //v1.4.0 更新角色的数据
    updateRoleData: {},
    //v1.4.0 添加或者修改角色的标识，1：添加，2：修改
    addOrUpdateDataFlag: null,
  };

  columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
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
      ellipsis: true,
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
    if (record && record.status == 1) {
      return (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleStatusModel(0, record)}>禁用</a>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleStatusModel(1, record)}>启用</a>
        </Fragment>
      );
    }
  };

  componentDidMount() {
    console.log('init');
    const { dispatch } = this.props;
    dispatch({
      type: 'rolemanager/fetch',
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
      type: 'rolemanager/fetch',
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
      type: 'rolemanager/fetch',
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
        type: 'rolemanager/fetch',
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

  //v1.4.0 ‘新建’按钮显示弹窗
  handleModalVisible = flag => {
    this.setState({
      //v1.4.0 控制是否展示添加修改角色的弹窗
      modalVisible: !!flag,
      //v1.4.0 重置角色数据
      updateRoleData: {
        //v1.4.0 初始化状态数据，默认选中启用
        status: 1,
      },
      addOrUpdateDataFlag: 1,
    });
  };

  //v1.4.0 ‘修改’按钮显示弹窗
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      //v1.4.0 控制是否展示添加修改角色的弹窗
      modalVisible: !!flag,
      //v1.4.0 修改的角色数据
      updateRoleData: record || {},
      addOrUpdateDataFlag: 2,
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
      content: `确定${statusMsg}【${record.name}】这个角色吗？`,
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
      type: 'rolemanager/updateStatus',
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
          message.success('角色【' + record.name + '】启用成功！');
        } else if (status == 0) {
          message.success('角色【' + record.name + '】禁用成功！');
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
      content: `确定${statusMsg}这${selectedRows.length}个角色吗？`,
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
      type: 'rolemanager/updateStatus',
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

  //v1.4.0 添加角色
  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolemanager/add',
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
        message.success('角色【' + record.name + '】添加成功！');
      },
    });
  };

  //v1.4.0 修改角色
  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolemanager/update',
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
        message.success('角色【' + record.name + '】修改成功！');
      },
    });
  };

  //v1.4.0 消息提示
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
          <Col md={6} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="角色编码">
              {getFieldDecorator('code')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
            <FormItem label="角色名称">
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
      rolemanager: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      updateRoleData,
      addOrUpdateDataFlag,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="batchEnableStatus">批量启用</Menu.Item>
        <Menu.Item key="batchDisableStatus">批量禁用</Menu.Item>
        {/*<Menu.Item key="batchDel">批量删除</Menu.Item>*/}
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
      /*v1.3.0 权限控制*/
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
          formVals={updateRoleData}
          addOrUpdateDataFlag={addOrUpdateDataFlag}
        />
      </Authorized>
    );
  }
}

export default RoleList;
