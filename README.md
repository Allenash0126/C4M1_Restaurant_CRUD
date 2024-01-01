#  我的餐廳清單 (Restaurant List)


## 功能
- 使用者可以新增一家餐廳
- 使用者可以瀏覽一家餐廳的詳細資訊
- 使用者可以瀏覽全部所有餐廳
- 使用者可以修改一家餐廳的資訊
- 使用者可以刪除一家餐廳

### 安裝
- 取得相關github資源：
https://github.com/Allenash0126/C4M1_Restaurant_CRUD.git

- 進入該路徑：
cd C4M1_Restaurant_CRUD

- 安裝 npm：
npm install

-  MySQL server 連線之預設設定如下：
host: '127.0.0.1'  // localhost
username: 'root'
password: 'password'
database: 'restaurant'

- 分別執行資料庫建立、資料表建立、匯入種子資料：
npx sequelize db:migrate
npx sequelize db:seed:all

- 啟動專案： 
npm run dev

- 打開瀏覽器：
enter http://localhost:3000
you will see: express server is running on http://localhost:3000

### 工具（Tools）
- Visual Studio Code
- Express
- Express-Handlebars