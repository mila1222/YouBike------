
const url =
  "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";

//Font Awesome圖樣庫提供 <i> 標籤來顯示，用const存放需要時可直接用
	const bikeIcon = '<i class="fas fa-bicycle"></i>';

//聽button點擊事件、獲取input值、向ul加入搜尋結果，所以須先選擇這三個元素	
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const ul = document.querySelector("ul");

  //當沒有輸入關鍵字或查無搜尋結果時，顯示空結果訊息
  const showEmptyMessage = (message) => {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = message;
    ul.appendChild(empty);
  };

  //建立站點元素
  const createStationElement = (station) => {
    const list = document.createElement("li");

    const stationNameBox = document.createElement("span");
    stationNameBox.className = "station-name";
    stationNameBox.innerHTML = `${bikeIcon}${station.sna.replace(
      "YouBike2.0_",
      ""
    )}`;

    const addressBox = document.createElement("p");
    addressBox.className = "station-address";
    addressBox.textContent = station.ar;

    const availableCountBox = document.createElement("span");
    availableCountBox.className = "available-count";
    availableCountBox.textContent = `(${station.available_rent_bikes})`;

    list.appendChild(stationNameBox);
    list.appendChild(availableCountBox);
    list.appendChild(addressBox);

    return list;
  };

  button.addEventListener("click", (e) => {
    e.preventDefault();

    //提前清空
    ul.innerHTML = "";

    fetch(url)
      .then((response) => response.json())
      .then((stations) => {
        const value = input.value;

        //驗證：空字串
        if (value.trim() === "") {
          showEmptyMessage("請輸入關鍵字");
          return;
        }

        //篩選
        const stationsMatch = stations.filter((station) =>
          station.ar.includes(value)
        );

        //驗證：無結果
        if (stationsMatch.length === 0) {
          showEmptyMessage("查無搜尋結果");
          return;
        }

        //顯示結果
        stationsMatch.forEach((station) => {
          const element = createStationElement(station);
          ul.appendChild(element);
        });
      });
  });
});