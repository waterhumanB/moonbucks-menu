import $ from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index";

// ## 🎯 step3 요구사항 - 서버와의 통신을 통해 메뉴 관리하기

// - [ ] [링크](https://github.com/blackcoffee-study/moonbucks-menu-server)에 있는 웹 서버 저장소를 clone하여 로컬에서 웹 서버를 실행시킨다.
// - [ ] 웹 서버를 띄워서 실제 서버에 데이터의 변경을 저장하는 형태로 리팩터링한다.
//   - [ ] localStorage에 저장하는 로직은 지운다.
//   - [ ] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
//   - [ ] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.
// - [ ] 중복되는 메뉴는 추가할 수 없다.

// TODO API 서버 요청
// -[x] 웹 서버를 띄운다.
// -[x] 서버에 새로운 메뉴명을 추가될 수 있도록 post 요청
// -[x] 서버에 카테고리별 메뉴리스트 get 요청
// -[x] 서버에 메뉴 이름이 수정될 수 있도록 put 요청
// -[x] 서버에 메뉴의 품절 상태를 토글 될 수 있도록 put 요청
// -[] 서버에 메뉴를 삭제 될 수 있도록 delete 요청한다.

// TODO 리펙토링 부분
// -[x] localSTorage에 저장하는 로직을 지운다.
// -[x] fetch 비동기 api를 사용하는 부분을 async await를 사용하여 구현한다.

// TODO 사용자 경험
// -[] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 한다.
// -[] 중복되는 메뉴는 추가할 수 없다.

const initData = {
  espresso: [],
  frappuccino: [],
  blended: [],
  teavana: [],
  desert: [],
};

function App() {
  this.menu = initData;
  this.currentCategory = "espresso";
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `<li data-menu-id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${
          item.isSoldOut ? "sold-out" : ""
        }">${item.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
    </li>`;
      })
      .join("");
    $("#menu-list").innerHTML = template;
    updateMenuCounter();
  };

  const updateMenuCounter = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("메뉴를 입력해주세요.");
      return;
    }
    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);

    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );

    render();
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴를 수정해 주세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updateMenuName, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );

    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("메뉴를 삭제 하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory
      );
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    // form 태그가 자동으로 전송 되는걸 막아준다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 입력 받는 곳
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", async (e) => {
      const isCategoryBtn = e.target.classList.contains("cafe-category-name");
      if (isCategoryBtn) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
          this.currentCategory
        );
        render();
      }
    });
  };
}

const app = new App();
app.init();
