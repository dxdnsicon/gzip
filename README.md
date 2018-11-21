###demo

安装依赖 npm install
node index.js

###使用方法

```javascript

const gzip  = require('gzip')
gzip({
    input:'/usr/local/www/project',
    output:'/usr/project.zip'
    ignore:['node_modules','.git','dist']
})

```