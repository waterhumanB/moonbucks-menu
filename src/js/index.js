// ## 🎯 step1 요구사항 - 돔 조작과 이벤트 핸들링으로 메뉴 관리하기
// 요구 사항을 보고 만들어야할 기능들을 분석하고 목적을 알고 있어야, 다른 길에서 헤매지 않고 프로그래밍을 할 수 있다.
// 요구 사항을 분석 하면서 내가 할 수 있는 기능들과 모르는 기능들을 분리 할 수 있어, 어떤 것을 공부 해야 할지 알 수 있다.

// 인사이트
// 이벤트 위임법, 요구사항을 전략적으로 접근하는 방법, 단계별로 세세하게 나누는 것의 중요도
// DOM 요소를 가져올 때는 $표시, 새로운 메서드, insertAdjacentHtml, closest

// TODO 메뉴 추가
// - [x] 에스프레소 메뉴에 입력 받고 엔터키 입력으로 추가한다.
// - [x] 에스프레소 메뉴에 입력 받고 확인버튼 클릭 입력으로 추가한다.
// - [x] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [x] 메뉴가 추가 될 때 총 메뉴의 숫자가 count 된다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 prompt 인터페이스 모달창이 뜬다.
// - [x] prompt 인터페이스 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [x] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제하는 confirm 인터페이스 모달창이 뜬다.
// - [x] confirm 모달창에서 확인 및 취소 버튼 중에 확인 버튼을 누르면 삭제가 된다.
// - [x] 총 메뉴 갯수를 count 해서 보여준다.

// ---------------------------------------------------------------------------

// 🎯 step2 요구사항 - 상태 관리로 메뉴 관리하기
// TODO localStorage Read & wright
// -[] 메뉴를 입력한 것들을 각각 메뉴마다 localStorage에 저장하기
// -[] 메뉴를 수정하고, 삭제할 때
// -[] 저장된 localstorage 메뉴를 읽어 온다.

// TODO menu-board & 페이지 접근시 최초 데이터 read & rendering
// -[] 에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트 각각의 종류별로 메뉴판을 관리할 수 있게 만든다.
// -[] 각 메뉴판을 클릭하면 메인 메뉴판에 띄어주고, localStorage에 값들을 보여준다.
// -[] 페이지 로딩될때 localStorage에 에스프레소 메뉴를 읽어 오고, 메뉴를 그려준다.

// TODO check
// -[] 품절 상태를 체크할 수 잇는 버튼을 만들고
// -[] 버튼을 누르면 text에 글을 긋는 것을 보여주고, 다시 누르면 없애 준다.
// -[] localstorage에 true, false 상태를 넣어준다.

const $ = (selector) => document.querySelector(selector);
// HTML 태그 엘리먼트를 가져 올때 $표시를 쓴다.

// state는 한 곳에서만 관리를 해준다. localStorage도 한곳에서 관리를 하기
const store = {
  // 상태는 변할 수 있는 데이터
  setLocalStorage(menu) {
    localStorage.setItem("meun", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("meun"));
  },
};

function App() {
  this.menu = [];
  this.init = () => {
    if (store.getLocalStorage().length > 1) {
      this.menu = store.getLocalStorage();
      render();
    }
  };

  const render = () => {
    const template = this.menu
      .map((item, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${item.name}</span>
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
    $("#espresso-menu-list").innerHTML = template;
    updateMenuCounter();
  };

  const updateMenuCounter = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("메뉴를 입력해주세요.");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    this.menu.push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const editMenuName = prompt("메뉴를 수정해 주세요", $menuName.innerText);
    this.menu[menuId].name = editMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = editMenuName;
  };

  const removeMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu.splice(menuId, 1);
    store.setLocalStorage(this.menu);
    e.target.closest("li").remove();
    updateMenuCounter();
  };

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("메뉴를 삭제 하시겠습니까?")) {
        removeMenuName(e);
      }
    }
  });

  // form 태그가 자동으로 전송 되는걸 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴의 입력 받는 곳
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

const app = new App();
app.init();
