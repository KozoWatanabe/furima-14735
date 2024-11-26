FactoryBot.define do
  factory :order_shared_address do
    postal_code       { '123-4567' }
    prefecture_id     { Faker::Number.between(from: 2, to: 47) }
    city              { Faker::Address.city }
    address           { Faker::Address.street_address }
    building_name     { Faker::Address.secondary_address }
    phone_number      { Faker::Number.leading_zero_number(digits: 11) }
    token             { 'tok_abcdefghijk00000000000000000' }
  end
end
