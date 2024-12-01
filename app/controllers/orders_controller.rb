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

    # エラーコレクションを初期化
    validation_errors = {}

    # フォームのバリデーションエラーを収集
    validation_errors.merge!(@order_form.errors.to_hash(full_messages: true)) unless @order_form.valid?

    # トークンのバリデーション
    validation_errors['token'] = ['トークンを入力してください'] if params[:token].blank?

    # すべてのエラーがない場合に処理を実行
    if validation_errors.empty?
      begin
        pay_item
        @order_form.save
        render json: { success: true }, status: :ok
      rescue Payjp::CardError => e
        render json: {
          errors: {
            card: ["カード情報に誤りがあります: #{e.message}"]
          }
        }, status: :unprocessable_entity
      rescue StandardError => e
        render json: {
          errors: {
            general: ["予期せぬエラーが発生しました: #{e.message}"]
          }
        }, status: :unprocessable_entity
      end
    else
      # すべてのエラーを返す
      render json: { errors: validation_errors }, status: :unprocessable_entity
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
    ).merge(
      user_id: current_user.id,
      item_id: @item.id,
      token: params[:token]
    )
  end

  def pay_item
    Payjp.api_key = ENV['PAYJP_SECRET_KEY']
    Payjp::Charge.create(
      amount: @item.price,
      card: order_params[:token],
      currency: 'jpy'
    )
  end
end
