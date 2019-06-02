ant design pro中从页面发起请求到后端服务数据的过程：
以http://localhost:8000/list/table-list这个页面为例，看看是如何请求表格数据的
1、首先可以在config/router.config.js中找到/list/table-list这个path对应的component为
./List/TableList，其对应src/pages/List/TableList.js
2、在TableList.js中可以找到'class TableList extends PureComponent'这个代码，
在请求这个页面的时候，会先执行'class TableList'里面componentDidMount()方法，
这个方法会调用rule/fetch这个方法来请求数据，然后把数据保存到this.props中；
3、那rule/fetch这个方法又是如何请求数据的呢？
在src/pages/List/TableList.js中有一段'@connect(({ rule, loading }) => ({'的代码，
这个表示引入src/pages/List/models/rule.js里面为‘rule’的namespace，
在rule.js中的effects下面就有一个fetch的方法，它调用的是queryRule这个方法，
我们可以看到queryRule这个方法来源于‘@/services/api’里面，‘@/services/api’其实对应的是
src/services/api.js，在api.js中我们可以找到queryRule这个方法，它其实就是真正调用后端
接口：/api/rule的地方；
默认情况下其实代码‘return request(`/api/rule?${stringify(params)}`);’会请求mock中的数据，
即mock/rule.js中定义的‘/api/rule’返回的数据，
当然如果要请求真实后端的数据我们只需要修改一下‘return request(`/api/rule?${stringify(params)}`);’这个
代码，在前面加上后端服务的ip和端口地址就可以了，
即‘return request(`http://192.168.1.30:8009/api/rule?${stringify(params)}`);’
