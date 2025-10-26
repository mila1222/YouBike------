
const url =
  "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";

//Font Awesome圖樣庫提供 <i> 標籤來顯示，用const存放需要時可直接用
	const bikeIcon = '<i class="fas fa-bicycle"></i>';

//聽button點擊事件、獲取input值、向ul加入搜尋結果，所以須先選擇這三個元素	
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const ul = document.querySelector("ul");

  //沒有輸入關鍵字或查無搜尋結果時，顯示空結果訊息(請輸入關鍵字、查無搜尋結果)
  // 步驟構思詳見.README

  const showEmptyMessage = (message) => { 
    const empty = document.createElement("p"); //建立<p>
    empty.className = "empty"; //<p class="empty"></p>
    empty.textContent = message; //<p class="empty">空結果訊息</p>
    ul.appendChild(empty); //<p>加到<ul>，使可以在頁面呈現
  };


  //建立站點<li>容器，把YouBike站點資料，轉成漂亮的HTML列表項<li>
  const createStationElement = (station) => {
    const list = document.createElement("li");

    //建立站點名稱，先建<span>標籤，存放在stationNameBox變數stationNameBox = <span class="station-name"></span>
    //加腳踏車🚲<i class="fas fa-bicycle"></i>、移除YouBike2.0_

    const stationNameBox = document.createElement("span");
    stationNameBox.className = "station-name";
    stationNameBox.innerHTML = `${bikeIcon}${station.sna.replace(
      "YouBike2.0_",
      ""
    )}`;

    //設定地址文字class addressBox = <p class="station-address">站點地址</p>

    const addressBox = document.createElement("p");
    addressBox.className = "station-address";
    addressBox.textContent = station.ar;

    //設定可租借車輛數量，`(${10})`= `(10)`，使availableCountBox = <span class="available-count">(10)</span>會呈現括號

    const availableCountBox = document.createElement("span");
    availableCountBox.className = "available-count";
    availableCountBox.textContent = `(${station.available_rent_bikes})`;

    //把站點名稱、地址、可租借數量，這三個span/p元素都加進去<li>，再return返回完成的<li>，不然會undefined，頁面會什麼都看不到

    list.appendChild(stationNameBox);
    list.appendChild(availableCountBox);
    list.appendChild(addressBox);

    return list;
  };

  button.addEventListener("click", (e) => {
    e.preventDefault(); //避免button預設表單提交行為（會重整頁面）

    ul.innerHTML = ""; //提前清空，避免新結果加在舊結果下面

    const loading = document.createElement("p"); //顯示載入中
    loading.textContent = "載入中...";
    ul.appendChild(loading);

    fetch(url)
      .then((response) => response.json())
      .then((stations) => {
        ul.innerHTML = "";  // 清除載入提示
        const value = input.value; //用戶在搜尋框輸入的內容

        //驗證：空字串，移除輸入的前後空白，檢查是否為空
        if (value.trim() === "") {
          showEmptyMessage("請輸入關鍵字");
          return;
        }

        //篩選
        const stationsMatch = stations.filter((station) =>
          station.ar.includes(value)
        );

        //檢查篩選結果是否為空
        if (stationsMatch.length === 0) {
          showEmptyMessage("查無搜尋結果");
          return;
        }

        //顯示每個結果，呼叫createStationElement()建立HTML元素，加到<ul>裡面
        stationsMatch.forEach((station) => {
          const element = createStationElement(station);
          ul.appendChild(element);
        });
      })
      
      .catch((error) => {
        ul.innerHTML = "";
        showEmptyMessage("載入失敗，請稍後重試");
        console.error("錯誤詳情:", error);
      });
  });
});