import { baseUrl } from "./shared.js";

const step1LoginFormError = document.querySelector(".step-1-login-form__error");
const phoneNumberInput = document.querySelector(".phone_Number_input");
const loginModal = document.querySelector(".login-modal");
const userNumberNotice = document.querySelector(".user_number_notice");
const requestTimerContainer = document.querySelector(".request_timer");
const requestTimer = document.querySelector(".request_timer span");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");

const submitNumber = async () => {
  const phoneRegex = RegExp(/^(09)[0-9]{9}$/);
  const phoneNumber = phoneNumberInput.value;
  const isValidPhoneNumber = phoneRegex.test(phoneNumber);

  console.log("Is Valid Phone ->", isValidPhoneNumber);

  if (isValidPhoneNumber) {
    step1LoginFormError.innerHTML = "";
    const res = await fetch(`${baseUrl}/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });

    if (res.status === 200) {
      loginModal.classList.add("active_step_2");
      userNumberNotice.innerHTML = phoneNumber;
      reqNewCodeBtn.style.display = "none";

      let count = 5;
      requestTimerContainer.style.display = "flex";
      requestTimer.textContent = "5";

      let timer = setInterval(() => {
        count--;
        requestTimer.textContent = count;
        if (count === 0) {
          clearInterval(timer);
          reqNewCodeBtn.style.display = "block";
          requestTimerContainer.style.display = "none";
        }
      }, 1000);
    }
  } else {
    step1LoginFormError.innerHTML = "شماره تماس وارد شده معتبر نیست";
  }
};

export { submitNumber };
