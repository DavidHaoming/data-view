var OSS = require('ali-oss')
var co = require('co')
var fs = require('fs')
var path = require('path')
var request = require('request')

let region = process.env.SIBBAY_FRONTEND_OSS_REGION
let accessKeyId = process.env.SIBBAY_FRONTEND_OSS_ACCESS_KEY_ID
let accessKeySecret = process.env.SIBBAY_FRONTEND_OSS_ACCESS_KEY_SECRET
let bucket = process.env.SIBBAY_FRONTEND_OSS_BUCKET


let projectName = 'data-mark'
let static_path = 'dist'

if (region === undefined) {
  console.dir('缺少 SIBBAY_OSS_REGION 系统环境变量，请确认docker系统变量设置是否正确。')
  process.exit(1)
}
if (accessKeyId === undefined) {
  console.dir('缺少 SIBBAY_OSS_ACCESS_KEY_ID 系统环境变量，请确认docker系统变量设置是否正确。')
  process.exit(1)
}
if (accessKeySecret === undefined) {
  console.dir('缺少 SIBBAY_OSS_ACCESS_KEY_SECRET 系统环境变量，请确认docker系统变量设置是否正确。')
  process.exit(1)
}
if (bucket === undefined) {
  console.dir('缺少 SIBBAY_OSS_BUCKET 系统环境变量，请确认docker系统变量设置是否正确。')
  process.exit(1)
}


function _format_string_sensitive(_str){
  if(_str === ""){
    return ""
  }
  let length = _str.length
  let _len = Math.floor(length/3)
  let first = Math.floor((length - _len)/2)

  let star_str = ""
  for(let i =1; i<=_len; i++){
    star_str += "*"
  }

  return _str.substring(0, first) + star_str + _str.substring(first+_len)
}

console.log(`
  使用到的环境变量列表如下：
  SIBBAY_OSS_REGION is (${region})
  SIBBAY_OSS_ACCESS_KEY_ID is (${_format_string_sensitive(accessKeyId)})
  SIBBAY_OSS_ACCESS_KEY_SECRET is (${_format_string_sensitive(accessKeySecret)})
  SIBBAY_OSS_BUCKET is (${bucket})
`)

var client = new OSS({
  region: region,
  accessKeyId: accessKeyId,
  accessKeySecret: accessKeySecret,
  bucket: bucket,
  timeout: 60000000
})

function send_message_to_bearychat (message, callback) {
    console.log(message)
}


function find_file (dir, files) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      find_file(pathname, files)
    } else {
      files.push(pathname)
    }
  })
}
//

var files = []
find_file('dist', files)
send_message_to_bearychat(`${projectName} 开始上传`)

co(function *() {
  for (let pathname of files) {
    let path = pathname.replace(`${static_path}/`, '')
    console.dir(pathname + " 上传到 " + path)
    let result = yield client.multipartUpload(path, pathname.replace(/\\/g, '/'), {
      parallel: 4,
      partSize: 512 * 1024
    })
    console.dir('上传文件 ' + pathname.replace(/\\/g, '/') + '完成')
  }
  send_message_to_bearychat(`${projectName} 上传成功`)
}).catch(function (err) {
  send_message_to_bearychat(`${projectName} 上传失败`, function() {
    process.exit(1)
  })
})
