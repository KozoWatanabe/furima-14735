class OrderSharedAddress
  include ActiveModel::Model
  attr_accessor :postal_code, :prefecture_id, :city, :address, :building_name, :phone_number, :item_id, :user_id, :token

  # バリデーションの記述
  with_options presence: true do
    validates :postal_code, format: { with: /\A\d{3}-\d{4}\z/, message: 'is invalid. Include hyphen(-)' }
    validates :prefecture_id, numericality: { other_than: 0, message: 'must be selected' }
    validates :city
    validates :address
    validates :phone_number, format: { with: /\A\d{10,11}\z/, message: 'is invalid' }
    validates :item_id
    validates :user_id
    validates :token
  end

  # データ保存処理
  def save
    return false unless valid?

    order = Order.create(user_id:, item_id:)

    SharedAddress.create(
      postal_code:,
      prefecture_id:,
      city:,
      address:,
      building_name:,
      phone_number:,
      order_id: order.id
    )
  end
end
