import { API_BASE_URL } from "../../../constants/constant.js";

const BASE_URL = `${API_BASE_URL}/users`;

async function redirectBasedOnProfile() {
  const profileRes = await fetch(`${API_BASE_URL}/users/profile-completion`, {
    method: "GET",
    credentials: "include"
  });

  const profileData = await profileRes.json();
  const percentage = profileData?.data?.profileCompletePercentage ?? profileData?.profileCompletePercentage;

  if (percentage >= 50) {
    window.location.href = "../../../index.html";
  } else {
    window.location.href = "../../profile/profile.html";
  }
}

function navigate(fromId, toId) {
  const fromPage = document.getElementById(fromId);
  const toPage = document.getElementById(toId);

  if (fromPage && toPage) {
    fromPage.classList.remove('active');
    toPage.classList.add('active');
  }
}

let registerData = {};

document.addEventListener("DOMContentLoaded", () => {

  //check is user is already logged in
  (async () => {
    try {
      const authRes = await fetch(`${API_BASE_URL}/users/current`, {
        method: "GET",
        credentials: "include"
      });

      if (authRes.ok) {
        await redirectBasedOnProfile();
      }
    } catch (err) {
      console.error(err);
    }
  })();

  //login logic
  const loginBtn = document.getElementById("btn-login-submit");
  const goToRegisterBtn = document.getElementById("btn-go-to-register");

  if (goToRegisterBtn) {
    goToRegisterBtn.addEventListener("click", () => navigate('page1', 'page2'));
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const inputs = document.querySelectorAll("#page1 input");
      const email = inputs[0].value;
      const password = inputs[1].value;

      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Login failed");
          return;
        }

        alert("Login successful ✅");
        await redirectBasedOnProfile();
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    });
  }

  //registration logic (name/email)
  const page2Next = document.getElementById("btn-register-step1-next");
  const backToLogin = document.getElementById("btn-back-to-login");

  if (backToLogin) {
    backToLogin.addEventListener("click", () => navigate('page2', 'page1'));
  }

  if (page2Next) {
    page2Next.addEventListener("click", () => {
      const inputs = document.querySelectorAll("#page2 input");
      registerData.name = inputs[0].value;
      registerData.email = inputs[1].value;
      navigate('page2', 'page3');
    });
  }

  // registration logic (DOB/Gender)
  const page3Next = document.getElementById("btn-register-step2-next");
  const backToRegister1 = document.getElementById("btn-back-to-register-step1");

  if (backToRegister1) {
    backToRegister1.addEventListener("click", () => navigate('page3', 'page2'));
  }

  if (page3Next) {
    page3Next.addEventListener("click", () => {
      const selects = document.querySelectorAll("#page3 select");
      const month = selects[0].value;
      const day = selects[1].value;
      const year = selects[2].value;
      const gender = selects[3].value;

      registerData.DOB = `${year}-${month}-${day}`;
      registerData.gender = gender;
      navigate('page3', 'page4');
    });
  }

  // registration logic (password)
  const page4Submit = document.getElementById("btn-register-final-submit");
  const backToRegister2 = document.getElementById("btn-back-to-register-step2");
  const toggleCheckbox = document.getElementById("toggle-password-checkbox");

  if (backToRegister2) {
    backToRegister2.addEventListener("click", () => navigate('page4', 'page3'));
  }

  // Password visibility toggle logic
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener("change", (e) => {
      const passInput = document.getElementById('new-password');
      const confirmInput = document.getElementById('confirm-password');
      const type = e.target.checked ? 'text' : 'password';
      if (passInput) passInput.type = type;
      if (confirmInput) confirmInput.type = type;
    });
  }

  if (page4Submit) {
    page4Submit.addEventListener("click", async () => {
      const password = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      registerData.password = password;

      try {
        const res = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData)
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Registration failed");
          return;
        }

        alert("Registered successfully 🎉");
        console.log(data);
        navigate('page4', 'page1');
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    });
  }
});