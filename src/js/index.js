// ## 🎯 step1 요구사항 - 돔 조작과 이벤트 핸들링으로 메뉴 관리하기
// 요구 사항을 보고 만들어야할 기능들을 분석하고 목적을 알고 있어야, 다른 길에서 헤매지 않고 프로그래밍을 할 수 있다.
// 요구 사항을 분석 하면서 내가 할 수 있는 기능들과 모르는 기능들을 분리 할 수 있어, 어떤 것을 공부 해야 할지 알 수 있다.

// TODO 메뉴 추가
// - [x] 에스프레소 메뉴에 입력 받고 엔터키 입력으로 추가한다.
// - [x] 에스프레소 메뉴에 입력 받고 확인버튼 클릭 입력으로 추가한다.
// - [x] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [x] 메뉴가 추가 될 때 총 메뉴의 숫자가 count 된다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

const $ = (selector) => document.querySelector(selector);
// HTML 태그 엘리먼트를 가져 올때 $표시를 쓴다.

function App() {
  // form 태그가 자동으로 전송 되는걸 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("메뉴를 입력해주세요.");
      return;
    }

    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;

    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#espresso-menu-name").value = "";
  };

  if ($("#espresso-menu-submit-button").addEventListener("click", () => {})) {
    addMenuName();
  }

  // 메뉴의 입력 받는 곳
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

App();
// TODO 메뉴 수정
// - [ ] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 prompt 인터페이스 모달창이 뜬다.
// - [ ] prompt 인터페이스 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [ ] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제하는 confirm 인터페이스 모달창이 뜬다.
// - [ ] confirm 모달창에서 확인 및 취소 버튼 중에 확인 버튼을 누르면 삭제가 된다.
