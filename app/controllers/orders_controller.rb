class OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_item
  before_action :redirect_if_sold_out

  def index
    @order_form = OrdersSharedAddresses.new
  end

  def create
    @order_form = OrdersSharedAddresses.new(order_params)
    if @order_form.save
      redirect_to root_path, notice: '購入が完了しました'
    else
      render :index
    end
  end

  private

  def set_item
    @item = Item.find(params[:item_id])
  end

  def redirect_if_sold_out
    redirect_to root_path if @item.order.present?
  end

  def order_params
    params.require(:orders_shared_addresses).permit(
      :postal_code, :prefecture_id, :city, :address, :building_name, :phone_number
    ).merge(user_id: current_user.id, item_id: @item.id)
  end
end
