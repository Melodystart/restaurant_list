const express = require('express') //載入 Express
const app = express()
const port = 3000
// require express-handlebars here
const exphbs = require('express-handlebars')

const restaurantList = require('./restaurant.json')

// setting template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// 設定路由(all): past restaurants data into 'index' partial template
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results });
})
// 設定路由(特定餐廳): past restaurant data into 'show' partial template
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant });
})
// 設定路由(搜尋餐廳關鍵字 or 餐廳類別)
app.get('/search', (req, res) => {
  let restaurants = []
  let keyword = req.query.keyword
  const category = req.query.category

  //若沒搜尋關鍵字 且 沒選擇餐廳類別時，將頁面導回根目錄，顯示出所有餐廳
  if (!keyword && !category) {
    return res.redirect("/")
  }

  //搜尋方式為餐廳類別，則將undefined關鍵字設為空值""，避免後續函式處理報錯
  if (keyword === undefined) {
    keyword = ""
  } else {
    keyword = keyword.trim() //剔除關鍵字前後多餘的空白
  }

  if (keyword.length > 0) {  //篩選包含關鍵字的餐廳
    restaurants = restaurantList.results.filter(restaurant => {
      return (restaurant.name.toLowerCase().includes(keyword.toLowerCase()))
    })
  } else if (category === "全部") { //如類別選擇"全部", 則出現全部餐廳資料
    restaurants = restaurantList.results
  } else {
    //篩選符合類別的餐廳
    restaurants = restaurantList.results.filter(restaurant => {
      return (restaurant.category.includes(category))
    })
  }
  //搜尋沒有結果時顯示notfound頁面提示
  if (restaurants.length === 0) {
    res.render('notfound', { keyword: keyword });
  } else {
    //搜尋有結果時顯示套用index排版顯示
    res.render('index', { restaurants: restaurants, keyword: keyword, category: category });
  }

})
//啟動伺服器
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})