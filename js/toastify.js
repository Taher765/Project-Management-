function toastify(mes, color) {
  Toastify({
    text: mes,
    duration: 3000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: color,
      borderRadius: "10px",
    },
  }).showToast();
}
