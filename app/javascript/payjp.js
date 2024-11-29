const pay = () => {
  const publicKey = gon.public_key;
  const payjp = Payjp(publicKey);
  const elements = payjp.elements();

  // カード情報の入力欄を作成
  const cardNumber = elements.create("cardNumber");
  cardNumber.mount("#number-form");

  const cardExpiry = elements.create("cardExpiry");
  cardExpiry.mount("#expiry-form");

  const cardCvc = elements.create("cardCvc");
  cardCvc.mount("#cvc-form");

  // フォームの取得
  const form = document.getElementById("payment-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // フォーム送信を一旦防ぐ

      payjp.createToken(cardNumber).then((result) => {
        if (result.error) {
          // エラーが発生した場合
          const errorElement = document.getElementById("card-errors");
          if (errorElement) {
            errorElement.textContent = result.error.message; // エラーメッセージを表示
          }
        } else {
          // トークン生成成功時
          const tokenInput = document.createElement("input");
          tokenInput.setAttribute("type", "hidden");
          tokenInput.setAttribute("name", "token");
          tokenInput.setAttribute("value", result.id);
          form.appendChild(tokenInput);

          // 入力欄をクリア
          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();

          // フォーム送信を再開
          form.submit();
        }
      });
    });
  }
};

// Turbo Drive対応のイベントリスナー
window.addEventListener("turbo:load", pay);
