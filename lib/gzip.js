'use strict'

const archiver = require('archiver');
const fs       = require('fs')

function isDir(path){
    return exists(path) && fs.statSync(path).isDirectory();
}
function exists(path){
    return fs.existsSync(path)
}
function makeIgnoreRegx(list){
    if(list.length==0){
        return new RegExp('^.*$')
    }
    let str = '^((?!';
    list.forEach((item)=>{
        str+=item+'|'
    });
    str = str.substr(0,str.length-1);
    str += ').)+$'
    return new RegExp(str)
}
// /^((?!node_modules|lib|.git|zip).)+$/
function gzip(config){
    // 创建生成的压缩包路径
    let ignore     = (config&&config.ignore) ||['node_modules','lib','.git','zip']
    const Regx     = makeIgnoreRegx(ignore)
    console.log("文件格式:=>"+Regx)
    var outputPath = (config&&config.output) || process.cwd() + '/zip/isec_web_components.zip'
    if(!(config&&config.output)){
        fs.mkdir('zip',function(err){});
    }
    var output = fs.createWriteStream(outputPath);
    var archive = archiver('zip', {
        zlib: {
            level: 9
        } 
    });
     
    // 'close' 
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    output.on('end', function() {
        console.log('Data has been drained');
    });
     
    archive.on('warning', function(err) {
        if(err.code === 'ENOENT') {
        } else {
            throw err;
        }
    });
     
    // 'error' 
    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);

    var inputPath = (config&&config.input) || process.cwd()

    fs.readdir(inputPath, function(err, files){
        if(err){
            log(err);
            return false;
        }
        files.forEach((fileName)=>{
            if(Regx.test(fileName)){  
                let path = inputPath+'/'+fileName
                if(isDir(path)){
                    console.log('添加文件夹: =>'+fileName)
                    archive.directory(path, fileName);
                }else{
                    console.log('添加文件: =>'+fileName)
                    archive.file(path, {
                        name: fileName
                    });
                }
            }
        })
        archive.finalize();
        console.log('输出目录:=>'+outputPath)
    })
}

module.exports = gzip