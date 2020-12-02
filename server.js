const PORT = 8080
const path = require('path').resolve()
const express = require('express')
const app = express()
const { renderFile: render } = require('ejs')
const cheerio = require('cheerio-httpcli')
const { get } = require('superagent')

const titleDt = []
const imageDt = []
const categoryDt = []
const dateDt = []

refresh()
setInterval(refresh, 100000)

async function refresh () {

    cheerio.fetch('http://anime.onnada.com/rank.php', {}, (err, $) => {
        if (err) throw err
    
        $('.maintitle').each((i, element) => {
            titleDt.push($(element).text()) // .maintitle 요소들을 모두 찾아 titleDt에 저장
        })

        $('.thumb>a>img').each((i, element) => {
            imageDt.push($(element).attr('data-original')) // .thumb>a>img 요소들을 모두 찾아 imageDt에 저장
        })

        $('.category').each((i, element) => {
            categoryDt.push($(element).text()) // .category 요소들을 모두 찾아 categoryDt에 저장
        })

        $('.date').each((i, element) => {
            dateDt.push($(element).text()) // .date 요소들을 모두 찾아 dateDt에 저장
        })
    
    })

}

app.use('/src', express.static(path + '/src'))

app.get('/', async (_, res) => {

    const str = await render(path + '/page/index.ejs')

    // console.log(imageDt[0])
    res.send(str)

})

app.get('/rank', async (_, res) => {

    const str = await render(path + '/page/rank.ejs', { titleDt, imageDt, categoryDt, dateDt })

    // console.log(titleDt[0])
    res.send(str)

})

app.get('/getData', (req, res) => {
    res.json(titleDt) // http://*:8080/getData 에 들어갔을때 titles를 전송함 titles는 json이기 때문에 res.json 사용
})

app.get('/getDataImg', (req, res) => {
    res.json(imageDt)
})

app.get('/getDataCate', (req, res) => {
    res.json(categoryDt)
})

app.get('/getDataDate', (req, res) => {
    res.json(dateDt)
})

app.listen(PORT, () => console.log('Server is now on http://localhost:' + PORT))
