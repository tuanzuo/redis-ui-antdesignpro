import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// JSON显示器:https://ant.design/docs/react/recommendation-cn
// https://github.com/mac-s-g/react-json-view
import ReactJson from 'react-json-view';
// JSON格式化显示：https://www.npmjs.com/package/react-json-pretty
import JSONPretty from 'react-json-pretty';

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
  Collapse,
  Tabs,
  Tag,
  Drawer,
  Spin,
  Typography,
} from 'antd';

import { EditOutlined,PlusOutlined,DeleteOutlined } from '@ant-design/icons';

import styles from './InterfaceList.less';

//v1.7.1 权限控制
import Authorized from '@/utils/Authorized';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Paragraph } = Typography;

const colorArray = ['magenta','red','volcano','orange','gold','green','cyan','blue','geekblue','purple'];
const headers = "headers";
const body = "body";
const params = "params";
const cookies = "cookies";
let requestObject = {};

const text = "test";

//添加，修改接口分类Form
const AddUpdateCategoryForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleUpdate,
    handleModalVisibleToCategory,
    formVals,
    addOrUpdateDataFlag,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      //添加
      if (addOrUpdateDataFlag == 'add') {
        handleAdd(fieldsValue, form);
      }
      //修改
      else if (addOrUpdateDataFlag == 'update') {
        const updateValues = {
          id: formVals.id,
          category: formVals.category,
          ...fieldsValue,
        };
        handleUpdate(updateValues, form);
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      title={addOrUpdateDataFlag == 1 ? '新建分类' : '修改分类'}
      visible={modalVisible}
      width={640}
      onOk={okHandle}
      onCancel={() => handleModalVisibleToCategory(false)}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称：">
        {form.getFieldDecorator('configName', {
          initialValue: formVals.configName,
          rules: [{ required: true, message: '请输入最多200个字符！', max: 200 }],
        })(<Input placeholder="" autocomplete="off" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序：">
        {form.getFieldDecorator('sort', {
          initialValue: formVals.sort,
          rules: [{ required: true, message: '请输入', }],
        })(
          <InputNumber
            min={1}
            placeholder="请输入"
            style={{ width: '100%' }}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注：">
        {form.getFieldDecorator('note', {
          initialValue: formVals.note,
          rules: [{ required: false, message: '请输入最多300个字符的备注！', max: 300 }],
        })(<TextArea placeholder="备注" rows={2} />)}
      </FormItem>
    </Modal>
  );
});

//添加，修改接口Form
const AddUpdateInterfaceForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleAdd,
    handleUpdate,
    handleDel,
    handleDelModel,
    handleModalVisible,
    handleSend,
    getReactJsonHtml,
    getReactJsonHtmlToInterface,
    formVals,
    formResultVals,
    handleRestToformVals,
  } = props;

  const okHandle = (flag) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //send
      if ('send' == flag) {
        let values = {
          headers: requestObject.headers || '{}',
          body: requestObject.body || '{}',
          params: requestObject.params || '{}',
          cookies: requestObject.cookies || '{}',
          ...fieldsValue,
        };
        handleSend(values, form);
      }

      let configInfo = {
        requestType: fieldsValue.requestType,
        requestUrl: fieldsValue.requestUrl,
        headers: requestObject.headers || '{}',
        body: requestObject.body || '{}',
        params: requestObject.params || '{}',
        cookies: requestObject.cookies || '{}',
      };
      let values = {
        ...fieldsValue,
        category: 2,
        categoryName: fieldsValue.categoryName,
        configName: fieldsValue.requestName,
        requestUrl: fieldsValue.requestUrl,
        configInfo: JSON.stringify(configInfo),
      };
      if ('add' == flag) {
        handleAdd(values, form);
      }
      if ('update' == flag) {
        values.id = formVals.id;
        values.pid = formVals.pid;
        handleUpdate(values, form);
      }
      if ('del' == flag) {
        values.id = formVals.id;
        values.ifDel = 1;
        handleDelModel(values, form);
      }
    });
  };

  // 重置
  const handleFormReset = () => {
    form.resetFields();
    handleRestToformVals();
  };

  const delButtonHtml = (temp) =>{
    if(temp.optFlag && temp.optFlag=='update'){
      return (
        <Button onClick={() => okHandle('del')} type="danger" style={{ marginRight: 8 }} title={"删除"}>
          Delete
        </Button>
      )
    }
  };

  return (
    <Drawer title={'接口信息'}
            visible={modalVisible}
            width="calc(100vw - 15%)"
            onClose={() => handleModalVisible(false)}
            destroyOnClose={true}
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col lg={4} md={12} sm={24}>
            <Form.Item label={"分类名称："}>
              {form.getFieldDecorator('categoryName', {
                rules: [{ required: true, message: '请输入最多200个字符！', max: 200 }],
                initialValue: formVals.categoryName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col lg={2} md={12} sm={24}>
            <Form.Item label={"请求类型："}>
              {form.getFieldDecorator('requestType', {
                rules: [{ required: true, message: '请选择' }],
                initialValue: formVals.requestType,
              })(
                <Select placeholder="请选择">
                  <Option value="get">GET</Option>
                  <Option value="post">POST</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={"请求地址："}>
              {form.getFieldDecorator('requestUrl', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: formVals.requestUrl,
              })(<Input placeholder="请输入，例如：http://127.0.0.1/redis/config/list" />)}
            </Form.Item>
          </Col>
          <Col lg={4} md={12} sm={24}>
            <Form.Item label={"接口名称："}>
              {form.getFieldDecorator('requestName', {
                rules: [{ required: true, message: '请输入最多200个字符！', max: 200 }],
                initialValue: formVals.requestName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col lg={2} md={12} sm={24}>
            <Form.Item label={"接口排序："}>
              {form.getFieldDecorator('sort', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: formVals.sort,
              })(
                <InputNumber
                  min={1}
                  placeholder="请输入"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col lg={4} md={12} sm={24}>
            <Form.Item label={"执行"}>
              <Button onClick={()=> okHandle('send')} type="primary" style={{ marginRight: 8 }} title={"发送请求"}>
                send
              </Button>
              <Button onClick={()=> handleFormReset()} style={{ marginLeft: '2px' }} title={"重置"}>
                reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={headers + '：'} >
              {getReactJsonHtmlToInterface(headers, formVals.headers || {})}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={body + '：'} >
              {getReactJsonHtmlToInterface(body, formVals.body || {})}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={params + '：'} >
              {getReactJsonHtmlToInterface(params, formVals.params || {})}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={cookies + '：'} >
              {getReactJsonHtmlToInterface(cookies, formVals.cookies || {})}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={9} md={12} sm={24}>
            <Form.Item label={"返回结果："} className={styles.treeContainer}>
              <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                {formResultVals.result}
              </Paragraph>
            </Form.Item>
          </Col>
          <Col lg={15} md={12} sm={24} className={styles.treeContainer}>
            <Form.Item label={"返回结果(JSON)："}>
              {getReactJsonHtml(true, formResultVals.resultJson)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={()=> okHandle(formVals.optFlag)} type="primary" style={{ marginRight: 8 }} title={"保存"}>
          Save
        </Button>
        <Button onClick={() => handleModalVisible(false)} style={{ marginRight: 8 }} title={"关闭"}>
          Close
        </Button>
        {delButtonHtml(formVals)}
      </div>
    </Drawer>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ postman, loading }) => ({
  postman,
  loading: loading.models.postman,
}))
@Form.create()
class InterfaceList extends PureComponent {
  state = {
    modalVisible: false,
    //接口数据
    formValues: {},
    //接口返回值数据
    formResultValues: {},

    modalVisibleToCategory: false,
    formValuesToCategory: {},
    addOrUpdateDataFlagToCategory: null,
  };

  componentDidMount() {
    this.reloadData();
  }

  reloadData = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'postman/fetch',
      callback: response => {
        this.handleRestToformVals();
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
      },
    });
  };

  //显示弹窗
  handleModalVisible = (flag, optFlag, pdata, subdata) => {
    let data = {};
    data.optFlag = optFlag;

    let resultData = {};

    if (pdata) {
      data.categoryName = pdata.configName;
    }

    if (pdata && subdata) {
      data.id = subdata.id;
      data.pid = subdata.pid;
      data.categoryName = pdata.configName;
      data.requestName = subdata.configName;
      data.sort = subdata.sort;
      let configInfo = JSON.parse(subdata.configInfo);
      data.requestType = configInfo.requestType;
      data.requestUrl = configInfo.requestUrl;
      data.headers = JSON.parse(configInfo.headers);
      data.body = JSON.parse(configInfo.body);
      data.params = JSON.parse(configInfo.params);
      data.cookies = JSON.parse(configInfo.cookies);

      resultData.result = '';
      resultData.resultJson = JSON.parse('{}');

      requestObject.headers = configInfo.headers;
      requestObject.body = configInfo.body;
      requestObject.params = configInfo.params;
      requestObject.cookies = configInfo.cookies;
    }

    this.setState({
      //控制是否展示添加修改角色的弹窗
      modalVisible: !!flag,
      formValues: data,
      formResultValues: resultData,
    });
  };

  handleModalVisibleToCategory = (flag, optFlag, pdata, subdata) => {
    this.setState({
      //控制是否展示添加修改角色的弹窗
      modalVisibleToCategory: !!flag,
      formValuesToCategory: pdata || {},
      addOrUpdateDataFlagToCategory: optFlag,
    });
  };

  handleAdd = (fields, form) => {
    let data = fields;
    const { dispatch } = this.props;
    dispatch({
      type: 'postman/add',
      payload: {
        ...fields,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        this.handleModalVisible(false,"add");
        requestObject = {};
        this.reloadData();
      },
    });
  };

  handleUpdate = (fields, form) => {
    let data = fields;
    const { dispatch } = this.props;
    dispatch({
      type: 'postman/update',
      payload: {
        ...fields,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        this.handleModalVisible(false,"update");
        this.handleModalVisibleToCategory(false,"update");
        requestObject = {};
        this.reloadData();
      },
    });
  };

  handleDelModel = (values, form) => {
    Modal.confirm({
      title: '删除接口',
      content: `确定删除【${values.configName+'('+values.requestUrl+')'}】这个接口吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDel(values),
    });
  };

  handleDelCategoryModel = (values) => {
    Modal.confirm({
      title: '删除分类',
      content: `确定删除【${values.configName}】这个分类吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDel(values),
    });
  };

  handleDel = (values) =>{
    let fields = {
      id: values.id,
      category: values.category,
      configName: values.configName,
      ifDel: 1,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'postman/del',
      payload: {
        ...fields,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        this.handleModalVisible(false,"update");
        requestObject = {};
        this.reloadData();
      },
    });
  };

  handleSend = (fields, form) => {
    let data = fields;
    const { dispatch } = this.props;
    dispatch({
      type: 'postman/send',
      payload: {
        ...fields,
      },
      callback: response => {
        let resultValues = {};
        resultValues.result = JSON.stringify(response);
        resultValues.resultJson = JSON.parse(JSON.stringify(response));
        this.setState({
          formResultValues: resultValues
        });
      },
    });
  };

  handleRestToformVals = () => {
    this.setState({
      formValues: {},
      formResultValues: {},
    });
  };

  getReactJsonHtml = (keyValueIsJson, jsonValue) => {
    if (keyValueIsJson) {
      return (
        <ReactJson
          name={false}
          src={jsonValue}
          displayDataTypes={false}
          style={{borderRadius:3, wordBreak: "break-all"}}
          theme="monokai"
        />
      );
    }
  };

  getReactJsonHtmlToInterface = (type, jsonValue) => {
    return (
      <ReactJson
        name={false}
        src={jsonValue}
        displayDataTypes={false}
        onAdd={(temp) => this.handleReactJson(type, temp)}
        onEdit={(temp) => this.handleReactJson(type, temp)}
        onDelete={(temp) => this.handleReactJson(type, temp)}
        style={{borderRadius:3, wordBreak: "break-all"}}
        theme="monokai"
      />
    );
  };

  handleReactJson = (valueType, temp) => {
    switch (valueType) {
      case headers: {
        requestObject.headers = JSON.stringify(temp.updated_src);
        break;
      }
      case body: {
        requestObject.body = JSON.stringify(temp.updated_src);
        break;
      }
      case params: {
        requestObject.params = JSON.stringify(temp.updated_src);
        break;
      }
      case cookies: {
        requestObject.cookies = JSON.stringify(temp.updated_src);
        break;
      }
    }
  };

  handleContentHtml = (data) => {
    if (data && data.length > 0) {
      return (
        data.map((pdata, index) => (
          <Panel header={pdata.configName +' ['+pdata.sort+']'+ ' ('+pdata.subList.length+')'} key={index} extra={this.genExtra(pdata)}>
            {
              pdata.subList.map((subdata,subIndex) => (
                <Tag style={{width:'15%',textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",cursor:"pointer"}} color={colorArray[subIndex%colorArray.length]} title={subdata.configName+' '+subdata.requestUrl} closable={false} onClose={()=> this.handleDelModel({id:subdata.id,ifDel:1,...subdata})} onClick={() => this.handleModalVisible(true,"update", pdata, subdata)}>
                  {subdata.configName+' ['+subdata.sort+']'}
                </Tag>
              ))
            }
            <Tag style={{width:'8%',textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",cursor:"pointer",borderColor:"red"}} title={'点我添加接口'} onClick={() => this.handleModalVisible(true,"add", pdata)}>
              <PlusOutlined /> 点我添加接口
            </Tag>
          </Panel>
        ))
      )
    } else {
      return (
        <Panel header={"请添加"} key={1} extra={this.genInitExtra()}>
          <Tag style={{width:'8%',textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",cursor:"pointer"}} color='#87d068' title={'点我添加接口'} onClick={() => this.handleModalVisible(true,"add")}>
            <PlusOutlined /> 点我添加接口
          </Tag>
        </Panel>
      )
    }
  };

  genExtra = (pdata) => (
    <div>
      <PlusOutlined
        title={'添加接口'}
        onClick={() => {
          this.handleModalVisible(true,"add", pdata);
        }}
      />
      &nbsp;&nbsp;
      <EditOutlined
        title={'修改分类'}
        onClick={() => {
          this.handleModalVisibleToCategory(true,"update", pdata);
        }}
      />
      &nbsp;&nbsp;
      <DeleteOutlined
        title={'删除分类'}
        onClick={() => {
          this.handleDelCategoryModel(pdata);
        }}
      />
    </div>
  );

  genInitExtra = () => (
    <div>
      <PlusOutlined
        onClick={() => {
          this.handleModalVisible(true,"add");
        }}
      />
    </div>
  );

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

  render() {
    const {
      postman: { data },
      loading,
    } = this.props;
    const {
      modalVisible,
      formValues,
      formResultValues,
      modalVisibleToCategory,
      formValuesToCategory,
      addOrUpdateDataFlagToCategory,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleDel: this.handleDel,
      handleDelModel: this.handleDelModel,
      handleModalVisible: this.handleModalVisible,
      handleModalVisibleToCategory: this.handleModalVisibleToCategory,
      handleSend: this.handleSend,
      getReactJsonHtml: this.getReactJsonHtml,
      getReactJsonHtmlToInterface: this.getReactJsonHtmlToInterface,
      handleRestToformVals: this.handleRestToformVals,
    };

    return (
      <div>
        {/*v1.7.1 权限控制*/}
        <Authorized authority={['admin', 'test', 'develop']}>
          <Card bordered={false}>
            <Collapse ghost>
              {this.handleContentHtml(data)}
            </Collapse>
          </Card>

          <AddUpdateCategoryForm
            {...parentMethods}
            modalVisible={modalVisibleToCategory}
            formVals={formValuesToCategory}
            addOrUpdateDataFlag={addOrUpdateDataFlagToCategory}
          />
          <AddUpdateInterfaceForm
            {...parentMethods}
            modalVisible={modalVisible}
            formVals={formValues}
            formResultVals={formResultValues}
          />
        </Authorized>
      </div>
    );
  }
}

export default InterfaceList;
