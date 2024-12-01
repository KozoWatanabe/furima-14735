const pay = () => {
  const publicKey = gon.public_key;
  const payjp = Payjp(publicKey, { locale: "ja" });
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
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // エラーエリアをクリア
      const cardErrorsContainer = document.getElementById("card-errors");
      const addressErrorsContainer = document.getElementById("address-errors");
      cardErrorsContainer.innerHTML = "";
      addressErrorsContainer.innerHTML = "";

      try {
        // Pay.jpのトークン作成
        const result = await payjp.createToken(cardNumber);

        if (result.error) {
          // カードエラーがある場合
          const cardErrorLi = document.createElement("li");
          cardErrorLi.textContent = result.error.message;
          cardErrorsContainer.appendChild(cardErrorLi);
          return;
        }

        // トークンを隠しフィールドに追加
        const tokenInput = document.createElement("input");
        tokenInput.setAttribute("type", "hidden");
        tokenInput.setAttribute("name", "token");
        tokenInput.setAttribute("value", result.id);
        form.appendChild(tokenInput);

        // フォームデータ送信
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          // 注文成功
          window.location.href = '/order_completed'; // 注文完了ページへリダイレクト
        } else {
          // エラーがある場合
          if (data.errors) {
            // エラーメッセージを追加
            Object.values(data.errors).flat().forEach(message => {
              const errorLi = document.createElement("li");
              errorLi.textContent = message;
              
              // カードエラーかアドレスエラーかを判定して適切なコンテナに追加
              if (message.includes('カード') || message.includes('Token')) {
                cardErrorsContainer.appendChild(errorLi);
              } else {
                addressErrorsContainer.appendChild(errorLi);
              }
            });
          }
        }
      } catch (error) {
        console.error('予期せぬエラー:', error);
        const generalErrorLi = document.createElement("li");
        generalErrorLi.textContent = "処理中にエラーが発生しました。再度お試しください。";
        cardErrorsContainer.appendChild(generalErrorLi);
      }
    });
  }
};

window.addEventListener("turbo:load", pay);