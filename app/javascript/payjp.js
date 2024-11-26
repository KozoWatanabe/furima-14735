const pay = () => {
  const publicKey = gon.public_key
  const payjp = Payjp(publicKey)
  const elements = payjp.elements();

  // カード番号入力用
  const cardNumber = elements.create("cardNumber");
  cardNumber.mount("#number-form");

  // 有効期限入力用
  const cardExpiry = elements.create("cardExpiry");
  cardExpiry.mount("#expiry-form");

  // セキュリティコード入力用
  const cardCvc = elements.create("cardCvc");
  cardCvc.mount("#cvc-form");

  // フォーム送信時のトークン生成
  const form = document.getElementById("payment-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      payjp.createToken(cardNumber).then((result) => {
        if (result.error) {
          console.error("トークン生成エラー:", result.error.message);
          const errorElement = document.getElementById("card-errors");
          if (errorElement) {
            errorElement.textContent = result.error.message;
          }
        } else {
          const tokenInput = document.createElement("input");
          tokenInput.setAttribute("type", "hidden");
          tokenInput.setAttribute("name", "token");
          tokenInput.setAttribute("value", result.id);
          form.appendChild(tokenInput);

          // 入力欄をクリア
          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();

          // フォーム送信
          form.submit();
        }
      });
    });
  } else {
    console.error("フォームが見つかりません");
  }
};

// Turbo Driveでページ読み込み時に実行
window.addEventListener("turbo:load", pay);
// ページ再描画時に実行
window.addEventListener("turbo:render", pay);