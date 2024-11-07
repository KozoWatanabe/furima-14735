class ItemsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]

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
    @item = Item.find(params[:id])
  end

  # def edit
    # @item = Item.find(params[:id])
  # end

  # def destroy
    # @item = Item.find(params[:id])
    # if @item.destroy
      # redirect_to items_path
    # else
      # redirect_to item_path(@item)
    # end
  # end

  private

  def item_params
    params.require(:item).permit(
      :name, :description, :category_id, :condition_id, :shipping_cost_id,
      :prefecture_id, :shipping_time_id, :price, :image
    ).merge(user_id: current_user.id)
  end
end
