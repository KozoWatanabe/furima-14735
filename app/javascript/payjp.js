const pay = () => {
  const publicKey = gon.public_key;
  const payjp = Payjp(publicKey);
  const elements = payjp.elements();

  const cardNumber = elements.create("cardNumber");
  const cardExpiry = elements.create("cardExpiry");
  const cardCvc = elements.create("cardCvc");

  cardNumber.mount("#number-form");
  cardExpiry.mount("#expiry-form");
  cardCvc.mount("#cvc-form");

  const form = document.getElementById("payment-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const errorList = document.getElementById("errors").querySelector("ul");
      errorList.innerHTML = ""; // 既存のエラーメッセージをクリア

      // カードトークン生成
      payjp.createToken(cardNumber).then((result) => {
        let token = null;

        if (result.error) {
          // カードエラーを表示
          const cardError = document.createElement("li");
          cardError.textContent = result.error.message || "カード情報に誤りがあります。";
          errorList.appendChild(cardError);
        } else {
          // トークンが生成された場合
          token = result.id;
        }

        // サーバーへリクエストを送信
        const formData = new FormData(form);
        if (token) {
          formData.append("token", token); // トークンがある場合のみ追加
        }

        fetch("/items/" + form.dataset.itemId + "/orders", {
          method: "POST",
          headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                // サーバーエラーを表示
                data.errors.forEach((error) => {
                  const serverError = document.createElement("li");
                  serverError.textContent = error;
                  errorList.appendChild(serverError);
                });
              });
            } else {
              // 成功時にリダイレクト
              window.location.href = "/";
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    });
  }
};

window.addEventListener("turbo:load", pay);
