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

      payjp.createToken(cardNumber).then((result) => {
        if (result.error) {
          // カードエラーをリストに追加
          const cardError = document.createElement("li");
          cardError.textContent = result.error.message;
          errorList.appendChild(cardError);

          cardNumber.clear();
          cardExpiry.clear();
          cardCvc.clear();
        } else {
          // トークンを取得後、サーバーへ送信
          const token = result.id;
          const formData = new FormData(form);
          formData.append("token", token);

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
                  // サーバーサイドのエラーメッセージをリストに追加
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
        }
      });
    });
  }
};

window.addEventListener("turbo:load", pay);
