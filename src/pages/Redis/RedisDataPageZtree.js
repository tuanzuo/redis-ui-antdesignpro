// import React, { PureComponent } from 'react';
// import { connect } from 'dva';
// // JSON显示器:https://ant.design/docs/react/recommendation-cn
// // https://github.com/mac-s-g/react-json-view
// import ReactJson from 'react-json-view';
// // JSON格式化显示：https://www.npmjs.com/package/react-json-pretty
// import JSONPretty from 'react-json-pretty';
// import {
//   Form,
//   Row,
//   Col,
//   Card,
//   Button,
//   Tree,
//   Input,
//   InputNumber,
//   Icon,
//   Divider,
//   Modal,
//   message,
//   Descriptions,
//   Typography,
//   Drawer,
//   Spin,
//   Statistic,
// } from 'antd';
//
// import { findDOMNode } from 'react-dom';
// import styles from './RedisDataPage.less';
// import StandardFormRow from '@/components/StandardFormRow';
//
// import ReactZtree from '../../components/ZTree/ztree'; //封装的tree.js路径
// // 样式文件一定不要忘了引入，不然会没有样式
// import 'ztree/css/zTreeStyle/zTreeStyle.css';
//
// const FormItem = Form.Item;
// const { TextArea } = Input;
// const { TreeNode } = Tree;
// const { Paragraph } = Typography;
// const Countdown = Statistic.Countdown;
//
// const formItemLayout = {
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 16 },
//   },
// };
//
// const searchColButton = {
//   xs: 25,
//   sm: 15,
//   md: 6,
//   lg: 7,
//   xl: 6,
//   xxl: 10,
// };
//
// // RedisData搜索对象
// let RedisDataSearchObject;
// // RedisDataUpdate对象
// let RedisDataUpdateObject;
// // RedisData对象
// let RedisDataObject;
// // 当前redis页面的id
// let id;
// // 搜索的key
// let searchKeyConst = {};
// // 当前checked的节点
// let currentCheckedKeys = [];
// // 当前选中的叶子节点
// let currentKey = [];
// // 当前选中的叶子节点对应的value
// let currentKeyValue = {};
// // 当前选中的叶子节点对应的value的Json数据
// let currentKeyValueToJsonValue;
// // 执行onSelect时的参数
// let onSelectParams = {};
//
// //ztree object
// let ztreeObj;
// let reactZtreeObj;
//
// @connect(({ redisadmin, loading }) => ({
//   redisadmin,
//   loading: loading.models.redisadmin,
// }))
// @Form.create({ name: 'searchFormZtree' })
// class SearchFormZtree extends PureComponent {
//   state = { formValues: [] };
//
//   // 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问
//   componentDidMount() {
//     // console.log('redis-searchfrom-init');
//     // 初始化后把当前对象保存到RedisDataSearchObject变量中去
//     RedisDataSearchObject = this;
//   }
//
//   // 查询
//   handleSearch = e => {
//     e.preventDefault();
//     const { dispatch, form } = this.props;
//     form.validateFields((err, fieldsValue) => {
//       if (err) return;
//
//       const values = {
//         id,
//         ...fieldsValue,
//       };
//
//       this.setState({
//         formValues: values,
//       });
//       searchKeyConst = values;
//       RedisDataObject.searchKeyList(values);
//     });
//   };
//
//   // 重置
//   handleFormReset = () => {
//     const { form, dispatch } = this.props;
//     form.resetFields();
//     this.setState({
//       formValues: {},
//     });
//     searchKeyConst = {};
//     const searchParam = { id, ...searchKeyConst };
//     RedisDataObject.searchKeyList(searchParam);
//   };
//
//   // 显示修改keyValue的抽屉页面
//   showEditDrawer = () => {
//     RedisDataUpdateObject.showDrawer();
//   };
//
//   // 删除选中的节点
//   delCheckedNodes = () => {
//     const params = {
//       id,
//       keys: currentCheckedKeys,
//     };
//     RedisDataObject.deleteModel(params);
//   };
//
//   render() {
//     const {
//       form: { getFieldDecorator },
//     } = this.props;
//
//     const { formValues = {} } = this.state;
//
//     const genExtra = () => (
//       <Icon
//         type="search"
//         onClick={event => {
//           // If you don't want click extra trigger collapse, you can prevent this:
//           // event.stopPropagation();
//         }}
//       />
//     );
//
//     return (
//       <Form onSubmit={this.handleSearch} layout="inline">
//         <StandardFormRow title="查询条件" grid last>
//           <Row gutter={24}>
//             <Col xxl={3} xl={5} lg={8} md={9} sm={10} xs={24}>
//               <FormItem label="">
//                 {getFieldDecorator('searchKey', {
//                   rules: [{ required: false, message: '名称不能为空' }],
//                 })(<Input autoComplete="off" placeholder="" />)}
//               </FormItem>
//             </Col>
//             <Col xxl={3} xl={5} lg={8} md={9} sm={10} xs={24}>
//               <Row gutter={24} style={{ width: '350px' }}>
//                 <Col {...searchColButton}>
//                   <Button type="primary" htmlType="submit">
//                     查询
//                   </Button>
//                 </Col>
//                 <Col {...searchColButton}>
//                   <Button onClick={this.handleFormReset}>重置</Button>
//                 </Col>
//                 <Col {...searchColButton}>
//                   <Button onClick={this.showEditDrawer}>修改</Button>
//                 </Col>
//                 <Col {...searchColButton}>
//                   <Button type="danger" onClick={this.delCheckedNodes}>
//                     删除
//                   </Button>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>
//         </StandardFormRow>
//       </Form>
//     );
//   }
// }
//
// @connect(({ redisadmin, loading }) => ({
//   redisadmin,
//   loading: loading.models.redisadmin,
// }))
// @Form.create({ name: 'redisDataUpdateZtree' })
// class RedisDataUpdateFormZtree extends React.Component {
//   state = {
//     visible: false,
//     drawerTitle: '',
//     data: {},
//     optKey: '',
//     optKeyButtont: '',
//     optTTL: '',
//     optTTLButtont: '',
//   };
//
//   // 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问
//   componentDidMount() {
//     // console.log('redis-dataupdate-init');
//     const { dispatch } = this.props;
//     // 初始化后把当前对象保存到RedisDataUpdateObject变量中去
//     RedisDataUpdateObject = this;
//   }
//
//   // 显示keyValue修改的抽屉页面
//   showDrawer = () => {
//     let currentKeyOne = {};
//     if (currentKey && currentKey.length > 0) {
//       currentKeyOne = currentKey[0];
//     } else {
//       message.warning('请先选中一个key!');
//     }
//     if (currentKeyOne.title && currentKeyValue.keyType) {
//       let titleName = currentKeyOne.title;
//       if (titleName && titleName.length > 60) {
//         titleName = titleName.substr(0, 60) + '...';
//       }
//       titleName = '修改' + titleName + '(' + currentKeyValue.keyType + ')';
//       this.setState({
//         drawerTitle: titleName,
//         visible: true,
//         data: {
//           key: currentKeyOne.key,
//           keyType: currentKeyValue.keyType,
//           expireTime: currentKeyValue.expireTime,
//           keyValue: currentKeyValue.value,
//         },
//       });
//     }
//   };
//
//   onClose = () => {
//     this.setState({
//       visible: false,
//     });
//   };
//
//   // -------key--------
//   updateKeyContent = key => {
//     this.setState({
//       optKey: key,
//       optKeyButtont: 'update',
//     });
//   };
//
//   getKeyContent = () => {
//     const { getFieldDecorator } = this.props.form;
//     const { data, optKey } = this.state;
//     if (optKey && optKey === 'update') {
//       return (
//         <Form.Item label="key:">
//           {getFieldDecorator('key', {
//             rules: [{ required: true, message: 'Please enter key name' }],
//             initialValue: data.key,
//           })(<Input placeholder="Please enter key name" />)}
//         </Form.Item>
//       );
//     }
//     return <Form.Item label="key:">{data.key}</Form.Item>;
//   };
//
//   updateKeyButtonContent = key => {
//     this.setState({
//       optKey: '',
//       optKeyButtont: key,
//     });
//   };
//
//   reNameKey = tempKey => {
//     const { dispatch, form } = this.props;
//     const { data } = this.state;
//     form.validateFields((err, fieldsValue) => {
//       if (err) return;
//       const oldKey = data.key;
//       const values = {
//         id,
//         oldKey,
//         ...fieldsValue,
//       };
//       // 保存数据到后台
//       dispatch({
//         type: 'redisadmin/reNameKey',
//         payload: { ...values },
//         callback: () => {
//           this.updateKeyButtonContent(tempKey);
//           this.onClose();
//           // 重新执行查询操作
//           RedisDataObject.searchKeyList(searchKeyConst);
//         },
//       });
//     });
//   };
//
//   getKeyButtonContent = () => {
//     const { optKeyButtont } = this.state;
//     if (optKeyButtont && optKeyButtont === 'update') {
//       return (
//         <Form.Item label="&nbsp;&nbsp;">
//           <Button size="small" onClick={() => this.reNameKey('')}>
//             保存
//           </Button>
//           <Button size="small" onClick={() => this.updateKeyButtonContent('')}>
//             取消
//           </Button>
//         </Form.Item>
//       );
//     }
//     return (
//       <Form.Item label="&nbsp;&nbsp;">
//         <Button size="small" onClick={() => this.updateKeyContent('update')}>
//           修改key
//         </Button>
//       </Form.Item>
//     );
//   };
//
//   // -------TTL--------
//   updateTTLContent = key => {
//     this.setState({
//       optTTL: key,
//       optTTLButtont: 'update',
//     });
//   };
//
//   getTTLContent = () => {
//     const { getFieldDecorator } = this.props.form;
//     const { data, optTTL } = this.state;
//     if (optTTL && optTTL === 'update') {
//       return (
//         <Form.Item label="ttl:">
//           {getFieldDecorator('expireTime', {
//             rules: [{ required: true, message: 'Please enter expireTime' }],
//             initialValue: data.expireTime,
//           })(
//             <InputNumber min={-1} placeholder="Please enter expireTime" style={{ width: '100%' }} />
//           )}
//         </Form.Item>
//       );
//     }
//     /* if (data && data.expireTime && data.expireTime > 0) {
//       return (
//         <Form.Item label="ttl:">
//           <Countdown value={Date.now() + data.expireTime * 1000} format="DD:HH:mm:ss" />
//         </Form.Item>
//       );
//     } */
//     return <Form.Item label="ttl:">{data.expireTime}</Form.Item>;
//   };
//
//   updateTTLButtonContent = key => {
//     this.setState({
//       optTTL: '',
//       optTTLButtont: key,
//     });
//   };
//
//   reSetTTL = tempKey => {
//     const { dispatch, form } = this.props;
//     const { data } = this.state;
//     form.validateFields((err, fieldsValue) => {
//       if (err) return;
//       const key = data.key;
//       const values = {
//         id,
//         key,
//         ...fieldsValue,
//       };
//       // 保存数据到后台
//       dispatch({
//         type: 'redisadmin/setKeyTTL',
//         payload: { ...values },
//         callback: () => {
//           this.updateTTLButtonContent(tempKey);
//           this.onClose();
//           // 重新执行选中操作
//           RedisDataObject.onSelect(null, null, onSelectParams.selectedKeys, onSelectParams.info);
//         },
//       });
//     });
//   };
//
//   getTTLButtonContent = () => {
//     const { optTTLButtont } = this.state;
//     if (optTTLButtont && optTTLButtont === 'update') {
//       return (
//         <Form.Item label="&nbsp;&nbsp;">
//           <Button size="small" onClick={() => this.reSetTTL('')}>
//             保存
//           </Button>
//           <Button size="small" onClick={() => this.updateTTLButtonContent('')}>
//             取消
//           </Button>
//         </Form.Item>
//       );
//     }
//     return (
//       <Form.Item label="&nbsp;&nbsp;">
//         <Button size="small" onClick={() => this.updateTTLContent('update')}>
//           设置TTL
//         </Button>
//       </Form.Item>
//     );
//   };
//
//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const { data } = this.state;
//
//     return (
//       <div>
//         <Drawer
//           title={this.state.drawerTitle}
//           width={720}
//           onClose={this.onClose}
//           visible={this.state.visible}
//         >
//           <Form layout="vertical" hideRequiredMark>
//             <Row gutter={16}>
//               <Col span={8}>{this.getKeyContent()}</Col>
//               <Col span={4}>{this.getKeyButtonContent()}</Col>
//               <Col span={8}>{this.getTTLContent()}</Col>
//               <Col span={4}>{this.getTTLButtonContent()}</Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={24}>
//                 <Form.Item label="Description">
//                   {getFieldDecorator('description', {
//                     rules: [
//                       {
//                         required: true,
//                         message: 'please enter url description',
//                       },
//                     ],
//                     initialValue: JSON.stringify(data.keyValue),
//                   })(<Input.TextArea rows={4} placeholder="please enter url description" />)}
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Form>
//           <div
//             style={{
//               position: 'absolute',
//               left: 0,
//               bottom: 0,
//               width: '100%',
//               borderTop: '1px solid #e9e9e9',
//               padding: '10px 16px',
//               background: '#fff',
//               textAlign: 'right',
//             }}
//           >
//             <Button onClick={this.onClose} style={{ marginRight: 8 }}>
//               Cancel
//             </Button>
//             <Button onClick={this.onClose} type="primary">
//               Submit
//             </Button>
//           </div>
//         </Drawer>
//       </div>
//     );
//   }
// }
//
// @connect(({ redisadmin, loading }) => ({
//   redisadmin,
//   loading: loading.models.redisadmin,
// }))
// @Form.create({ name: 'redisDataZtree' })
// class RedisDataZtree extends PureComponent {
//   state = {
//     /* treeData: [
//     { title: 'Expand to load', key: '0' },
//     { title: 'Expand to load', key: '1' },
//     { title: 'Tree Node', key: '2', isLeaf: true },
//     ], */
//     treeData: [], //ztree的数据
//     renderZtreeFlag: false, //标识是否需要重新渲染ztree
//     visible: false,
//     done: false,
//     treeLoading: true, // 开启tree加载中
//     keyValueLoading: false, // 关闭keyValue加载中,
//     currentKey: [],
//   };
//
//   setting = {
//     view: {
//       showIcon: false,
//       showLine: true,
//       fontCss: { color: '#666' },
//     },
//     data: {
//       simpleData: {
//         enable: false,
//       },
//       key: {
//         children: 'children',
//         name: 'name',
//         isParent: '',
//       },
//     },
//     check: {
//       enable: true,
//       chkStyle: 'checkbox',
//       chkboxType: { Y: 'ps', N: 'ps' },
//     },
//   };
//
//   // 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问
//   componentDidMount() {
//     // console.log('redis-data-init');
//     const { dispatch, match } = this.props;
//     const { params } = match;
//     id = params.id;
//     // 初始化redis上下文
//     dispatch({
//       type: 'redisadmin/initContext',
//       payload: id,
//       callback: () => {
//         const searchParam = { id, searchKey: '*' };
//         this.searchKeyList(searchParam);
//         // 初始化后把当前对象保存到RedisDataObject变量中去
//         RedisDataObject = this;
//       },
//     });
//   }
//
//   // 查询
//   searchKeyList = searchParam => {
//     // 初始化treeData
//     this.initTreeData();
//
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'redisadmin/fetchKeyList',
//       payload: searchParam,
//       callback: () => {
//         const { redisadmin } = this.props;
//         const { keyList } = redisadmin;
//         this.setState({
//           treeData: keyList,
//           renderZtreeFlag: true,
//           treeLoading: false, // 关闭加载中
//         });
//         // 还原renderZtreeFlag
//         this.setState({
//           renderZtreeFlag: false,
//         });
//         // 还原currentKey为空
//         this.initCurrentKeyForNull();
//         // 还原currentCheckedKeys为空
//         this.initCurrentCheckedKeys();
//       },
//     });
//   };
//
//   // 查询key对应的value
//   searchKeyValue = (params, node) => {
//     this.setState({
//       keyValueLoading: true, // 开启加载中
//     });
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'redisadmin/fetchKeyValue',
//       payload: params,
//       callback: () => {
//         const { redisadmin } = this.props;
//
//         this.setState({
//           keyValueLoading: false, // 关闭加载中
//         });
//
//         const { keyValue } = redisadmin;
//         currentKeyValue = keyValue;
//
//         try {
//           if (currentKeyValue.value && typeof currentKeyValue.value === 'string') {
//             currentKeyValueToJsonValue = JSON.parse(currentKeyValue.value);
//           } else {
//             currentKeyValueToJsonValue = currentKeyValue.value;
//           }
//         } catch (error) {
//           currentKeyValueToJsonValue = currentKeyValue.value;
//         }
//         currentKey[0] = node;
//         this.setState({
//           currentKey: currentKey,
//         });
//       },
//     });
//   };
//
//   deleteModel = params => {
//     if (params && params.keys && params.keys.length > 0) {
//       let contentConst = params.keys;
//       const keySize = params.keys.length;
//       if (params.keys.length > 5) {
//         contentConst = '';
//         for (let i = 0; i < 5; i += 1) {
//           contentConst += params.keys[i];
//           if (i === 4) {
//             contentConst += '......';
//           } else {
//             contentConst += ',';
//           }
//         }
//       }
//       Modal.confirm({
//         title: `删除key(共${keySize}个)`,
//         content: `确定删除【${contentConst}】这些key吗？`,
//         okText: '确认',
//         cancelText: '取消',
//         onOk: () => this.delKeys(params),
//       });
//     } else {
//       message.warning('请选中key后,再删除!');
//     }
//   };
//
//   delKeys = params => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'redisadmin/delKeys',
//       payload: params,
//       callback: () => {
//         this.searchKeyList(searchKeyConst);
//       },
//     });
//   };
//
//   // 还原currentKey为空
//   initCurrentKeyForNull = () => {
//     currentKey = [];
//     this.setState({
//       currentKey: currentKey,
//     });
//   };
//
//   // 还原选中的keys
//   initCurrentCheckedKeys = () => {
//     currentCheckedKeys = [];
//   };
//
//   // 初始化treeData
//   initTreeData = () => {
//     this.setState({
//       treeData: [],
//       renderZtreeFlag: true,
//       treeLoading: true, // 开启加载中
//     });
//     // 还原renderZtreeFlag
//     this.setState({
//       renderZtreeFlag: false,
//     });
//   };
//
//   // ztree初始化后的回调方法
//   handleInitTree = (ztree, reactZtree) => {
//     ztreeObj = ztree;
//     reactZtreeObj = reactZtree;
//   };
//
//   onSelect = (event, treeId, treeNode, selectedNodes) => {
//     onSelectParams.selectedKeys = treeNode;
//     onSelectParams.info = selectedNodes;
//
//     // 是叶子节点才给当前key设置值
//     if (treeNode.isLeaf) {
//       const params = {
//         id,
//         searchKey: treeNode.key,
//       };
//       this.searchKeyValue(params, treeNode);
//     } else {
//       this.initCurrentKeyForNull();
//     }
//   };
//
//   // 选中节点
//   onCheck = (event, treeId, treeNode, checkedNodes) => {
//     this.initCurrentCheckedKeys();
//     checkedNodes.forEach(temp => {
//       if (temp.isLeaf) {
//         currentCheckedKeys.push(temp.key);
//       }
//     });
//   };
//
//   // 得到TTL显示的html
//   getTtlContent = expireTime => {
//     // expireTime：过期时间--单位是s
//     if (expireTime && expireTime > 0) {
//       return (
//         <Countdown
//           title=""
//           value={Date.now() + expireTime * 1000}
//           format="DD:HH:mm:ss"
//           valueStyle={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.62)' }}
//         />
//       );
//     }
//     return expireTime;
//   };
//
//   render() {
//     const {
//       form: { getFieldDecorator },
//     } = this.props;
//     const { visible, done, current, currentKey = {} } = this.state;
//
//     // 右边的内容(key对应的value数据)
//     const contentRight = currentKey.map((k, index) => (
//       <Card bordered={false} key={k.key}>
//         <p key={k.key + 0}>type：{currentKeyValue.keyType}</p>
//         ttl：
//         <div style={{ display: 'inline-block' }}>
//           {this.getTtlContent(currentKeyValue.expireTime)}
//         </div>
//         <p key={k.key + 1} />
//         <Paragraph ellipsis={{ rows: 1, expandable: true }}>key：{k.key}</Paragraph>
//         <Paragraph ellipsis={{ rows: 10, expandable: true }}>
//           value：
//           <JSONPretty id="json-pretty" data={currentKeyValue.value} />
//         </Paragraph>
//         <ReactJson
//           name="JsonValue"
//           src={currentKeyValueToJsonValue}
//           displayDataTypes={false}
//           theme="monokai"
//         />
//       </Card>
//     ));
//
//     return (
//       <Card bordered={false} size="small" hoverable>
//         <div>
//           <Row>
//             <Col span={24}>
//               <SearchFormZtree />
//             </Col>
//           </Row>
//           <Row>
//             <Col span={24}>
//               <Divider dashed style={{ marginTop: 19, marginBottom: -1 }} />
//             </Col>
//           </Row>
//           <Row>
//             <Col span={10} className={styles.treeContainer}>
//               <Spin spinning={this.state.treeLoading} delay={100}>
//                 <Card bordered={false}>
//                   <ReactZtree
//                     nodes={this.state.treeData}
//                     renderZtreeFlag={this.state.renderZtreeFlag}
//                     ref="ztree"
//                     treeName={'tree1'}
//                     check={this.setting.check}
//                     view={this.setting.view}
//                     onInitTree={this.handleInitTree}
//                     onClick={this.onSelect}
//                     onCheck={this.onCheck}
//                   />
//                 </Card>
//               </Spin>
//             </Col>
//             <Col span={14} className={styles.treeContainer}>
//               <Spin spinning={this.state.keyValueLoading} delay={100}>
//                 {contentRight}
//               </Spin>
//             </Col>
//           </Row>
//           <RedisDataUpdateFormZtree />
//         </div>
//       </Card>
//     );
//   }
// }
//
// export default RedisDataZtree;
