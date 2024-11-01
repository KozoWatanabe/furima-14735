class ItemsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]

  def index
  end

  def new
    @item = Item.new
  end
end

private

def item_params
  params.require(:item).permit(
    :name, :description, :category_id, :condition_id, :shipping_cost_id,
    :prefecture_id, :shipping_time_id, :price, :image
  ).merge(user_id: current_user.id)
end
