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

  // フォームと各入力欄の取得
  const form = document.getElementById("payment-form");
  const errorElement = document.getElementById("card-errors");
  const numberInput = document.getElementById("number-form");
  const expiryInput = document.getElementById("expiry-form");
  const cvcInput = document.getElementById("cvc-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // フォーム送信を一旦防ぐ

      payjp.createToken(cardNumber).then((result) => {
        if (result.error) {
          // エラーが発生した場合
          if (errorElement) {
            errorElement.textContent = result.error.message; // エラーメッセージを表示
            errorElement.style.display = 'block'; // エラーメッセージを可視化
          }

          // 全ての入力欄をクリア
          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();

          // オプション: 入力欄にフォーカスを戻す
          cardNumber.focus();
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
      }).catch((error) => {
        // 予期せぬエラーのハンドリング
        if (errorElement) {
          errorElement.textContent = 'システムエラーが発生しました。もう一度お試しください。';
          errorElement.style.display = 'block';
        }

        // 全ての入力欄をクリア
        cardNumber.clear();
        cardExpiry.clear();
        cardCvc.clear();

        console.error('Unexpected Error:', error);
      });
    });
  }
};

// Turbo Drive対応のイベントリスナー
window.addEventListener("turbo:load", pay);