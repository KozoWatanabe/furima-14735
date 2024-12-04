const pay = () => {
  const publicKey = gon.public_key; // サーバーから公開キーを取得
  const payjp = Payjp(publicKey); // Payjpオブジェクトの初期化
  const elements = payjp.elements();

  const cardNumber = elements.create("cardNumber"); // カード番号フィールド
  cardNumber.mount("#number-form");

  const cardExpiry = elements.create("cardExpiry"); // 有効期限フィールド
  cardExpiry.mount("#expiry-form");

  const cardCvc = elements.create("cardCvc"); // セキュリティコードフィールド
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
          errorMessage.textContent = result.error.message; // APIからのエラー内容を表示
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

// Turbo Drive用イベントリスナーの設定
document.addEventListener("turbo:load", pay); // ページロード時にpayを実行
document.addEventListener("turbo:render", pay); // Turboで再レンダリングされた際にpayを実行
