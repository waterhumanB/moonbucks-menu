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

export default store;
