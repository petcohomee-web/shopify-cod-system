const backdrop = document.querySelector("[data-backdrop]");
const popup = document.querySelector("[data-popup]");
const openButton = document.querySelector("[data-open-popup]");
const closeButtons = document.querySelectorAll("[data-close-popup]");
const form = document.querySelector("[data-form]");
const verifyButton = document.querySelector("[data-verify-code]");
const backButton = document.querySelector("[data-back-form]");
const codeInput = document.querySelector("[data-code-input]");
const statusNode = document.querySelector("[data-status]");

const steps = {
  form: document.querySelector('[data-step="form"]'),
  code: document.querySelector('[data-step="code"]'),
  success: document.querySelector('[data-step="success"]')
};

function openPopup() {
  backdrop.hidden = false;
  popup.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePopup() {
  backdrop.hidden = true;
  popup.hidden = true;
  document.body.style.overflow = "";
  showStep("form");
  clearStatus();
  form.reset();
  codeInput.value = "";
}

function showStep(stepName) {
  Object.entries(steps).forEach(([key, element]) => {
    element.hidden = key !== stepName;
  });
}

function setStatus(message, state = "") {
  statusNode.textContent = message;
  statusNode.dataset.state = state;
}

function clearStatus() {
  statusNode.textContent = "";
  statusNode.dataset.state = "";
}

function validateForm(data) {
  if (!data.name.trim() || !data.phone.trim() || !data.address.trim()) {
    setStatus("Ad, telefon ve adres zorunludur.", "error");
    return false;
  }

  return true;
}

openButton.addEventListener("click", openPopup);
backdrop.addEventListener("click", closePopup);
closeButtons.forEach((button) => button.addEventListener("click", closePopup));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = {
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    address: String(formData.get("address") || "")
  };

  if (!validateForm(data)) {
    return;
  }

  showStep("code");
  setStatus("Fake SMS kodu gönderildi. Doğru kod: 123456", "success");
  codeInput.focus();
});

backButton.addEventListener("click", () => {
  showStep("form");
  clearStatus();
});

verifyButton.addEventListener("click", () => {
  const code = codeInput.value.trim();

  if (code !== "123456") {
    setStatus("Kod hatalı. Demo için doğru kod: 123456", "error");
    return;
  }

  showStep("success");
  setStatus("Sipariş alındı.", "success");
});