import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
// 代码编辑器：https://github.com/scniro/react-codemirror2
// 安装命令：cnpm install react-codemirror2 codemirror --save
// 代码编辑器：https://github.com/react-monaco-editor/react-monaco-editor
import { Controlled as CodeMirror } from 'react-codemirror2';
// 安装命令：cnpm install react-monaco-editor --save
import MonacoEditor from 'react-monaco-editor';

import {
  Form,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Input,
  Icon,
  Collapse,
  Radio,
  Tooltip,
  Popconfirm,
  Spin,
  Drawer,
  message,
  notification,
  Popover,
  BackTop,
} from 'antd';

import { findDOMNode } from 'react-dom';
import styles from './RedisHomePage.less';
import StandardFormRow from '@/components/StandardFormRow';

const FormItem = Form.Item;
const { TextArea } = Input;
const Panel = Collapse.Panel;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 10,
  xl: 8,
  xxl: 6,
  style: { marginTop: 10, marginRight: 0, marginBottom: 0, marginLeft: 0 },
};
const formItemLayout = {
  //  wrapperCol: {
  //   xs: { span: 24 },
  //   sm: { span: 16 },
  // },
};

const searchColButton = {
  xs: 15,
  sm: 10,
  md: 5,
  lg: 4,
  xl: 3,
  xxl: 2,
};

// RedisHome对象
let RedisHomeObject;
// 搜索的value
let searchKeyConst = {};
// 当前操作的redis连接信息
let currentOptObject;
// 当前页数
let currentPageNum = 1;

@connect(({ redisadmin, loading }) => ({
  redisadmin,
  loading: loading.models.redisadmin,
}))
@Form.create({ name: 'redisHomeSearch' })
class SearchForm extends PureComponent {
  state = { formValues: [] };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      searchKeyConst = values;
      RedisHomeObject.refeshList(searchKeyConst);
    });
  };

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    searchKeyConst = {};
    RedisHomeObject.refeshList(searchKeyConst);
  };

  // 添加
  showAddModal = () => {
    RedisHomeObject.showModal();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { formValues = {} } = this.state;

    const genExtra = () => (
      <Icon
        type="search"
        onClick={event => {
          // If you don't want click extra trigger collapse, you can prevent this:
          // event.stopPropagation();
        }}
      />
    );

    return (
      <Row gutter={24} style={{ margin: 0 }}>
        <Collapse defaultActiveKey={['10']}>
          <Panel header="搜索" key="10" extra={genExtra()}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <StandardFormRow title="查询条件" grid last>
                <Row gutter={16}>
                  <Col xxl={3} xl={4} lg={6} md={7} sm={10} xs={10} style={{  }}>
                    <FormItem {...formItemLayout} label="">
                      {getFieldDecorator('searchKey', {
                        rules: [{ required: false, message: '名称不能为空' }],
                      })(
                        <Input autoComplete="off" onPressEnter={this.handleSearch} placeholder="" />
                      )}
                    </FormItem>
                  </Col>
                  <Col xxl={21} xl={20} lg={18} md={17} sm={12} xs={12}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{marginLeft:'10px'}} onClick={this.handleFormReset}>
                      重置
                    </Button>
                    <Button style={{marginLeft:'10px'}} onClick={this.showAddModal}>
                      添加
                    </Button>
                  </Col>
                </Row>
              </StandardFormRow>
            </Form>
          </Panel>
        </Collapse>
      </Row>
    );
  }
}

