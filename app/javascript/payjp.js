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
  const errorElement = document.getElementById("card-errors");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // フォーム送信を一旦防ぐ

      // 各カード要素のバリデーション
      Promise.all([
        cardNumber.validate(),
        cardExpiry.validate(),
        cardCvc.validate()
      ]).then(([numberValidation, expiryValidation, cvcValidation]) => {
        // 個別のバリデーションエラーをチェック
        if (numberValidation.error || expiryValidation.error || cvcValidation.error) {
          const errorMessages = [
            numberValidation.error?.message,
            expiryValidation.error?.message,
            cvcValidation.error?.message
          ].filter(Boolean).join('\n');

          if (errorElement) {
            errorElement.textContent = errorMessages;
            errorElement.style.display = 'block';
          }
          return;
        }

        // トークン生成処理
        payjp.createToken(cardNumber).then((result) => {
          // エラー要素のリセット
          if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
          }

          if (result.error) {
            // より詳細なエラーハンドリング
            if (errorElement) {
              errorElement.textContent = result.error.message;
              errorElement.style.display = 'block';
            }
            
            // コンソールにも詳細なエラーログを出力
            console.error('Pay.jp Token Error:', result.error);
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
          console.error('Unexpected Error:', error);
        });
      });
    });
  }
};

// Turbo Drive対応のイベントリスナー
window.addEventListener("turbo:load", pay);