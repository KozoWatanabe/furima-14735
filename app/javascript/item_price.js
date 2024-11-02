const price = () => {
  // 金額を入力する場所のidセレクタ
  const priceInput = document.getElementById("item-price");
  if (!priceInput) return;

  priceInput.addEventListener("input", () => {
    const inputValue = priceInput.value;
    
    // 販売手数料(10%)を表示する場所のidセレクタ
    const addTaxDom = document.getElementById("add-tax-price");
    // 販売利益を表示する場所のidセレクタ
    const profitDom = document.getElementById("profit");

    if (inputValue) {
      // 販売手数料の計算（10%）
      const taxAmount = Math.floor(inputValue * 0.1);
      // 販売利益の計算
      const profitAmount = Math.floor(inputValue - taxAmount);

      // 計算結果をDOMに表示
      addTaxDom.innerHTML = taxAmount;
      profitDom.innerHTML = profitAmount;
    } else {
      // 入力がない場合は空白にする
      addTaxDom.innerHTML = '';
      profitDom.innerHTML = '';
    }
  });
};

// turboイベントの設定
window.addEventListener("turbo:load", price);
window.addEventListener("turbo:render", price);
