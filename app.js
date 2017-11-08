

var fs = require('fs');
var config = require('./config/config.js');


// 读取多语言配置
var languages = config.languages;
var langpath = './config/lang/{filename}.json';
var output = './build/'


// 获取模板
getTemplate( './src/' );

function getTemplate( path ){
    var files = fs.readdirSync( path )

    files.forEach(function(filename){
        var filepath = path + filename
        var file = fs.readFileSync(filepath, 'utf-8')
        var patts = file.match(/{{[^}]+}}/g)
        
        saveToLangHtml( file, filename, patts )
    })
}


// 获取模板中的表达式
function getTemplatePatt( templatepath ){
    var template = fs.readFileSync(templatepath, 'utf-8')
    return template.match(/{{[^}]+}}/g)
}


// 根据模板生成对应文件
// file: 文件内容
// filename: 保存文件名称
// patts: 匹配出来的模板字符串
function saveToLangHtml( file, filename, patts ){

    languages.forEach(function(langname){
        var langfile = langpath.replace('{filename}', langname)
        var lang = fs.readFileSync(langfile, 'utf-8')
        lang = JSON.parse( lang )
        // console.log( lang )

        var content = file;
        patts.forEach(function(patt){
            var prop = patt.replace(/\{|\}/g, '');
            content = content.replace( patt, lang[prop] )
        })

        
        var outputFile = output + langname + '/' + filename;

        // 检测路径
        if( !fs.existsSync(output + langname) ){
            fs.mkdirSync( output + langname )
        }

        // 保存文件
        fs.writeFileSync(outputFile, content)
    })
}