//還要再進階優化的地方
1.加上快取，第一次fetch，後面就用快取，但要思考快取的功能
2.按Enter鍵也能搜尋
3.地圖自動標記

YouBike即時搜索資料網站建置流程
💡1️⃣關鍵字搜尋構思
   正常搜尋關鍵字且抓得到api呼叫資料中對應得內容時，就會出站點搜尋結果資料。

   而原demo頁在沒輸入東西按搜尋不會有反應，輸入沒有在資料內的關鍵字也不會跑出查無搜尋結果，
   故要使顯示結果訊息(請輸入關鍵字、查無搜尋結果)，構思如下：

   1.調用時showEmptyMessage("請輸入關鍵字")字串傳進來變成message的值，所以在函數內：message = "請輸入關鍵字"
	 ※message的值由調用時決定。

   2.告訴網頁建立<p>，此時empty在記憶體中，經修改才加到頁面讓用戶看到

   3.empty是建的<p>，.className是其class屬性，等同<p class="empty"></p>；後面這個會用CSS加顯示文字樣式

   4.如果message="請輸入關鍵字"或"查無搜尋結果"，使<p class="empty"></p>，
   變成<p class="empty">請輸入關鍵字或查無搜尋結果</p>

   5.<p>加到<ul>，<ul><p class="empty">請輸入關鍵字</p></ul>，這時候用戶才看到結果，
   如沒有這行就只會把建立的<p>存在記憶體，但頁面看不到!
   
   6.若連續搜尋兩次，<ul>已有東西，需要清空使ul呈現結果訊息正常。
   故之後寫fetch時，前面要有 ul.innerHTML = ""; 清空

💡2️⃣把YouBike站點的資料，轉換成一個漂亮的HTML列表項<li>，

  station參數包含從API回傳的資料，篩選後留下的資訊，就算是0台也還是會呈現站點，只是可租借數量寫0。故需要以下步驟：

   1.建立站點<li>容器，調用時傳入createStationElement({sna: "YouBike2.0_八德路1號",ar: "台北市中正區八德路available_rent_bikes: 10})物件就變成參數station，並建<li>容器

   2.設定站點名稱，先建<span>標籤，存放在stationNameBox變數。
   stationNameBox = <span class="station-name"></span>

   3.加🚲、移YouBike2.0_，想像成HTML就會是<i class="fas fa-bicycle"></i>八德路1號。
   因innerHTML是取得在一個節點內的全部HTML標籤和文字；textContent則是實際取得節點中的文字內容，
   故要用innerHTML，設定HTML結構，才能呈現腳踏車圖樣。

   4.設定地址文字class，因為地址只是純文字用textContent
   addressBox = <p class="station-address">站點地址</p>

   5.設定可租借車輛數量，`(${10})`= `(10)`，使availableCountBox = <span class="available-count">(10)</span>
   會呈現括號

   6.把站點名稱、地址、可租借數量，這三個span/p元素都加進去<li>，
   再return返回完成的<li>，不然會undefined，頁面會什麼都看不到!

💡3️⃣ 加入事件監聽

  用戶點擊搜尋按鈕
  ↓ ★需preventDefault避免button預設表單提交行為（會重整頁面）， 使
  ↓   點擊按鈕時執行函數，使結果保留在頁面上

  觸發click事件
  ↓ ★需ul.innerHTML = ""; 提前清空，避免新結果加在舊結果下面
  ↓ ★顯示載入中

  執行提供的函數
  ↓ ★透過fetch函數抓取YouBike的最新資料，可進階思考快取問題(待更)

  函數內容：取得搜尋關鍵字、篩選結果、顯示結果(包含過程的載入中)

  1.先驗證是否為空字串，移除輸入前後空白，避免影響結果。需return提前結束，不執行後面的代碼。
  沒有return，下面的代碼還會執行，就會去篩空字串，導致錯誤或意外結果。
  如是空白值沒輸入內容，顯示請輸入關鍵字。

  2.如果不是空字串就篩選陣列，返回符合條件的元素，得到=[八德路1號, 八德路2號, ...]

  3.檢查篩選結果關鍵字內容是否為空，也就是資料中是否有相匹配關鍵字，如果沒有一樣的，就顯示查無搜尋結果。

  4.如果搜到一樣的關鍵字，那就把每個結果列出來，顯示每個結果，
  呼叫createStationElement()建立HTML元素，加到<ul>裡面。

  5.如果載入有問題顯示相關訊息文字

  