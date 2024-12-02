const pay = () => {
  const publicKey = gon.public_key;
  const payjp = Payjp(publicKey);
  const elements = payjp.elements();

  // カード情報の要素を作成
  const cardNumber = elements.create("cardNumber");
  const cardExpiry = elements.create("cardExpiry");
  const cardCvc = elements.create("cardCvc");

  // 要素をDOMにマウント
  cardNumber.mount("#number-form");
  cardExpiry.mount("#expiry-form");
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
          errorMessage.textContent = result.error.message; // エラー内容を表示
          errorElement.appendChild(errorMessage);

          // クレジットカード情報をクリア
          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();

          // クレジットカード要素を再度作成・マウント
          const newCardNumber = elements.create("cardNumber");
          const newCardExpiry = elements.create("cardExpiry");
          const newCardCvc = elements.create("cardCvc");

          newCardNumber.mount("#number-form");
          newCardExpiry.mount("#expiry-form");
          newCardCvc.mount("#cvc-form");

          // 古い要素を上書き
          cardNumber = newCardNumber;
          cardExpiry = newCardExpiry;
          cardCvc = newCardCvc;
        } else {
          // トークンをフォームに追加
          const tokenInput = document.createElement("input");
          tokenInput.setAttribute("type", "hidden");
          tokenInput.setAttribute("name", "token");
          tokenInput.setAttribute("value", result.id);
          form.appendChild(tokenInput);

          // クレジットカード情報をクリア
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
