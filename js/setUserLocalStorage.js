function setUserLocalStorage(username, loginKey, role, id, email) {
  const info = {
    username: username,
    loginKey: loginKey,
    role: role,
    id: id,
    email: email,
  };
  window.localStorage.setItem("info", JSON.stringify(info));
}
function getLocalStorage(info) {
  return JSON.parse(window.localStorage.getItem(info));
}
