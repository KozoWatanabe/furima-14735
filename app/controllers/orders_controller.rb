class OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_item, only: [:index, :create]
  before_action :redirect_if_sold_out, only: [:index, :create]
  before_action :redirect_if_seller, only: [:index, :create]

  def index
    gon.public_key = ENV['PAYJP_PUBLIC_KEY']
    @order_form = OrderSharedAddress.new
  end

  def create
    @order_form = OrderSharedAddress.new(order_params)
    Rails.logger.debug "Order Params: #{order_params.inspect}"

    if @order_form.valid?
      begin
        pay_item # 支払い処理を実行
        @order_form.save
        render json: { success: true }, status: :ok
      rescue Payjp::CardError => e
        # PayjpのエラーをキャッチしてJSONで返す
        render json: { errors: ["クレジットカード情報に問題があります: #{e.message}"] }, status: :unprocessable_entity
      end
    else
      # バリデーションエラーをJSONで返す
      Rails.logger.debug "Validation Errors: #{@order_form.errors.full_messages}"
      render json: { errors: @order_form.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_item
    @item = Item.find(params[:item_id])
  end

  def redirect_if_sold_out
    redirect_to root_path if @item.order.present?
  end

  def redirect_if_seller
    redirect_to root_path if @item.user_id == current_user.id
  end

  def order_params
    params.require(:order_shared_address).permit(
      :postal_code, :prefecture_id, :city, :address, :building_name, :phone_number
    ).merge(user_id: current_user.id, item_id: @item.id, token: params[:token])
  end

  def pay_item
    Payjp.api_key = ENV['PAYJP_SECRET_KEY'] # 自身のPAY.JPテスト秘密鍵を記述しましょう
    Payjp::Charge.create(
      amount: @item.price, # 商品の値段
      card: order_params[:token], # カードトークン
      currency: 'jpy' # 通貨の種類（日本円）
    )
  end
end