// 序列化的代码例子
const serCodeExample =
  'import org.springframework.core.convert.converter.Converter\n' +
  'import org.springframework.core.serializer.support.DeserializingConverter\n' +
  'import org.springframework.core.serializer.support.SerializingConverter\n' +
  'import org.springframework.data.redis.serializer.RedisSerializer\n' +
  'import org.springframework.data.redis.serializer.SerializationException\n' +
  'import org.springframework.data.redis.serializer.StringRedisSerializer\n' +
  '\n' +
  'public class CustomRedisConfig extends Script{\n' +
  '\n' +
  '    public void setRedisTemplateSerializer(){\n' +
  '        customRedisTemplate.setValueSerializer(new CustomValueRedisObjectSerializer());\n' +
  '        customRedisTemplate.setHashValueSerializer(new CustomValueRedisObjectSerializer());\n' +
  '        customRedisTemplate.setKeySerializer(new StringRedisSerializer());\n' +
  '        customRedisTemplate.setHashKeySerializer(new StringRedisSerializer());\n' +
  '    }\n' +
  '\n' +
  '    @Override\n' +
  '    Object run() {\n' +
  '        return setRedisTemplateSerializer();\n' +
  '    }\n' +
  '}\n' +
  '\n' +
  'public class CustomValueRedisObjectSerializer implements RedisSerializer<Object> {\n' +
  '\n' +
  '    private Converter<Object, byte[]> serializer = new SerializingConverter();\n' +
  '    private Converter<byte[], Object> deserializer = new DeserializingConverter();\n' +
  '\n' +
  '    static final byte[] EMPTY_ARRAY = new byte[0];\n' +
  '\n' +
  '    public Object deserialize(byte[] bytes) {\n' +
  '        if (isEmpty(bytes)) {\n' +
  '            return null;\n' +
  '        }\n' +
  '\n' +
  '        try {\n' +
  '            return deserializer.convert(bytes);\n' +
  '        } catch (Exception ex) {\n' +
  '            throw new SerializationException("Cannot deserialize", ex);\n' +
  '        }\n' +
  '    }\n' +
  '\n' +
  '    public byte[] serialize(Object object) {\n' +
  '        if (object == null) {\n' +
  '            return EMPTY_ARRAY;\n' +
  '        }\n' +
  '\n' +
  '        try {\n' +
  '            return serializer.convert(object);\n' +
  '        } catch (Exception ex) {\n' +
  '            return EMPTY_ARRAY;\n' +
  '        }\n' +
  '    }\n' +
  '\n' +
  '    private boolean isEmpty(byte[] data) {\n' +
  '        return (data == null || data.length == 0);\n' +
  '    }\n' +
  '}';

const serCodeExampleContent = (
  <div style={{width:'800px',height:'100%'}}>
    <MonacoEditor
      width="100%"
      height="500"
      language="JavaScript"
      theme="vs-dark"
      value={serCodeExample}
      options={{ selectOnLineNumbers: true }}
    />
  </div>
);

const redisTypeExampleContent = (
  <div style={{width:'400px',wordBreak: 'break-all'}}>
    <p>单机地址：192.168.1.32:6379</p>
    <p>集群地址：192.168.1.32:7000,192.168.1.32:7001,192.168.1.32:7002,192.168.1.32:7003,192.168.1.32:7004,192.168.1.32:7005</p>
  </div>
);


