const PORT = port = process.env.PORT || 80
const path = require('path').resolve()
const express = require('express')
const app = express()
const { renderFile: render } = require('ejs')
const cheerio = require('cheerio-httpcli')
const { get } = require('superagent')

// Rank 
const titleDt = []
const imageDt = []
const categoryDt = []
const dateDt = []

// New
const titleN = []
const imageN = []
const dateN = []

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

    cheerio.fetch('http://anime.onnada.com/search.php', {}, (err, $) => {
        if (err) throw err
    
        $('.title').each((i, element) => {
            titleN.push($(element).text()) // .title 요소들을 모두 찾아 titleN에 저장
        })

        $('.thumb>a>.img2').each((i, element) => {
            imageN.push($(element).attr('data-original')) // .thumb>a>img2 요소들을 모두 찾아 imageN에 저장
        })

        $('.date').each((i, element) => {
            dateN.push($(element).text()) // .date 요소들을 모두 찾아 dateN에 저장
        })
    
    })

}

app.use('/src', express.static(path + '/src'))

app.get('/', async (_, res) => {

    const str = await render(path + '/page/index.ejs')

    res.send(str)

})

app.get('/rank', async (_, res) => {

    const str = await render(path + '/page/rank.ejs', { titleDt, imageDt, categoryDt, dateDt })

    // console.log(titleDt[0])
    res.send(str)

})

app.get('/new', async (_, res) => {

    const str = await render(path + '/page/new.ejs', { titleN, imageN, dateN })

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

app.get('/getDataNew', (req, res) => {
    res.json(titleN)
})

app.get('/getDataNewImg', (req, res) => {
    res.json(imageN)
})

app.get('/getDataNewDate', (req, res) => {
    res.json(dateN)
})

app.listen(PORT, () => console.log('Server is now on http://localhost:' + PORT))
