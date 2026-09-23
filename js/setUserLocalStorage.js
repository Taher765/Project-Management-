function setUserLocalStorage(username, loginKey) {
  const info = {
    username: username,
    loginKey: loginKey,
  };
  window.localStorage.setItem("info", JSON.stringify(info));
}
function getLocalStorage(info) {
  return JSON.parse(window.localStorage.getItem(info));
}
// function clearLocalStorage(info) {
//   window.localStorage.removeItem(info);
// }
