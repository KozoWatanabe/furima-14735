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
      errorElement.textContent = ""; // 前回のエラーメッセージをクリア

      payjp.createToken(cardNumber).then((result) => {
        if (result.error) {
          errorElement.textContent = result.error.message; // エラーメッセージを表示
          return;
        }

        const tokenInput = document.createElement("input");
        tokenInput.setAttribute("type", "hidden");
        tokenInput.setAttribute("name", "token");
        tokenInput.setAttribute("value", result.id);
        form.appendChild(tokenInput);

        cardNumber.clear();
        cardExpiry.clear();
        cardCvc.clear();

        form.submit();
      });
    });
  }
};

window.addEventListener("turbo:load", pay);
