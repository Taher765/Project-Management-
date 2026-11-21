const overlay = document.querySelector(".overlay");
const otpInput = document.querySelector(".otp-input");
const emailForgetPaasword = document.querySelector(".emailForgetPaasword");
const sendEmail = document.querySelector(".sendEmail");
const newPassword = document.querySelector(".newPassword");
const btnNewPassword = document.querySelector(".btnNewPassword");

// const base_url = "http://localhost:5000/api";
const base_url = "https://project-management-backend-jco6.onrender.com/api";

// Function SEND EMAIL
sendEmail.addEventListener("click", sendEmailToServer);
async function sendEmailToServer(e) {
  e.preventDefault();

  try {
    const response = await fetch(`${base_url}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailForgetPaasword.value,
      }),
    });
    const data = await response.json();

    if (data.success) {
      toastify(data.message, "#198754");
      otpInput.disabled = false;
      btnNewPassword.disabled = false;
      newPassword.disabled = false;
      disableResendForMinute();
    } else {
      console.log(data);
      toastify(data.message, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}

function disableResendForMinute() {
  let seconds = 20;
  sendEmail.disabled = true;
  emailForgetPaasword.disabled = true;

  if (sendEmail) sendEmail.textContent = ` (${seconds}ث)`;

  const interval = setInterval(() => {
    seconds--;
    if (sendEmail)
      sendEmail.textContent =
        seconds > 0 ? ` (${seconds}ث)` : "اعاده ارسال الرمز";

    if (seconds <= 0) {
      clearInterval(interval);
      sendEmail.disabled = false;
      emailForgetPaasword.disabled = false;
    }
  }, 1000);
}

// FUNCTION RESET PASSWORD
btnNewPassword.addEventListener("click", sendOtp);

async function sendOtp() {
  try {
    const response = await fetch(`${base_url}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailForgetPaasword.value,
        code: otpInput.value,
        newPassword: newPassword.value,
      }),
    });
    const data = await response.json();
    if (data.success) {
      console.log(data);
      toastify(data.message, "#198754");
      window.location = "login.html";
    } else {
      console.log(data);
      toastify(data.message, "#dc3545");
    }
  } catch (error) {
    console.log(error);
  }
}
