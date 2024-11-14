class OrdersController < ApplicationController
  before_action :authenticate_user!

  def index
    # 商品情報を取得（例: アイテム詳細表示時に渡す）
    @item = Item.find(params[:item_id])
  end
end
