const pay = () => {
  const publicKey = gon.public_key;
  const payjp = Payjp(publicKey);
  const elements = payjp.elements();

  const cardNumber = elements.create("cardNumber");
  cardNumber.mount("#number-form");

  const cardExpiry = elements.create("cardExpiry");
  cardExpiry.mount("#expiry-form");

  const cardCvc = elements.create("cardCvc");
  cardCvc.mount("#cvc-form");

  const form = document.getElementById("payment-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const errorElement = document.getElementById("card-errors");
      errorElement.innerHTML = ""; // 既存のエラーメッセージをクリア

      payjp.createToken(cardNumber).then((result) => {
        if (result.error) {
          // エラーメッセージを表示
          const errorMessage = document.createElement("span");
          errorMessage.classList.add("error-message");
          errorMessage.textContent = "Token can't be blank";
          errorElement.appendChild(errorMessage);

          // 入力欄をクリア
          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();
        } else {
          const tokenInput = document.createElement("input");
          tokenInput.setAttribute("type", "hidden");
          tokenInput.setAttribute("name", "token");
          tokenInput.setAttribute("value", result.id);
          form.appendChild(tokenInput);

          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();

          form.submit();
        }
      });
    });
  }
};

window.addEventListener("turbo:load", pay);
