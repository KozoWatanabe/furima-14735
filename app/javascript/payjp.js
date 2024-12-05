const pay = () => {
  const publicKey = gon.public_key; // サーバーから公開キーを取得
  const payjp = Payjp(publicKey); // PAY.JPテスト公開鍵
  const elements = payjp.elements();

  // カード情報入力欄を作成
  const numberElement = elements.create("cardNumber");
  const expiryElement = elements.create("cardExpiry");
  const cvcElement = elements.create("cardCvc");

  // 入力欄をフォームにマウント
  numberElement.mount("#number-form");
  expiryElement.mount("#expiry-form");
  cvcElement.mount("#cvc-form");

  const form = document.getElementById("payment-form"); // フォームの取得

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // フォーム送信のデフォルト動作を停止

      // トークンの作成をリクエスト
      payjp.createToken(numberElement).then((response) => {
        if (response.error) {
          // エラー処理
          const errorElement = document.getElementById("card-errors");
          errorElement.innerHTML = ""; // 既存のエラーメッセージをクリア
          const errorMessage = `<span>${response.error.message}</span>`;
          errorElement.insertAdjacentHTML("beforeend", errorMessage);
        } else {
          // トークンを作成し、フォームに追加
          const token = response.id;
          const tokenInput = `<input value=${token} name='token' type="hidden">`;
          form.insertAdjacentHTML("beforeend", tokenInput);
        }

        // フィールドをクリア
        numberElement.clear();
        expiryElement.clear();
        cvcElement.clear();

        // フォームを送信
        form.submit();
      });
    });
  }
};

// Turbo Drive用イベントリスナーの設定
window.addEventListener("turbo:load", pay);
window.addEventListener("turbo:render", pay);
