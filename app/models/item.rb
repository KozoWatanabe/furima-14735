class Item < ApplicationRecord
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :user
  has_one :order, dependent: :destroy
  has_one_attached :image
  belongs_to_active_hash :category
  belongs_to_active_hash :condition
  belongs_to_active_hash :shipping_cost
  belongs_to_active_hash :prefecture
  belongs_to_active_hash :shipping_time

  validates :name, presence: true
  validates :description, presence: true
  validates :price, presence: true,
                    numericality: { only_integer: true, greater_than_or_equal_to: 300, less_than_or_equal_to: 9_999_999 }
  validates_format_of :price, with: /\A[0-9]+\z/, message: 'は半角数値で入力してください'
  validates :image, presence: true
  validates :category_id, :condition_id, :shipping_cost_id, :prefecture_id, :shipping_time_id,
            numericality: { other_than: 0, message: 'を選択してください' }
end
