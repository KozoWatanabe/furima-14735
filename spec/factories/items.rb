FactoryBot.define do
  factory :item do
    name { 'Sample Item' }
    description { 'This is a sample description for the item.' }
    price { 500 }
    category_id { 2 }
    condition_id { 2 }
    shipping_cost_id { 2 }
    prefecture_id { 2 }
    shipping_time_id { 2 }
    association :user

    after(:build) do |item|
      item.image.attach(
        io: File.open(Rails.root.join('spec/fixtures/files/sample_image.jpg')),
        filename: 'sample_image.jpg',
        content_type: 'image/jpeg'
      )
    end
  end
end
