class ItemsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_item, only: [:show, :edit, :update, :destroy]
  before_action :redirect_if_not_seller, only: [:edit, :update]

  def index
    @items = Item.order(created_at: :desc)
  end

  def new
    @item = Item.new
  end

  def create
    @item = Item.new(item_params)
    if @item.save
      redirect_to root_path
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @item.update(item_params)
      redirect_to item_path(@item)
    else
      render :edit
    end
  end

  # def destroy
  #   if @item.destroy
  #     redirect_to items_path
  #   else
  #     redirect_to item_path(@item)
  #   end
  # end

  private

  def item_params
    params.require(:item).permit(
      :name, :description, :category_id, :condition_id, :shipping_cost_id,
      :prefecture_id, :shipping_time_id, :price, :image
    ).merge(user_id: current_user.id)
  end

  def set_item
    @item = Item.find(params[:id])
  end

  def redirect_if_not_seller
    return if @item.user_id == current_user.id

    redirect_to root_path
  end
end
