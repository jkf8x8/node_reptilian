var express = require("express")
var cheerio = require("cheerio")
var https = require("https")
var fs = require('fs')

var app = express()

app.set("view engine",'ejs')

const baseUrl = 'https://www.cdfangxie.com'
const htmlFilePath = './views/g.html'
const dataPath = './data/info.json'


app.get('/',(req,res)=>{
    let data = fs.readFileSync(dataPath,'utf8')

    // console.log(data)
    let result = JSON.parse(data)
    // for(let item in result){
    //     console.log(result[item])
    // }
    res.render('index',{result})
})

// 将内容 提取 存为 json数据  step 2
app.get('/parse', (req, res) => {
    if (!fs.existsSync(htmlFilePath)) {kjjk
        res.send("文件不存在")
        return false
    }
    var stream = fs.createReadStream(htmlFilePath, 'utf8')
    var htmls = ''
    stream.on('data', (chunk) => {
        htmls += chunk
    })

    stream.on('end', () => {
        var $ = cheerio.load(htmls, { decodeEntities: false })

        // console.log($('.ul_list').html())

        var houseArea = {}
        $('li').each((key, ele) => {
            let houseTitle = $(ele).find('a').attr('title')
            if (houseTitle != undefined) {
                let houseUrl = baseUrl+$(ele).find('a').attr('href')
                let time = $(ele).find('span').eq(1).text()
                let area = houseTitle.split("|")[0]
                if (houseArea[area]) {
                    houseArea[area].push({ title: houseTitle, url: houseUrl, time: time })
                } else {
                    houseArea[area] = []
                    houseArea[area].push({ title: houseTitle, url: houseUrl, time: time })
                }
            }
        })

        let houseAreaStr = JSON.stringify(houseArea)
        fs.writeFileSync(dataPath, houseAreaStr, 'utf8')

        // console.log(houseAreaStr)
    })

    res.send('ok')

})

// 递归爬内容
function getData(page,max) {
    let url = 'https://www.cdfangxie.com/Infor/type/typeid/36.html?&p=' + page
    // let url = 'https://www.baidu.com'
    let str = ''
    let htmls = ''
    https.get(url, (res) => {
        res.on('data', (chunk) => {  
            str += chunk
        })
        res.on('end', () => {
            let $ = cheerio.load(str, { decodeEntities: false })
            htmls += $('.ul_list').html()
             
            fs.writeFileSync(htmlFilePath,htmls,{encoding:'utf8',flag:'a+'})
            if (page > max) {
                console.log('over...')
                return false;
            } else {
                getData(page+1,max)
            }


        })
    })

}

// 爬页面 内容   step 1
app.get("/get", (req, res) => {
    let htmls = '';
    let destUrl = []

    if(fs.existsSync(htmlFilePath)){
        fs.unlinkSync(htmlFilePath)
    }

    htmls += getData(1,30)

    res.send('ok')
})


app.listen("8080", () => {
    console.log("port 8080....")
})