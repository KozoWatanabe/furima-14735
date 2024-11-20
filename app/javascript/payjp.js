document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded イベントが発火しました");
  const publicKey = gon.public_key
  const payjp = Payjp(publicKey) // PAY.JPテスト公開鍵
  const elements = payjp.elements();

  // カード番号入力用
  const cardNumber = elements.create("cardNumber");
  cardNumber.mount("#number-form");
  console.log("カード番号入力欄がマウントされました");

  // 有効期限入力用
  const cardExpiry = elements.create("cardExpiry");
  cardExpiry.mount("#expiry-form");
  console.log("有効期限入力欄がマウントされました");

  // セキュリティコード入力用
  const cardCvc = elements.create("cardCvc");
  cardCvc.mount("#cvc-form");
  console.log("セキュリティコード入力欄がマウントされました");

  // フォーム送信時のトークン生成
  const form = document.getElementById("payment-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("フォーム送信イベントが発火しました");

      payjp.createToken(cardNumber).then((result) => {
        if (result.error) {
          console.error("トークン生成エラー:", result.error.message);
          const errorElement = document.getElementById("card-errors");
          if (errorElement) {
            errorElement.textContent = result.error.message;
          }
        } else {
          console.log("トークンが生成されました:", result.id);
          const tokenInput = document.createElement("input");
          tokenInput.setAttribute("type", "hidden");
          tokenInput.setAttribute("name", "token");
          tokenInput.setAttribute("value", result.id);
          form.appendChild(tokenInput);
          console.log("トークンがフォームに追加されました");

          // 入力欄をクリア
          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();
          console.log("カード情報がクリアされました");
          
          // フォーム送信
          form.submit();
        }
      });
    });
  } else {
    console.error("フォームが見つかりません");
  }
});
