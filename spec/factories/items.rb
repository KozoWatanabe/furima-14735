FactoryBot.define do
  factory :item do
    name { 'Sample Item' }
    description { 'This is a sample description for the item.' }
    price { 500 }
    category_id { 1 }          # 有効なカテゴリーIDを指定
    condition_id { 1 }         # 有効な状態IDを指定
    shipping_cost_id { 1 }     # 有効な配送料負担IDを指定
    prefecture_id { 1 }        # 有効な都道府県IDを指定
    shipping_time_id { 1 }     # 有効な発送日数IDを指定
    association :user          # `user`ファクトリを用いた関連付け

    # テスト時の画像添付
    after(:build) do |item|
      item.image.attach(
        io: File.open(Rails.root.join('spec/fixtures/files/sample_image.jpg')),
        filename: 'sample_image.jpg',
        content_type: 'image/jpeg'
      )
    end
  end
end
