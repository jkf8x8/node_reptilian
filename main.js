var express = require("express")
var cheerio = require("cheerio")
var https = require("https")
var fs = require('fs')

var app = express()

app.get('/',(req,res)=>{
    var stream = fs.createReadStream('./views/f.html','utf8')
    // stream.read
    // console.log(stream)
    var htmls = ''
    stream.on('data',(chunk)=>{
        htmls += chunk
    })

    stream.on('end',()=>{
        // console.log(htmls)
        var $ = cheerio.load(htmls,{decodeEntities: false})
        
        // console.log($('.ul_list').html())

        var strArr = []
        $('.ul_list li').each((key,ele)=>{
            // console.log(ele.children('a'))
            
            // var str = ele.firstChild()
            // var str = $(this).find('.sp_name').html()
            // strArr[key] = $(this).html()
            // console.log($(this).text())

            var str = $('.ul_list li').eq(key).find('a').attr('title')

            console.log(str+'\n')
        })
    })
   
    // console.log('ok')
    res.send('ok')

})

app.get("/f",(req,res)=>{
    var url = ''
    https.get(url,(res)=>{
        var str = ''
        res.on('data',(chunk)=>{
            str += chunk
        })
        res.on('end',()=>{
            fs.writeFileSync('./views/f.html',str,'utf8')
            // console.log(str)
        })
    })
    res.send('ok')
})


app.listen("8080",()=>{
    console.log("port 8080....")
})