@connect(({ redisadmin, loading }) => ({
  redisadmin,
  loading: loading.models.redisadmin,
}))
@Form.create({ name: 'redisHome' })
class RedisHome extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  state = {
    visible: false,
    done: false,
    dataLoading: true, // 开启加载中
    fetchMoreButtonDisabled: false, //“加载更多”按钮
  };

  componentDidMount() {
    // console.log('redis-home-init');
    this.refeshList(searchKeyConst);
    const { redisadmin, loading } = this.props;
    // 初始化后把当前对象保存到RedisHomeObject变量中去
    RedisHomeObject = this;
  }

  refeshList = searchKey => {
    this.setState({
      dataLoading: true, // 开启加载中
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'redisadmin/fetchConfigList',
      payload: searchKey,
      callback: () => {
        currentPageNum = 1;
        this.setState({
          dataLoading: false, // 关闭加载中
          fetchMoreButtonDisabled: false,
        });
      },
    });
  };

  fetchMore = () => {
    this.setState({
      dataLoading: true, // 开启加载中
    });
    var pageNum = currentPageNum+1;
    const { dispatch } = this.props;
    dispatch({
      type: 'redisadmin/appendFetchConfigList',
      payload: {...searchKeyConst, pageNum},
      callback: (resp) => {
        if (resp && resp.configList && resp.configList.length > 0) {
          currentPageNum++;
        } else {
          this.setState({
            fetchMoreButtonDisabled: true,
          });
        }
        this.setState({
          dataLoading: false, // 关闭加载中
        });
      },
    });
  };

  toRedisDataPage = id => {
    router.push(`/redis/data/${id}`);
  };

  clearRedisTemplateCache = temp => {
    const { dispatch } = this.props;
    dispatch({
      type: 'redisadmin/clearCache',
      payload: temp.id,
      callback: () => {
        message.success('[' + temp.name + ']清理redis连接信息缓存成功!');
      },
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  deleteModel = item => {
    Modal.confirm({
      title: '删除连接',
      content: `确定删除【${item.name}】这个redis连接信息吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(item.id),
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
    currentOptObject = item;
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleTestConnection = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      const { current } = this.state;
      const id = current ? current.id : '';
      let source = 1; //添加
      if (id && id!='') {
        source = 2; //修改
      }
      const values = {
        ...fieldsValue,
      };
      dispatch({
        type: 'redisadmin/testConnection',
        payload: {source, ...values},
        callback: (response) => {
          let notifyType = 'warning';
          let msg = '连接失败! ';
          let showTime = 4.5;
          if (response && response.code == 200) {
            notifyType = 'success';
            msg = '连接成功!';
          } else if (response && response.msg && response.msg != '') {
            msg = msg + response.msg;
            showTime = 10;
          }
          notification[notifyType]({
            message: '测试连接',
            description: msg,
            duration: showTime,
          });
        },
      });
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    const {form} = this.props;
    form.resetFields();

    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      this.setState({
        done: false,
        visible: false,
      });

      const values = {
        ...fieldsValue,
      };
      // 保存数据到后台
      dispatch({
        type: id ? 'redisadmin/updateConfig' : 'redisadmin/addConfig',
        payload: { id, ...values },
        callback: () => {
          this.refeshList(searchKeyConst);
          message.success(id ? '修改成功!' : '添加成功!');
        },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'redisadmin/removeConfig',
      payload: id,
      callback: () => {
        this.refeshList(searchKeyConst);
        message.success('删除成功!');
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { redisadmin, loading } = this.props;
    const { configList } = redisadmin;

    const { visible, done, current = {} } = this.state;

    const colItems = configList.map((temp, index) => (
      <Col {...topColResponsiveProps} key={temp.id}>
        <Card
          bordered={true}
          size="small"
          title={`[${temp.name}]redis连接信息`}
          extra={
            <a
              title={'删除连接信息'}
              onClick={e => {
                e.preventDefault();
                this.deleteModel(temp);
              }}
            >
              <Icon type="close-circle" theme="twoTone" width={50} height={50} />
            </a>
          }
          style={
            {
              /* width: 240 */
            }
          }
          hoverable={false}
          onDoubleClick={e => {
            e.preventDefault();
            this.toRedisDataPage(temp.id);
          }}
          actions={[
            <a
              title={'修改redis连接信息'}
              onClick={e => {
                e.preventDefault();
                this.showEditModal(temp);
              }}
            >
              <Icon type="edit" />
              &nbsp;
              连接信息
            </a>,
            <a
              title={'操作redis数据信息'}
              onClick={e => {
                e.preventDefault();
                this.toRedisDataPage(temp.id);
              }}
            >
              <Icon type="database" />
              &nbsp;
              数据信息
            </a>,
            <a
              title={'清理redis连接信息缓存'}
              onClick={e => {
                e.preventDefault();
                this.clearRedisTemplateCache(temp);
              }}
            >
              <Icon type="delete" />
              &nbsp;
              清理缓存
            </a>,
          ]}
        >
          <p className={styles.pStyle}>名称：{temp.name}</p>
          <p className={styles.pStyle}>
            类型：{temp.type === 1 ? '单机' : temp.type === 2 ? '集群' : '未知'}
          </p>
          <p className={styles.pStyle} title={temp.address}>
            地址：{temp.address}
          </p>
          <p className={styles.pStyle}>创建时间：{temp.createTime}</p>
          <p className={styles.pStyle} title={temp.note}>
            备注：{temp.note ? temp.note : '-'}
          </p>
        </Card>
      </Col>
    ));

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const addUpdateFootContent = () => {
      return (
        [
          <Button key="testCon" type="primary" loading={loading} onClick={this.handleTestConnection}>
            测试连接
          </Button>,
          <Button key="cancle" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
        ]
      );
    };

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="名称" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '名称不能为空' }],
              initialValue: current.name,
            })(<Input autoComplete="off" placeholder="给redis连接取个名称吧" />)}
          </FormItem>
          <FormItem label="类型" {...this.formLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '类型不能为空' }],
              initialValue: current.type,
            })(
              <Radio.Group>
                <Radio value={1}>单机</Radio>
                <Radio value={2}>集群</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            {...this.formLayout}
            label={
              <span>
                地址&nbsp;
                <em className={styles.optional}>
                  <Popover content={redisTypeExampleContent} title="redis连接地址例子" trigger="hover">
                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                  </Popover>
                </em>
              </span>
            }
          >
            {getFieldDecorator('address', {
              rules: [{ required: true, message: '地址不能为空' }],
              initialValue: current.address,
            })(<Input autoComplete="off" placeholder="redis连接地址" />)}
          </FormItem>
          <FormItem label="密码" {...this.formLayout}>
            {getFieldDecorator('password', {
              rules: [{ required: false, message: '密码信息' }],
              initialValue: current.password,
            })(<Input.Password autoComplete="off" type="password" placeholder="redis的密码" />)}
          </FormItem>
          <FormItem
            {...this.formLayout}
            label={
              <span>
                Serializable code&nbsp;
                <em className={styles.optional}>
                  <Popover content={serCodeExampleContent} title="Serializable code example" trigger="hover">
                    <Icon type="info-circle-o" style={{marginRight: 4, cursor: 'pointer'}}/>
                  </Popover>
                </em>
              </span>
            }
          >
            {getFieldDecorator('serCode', {
              rules: [{ required: false, message: 'Serializable code' }],
              initialValue: current.serCode,
            })(
              <TextArea
                placeholder="序列化code(Groovy)。默认key,hashKey,value,hashValue使用：StringRedisSerializer"
                rows={4}
              />
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="备注">
            {getFieldDecorator('note', {
              rules: [{ required: false, message: '备注' }],
              initialValue: current.note,
            })(<TextArea placeholder="备注" rows={2} />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <div>
        <SearchForm />
        <Row gutter={24} style={{ marginTop: 0 }}>
          <Spin spinning={this.state.dataLoading} delay={100}>
            {colItems}
            <Col {...topColResponsiveProps}>
              <Card
                bordered={true}
                size="small"
                title="新建redis连接信息"
                style={
                  {
                    /* width: 240 */
                  }
                }
                hoverable={false}
              >
                <p>
                  <Button
                    type="dashed"
                    style={{ width: '80%', margin: 20 }}
                    icon="plus"
                    onClick={this.showModal}
                    ref={component => {
                      /* eslint-disable */
                      this.addBtn = findDOMNode(component);
                      /* eslint-enable */
                    }}
                  >
                    添加
                  </Button>
                </p>
              </Card>
            </Col>
          </Spin>
        </Row>
        {/*加载更多*/}
        <Spin spinning={this.state.dataLoading} delay={100}>
          <div style={{textAlign: 'center', marginTop: 16}}>
            <Button onClick={this.fetchMore} style={{paddingLeft: 48, paddingRight: 48}} disabled={this.state.fetchMoreButtonDisabled}>
              {loading ? (
                <span>
                <Icon type="loading"/> 加载中...
              </span>
              ) : (
                '加载更多'
              )}
            </Button>
          </div>
        </Spin>
        {/*返回顶部*/}
        <BackTop />
        {/*redis连接信息modal*/}
        <Modal
          title={done ? null : `${current.id ? '编辑redis连接信息' : '添加redis连接信息'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '5px 0' } : { padding: '5px 0 0' }}
          destroyOnClose
          visible={visible}
          footer={addUpdateFootContent()}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </div>
    );
  }
}

export default RedisHome;
