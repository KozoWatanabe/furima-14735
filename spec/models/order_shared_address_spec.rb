require 'rails_helper'

RSpec.describe OrderSharedAddress, type: :model do
  describe '注文情報の保存' do
    before do
      @user = FactoryBot.create(:user)
      @item = FactoryBot.create(:item, user: @user)
      @order_shared_address = FactoryBot.build(:order_shared_address, user_id: @user.id, item_id: @item.id)
    end

    context '内容に問題がない場合' do
      it 'すべての値が正しく入力されていれば保存できること' do
        expect(@order_shared_address).to be_valid
      end

      it 'building_nameは空でも保存できること' do
        @order_shared_address.building_name = ''
        expect(@order_shared_address).to be_valid
      end

      it 'tokenがあれば保存できること' do
        @order_shared_address.token = 'tok_abcdefghijk00000000000000000'
        expect(@order_shared_address).to be_valid
      end
    end

    context '内容に問題がある場合' do
      it '郵便番号が必須であること' do
        @order_shared_address.postal_code = ''
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include("Postal code can't be blank")
      end

      it '郵便番号は「3桁ハイフン4桁」の半角文字列のみ保存可能なこと' do
        @order_shared_address.postal_code = '1234567'
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include('Postal code is invalid. Include hyphen(-)')
      end

      it '都道府県が必須であること' do
        @order_shared_address.prefecture_id = 0
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include('Prefecture must be selected')
      end

      it '市区町村が必須であること' do
        @order_shared_address.city = ''
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include("City can't be blank")
      end

      it '番地が必須であること' do
        @order_shared_address.address = ''
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include("Address can't be blank")
      end

      it '電話番号が必須であること' do
        @order_shared_address.phone_number = ''
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include("Phone number can't be blank")
      end

      it '電話番号は10桁以上11桁以内の半角数値のみ保存可能なこと' do
        @order_shared_address.phone_number = '090-1234-5678'
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include('Phone number is invalid')
      end

      it '電話番号は9桁以下では保存できないこと' do
        @order_shared_address.phone_number = '090123456'
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include('Phone number is invalid')
      end

      it '電話番号は12桁以上では保存できないこと' do
        @order_shared_address.phone_number = '090123456789'
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include('Phone number is invalid')
      end

      it 'tokenが空では登録できないこと' do
        @order_shared_address.token = ''
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include("Token can't be blank")
      end

      it 'user_idが空では登録できないこと' do
        @order_shared_address.user_id = nil
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include("User can't be blank")
      end

      it 'item_idが空では登録できないこと' do
        @order_shared_address.item_id = nil
        @order_shared_address.valid?
        expect(@order_shared_address.errors.full_messages).to include("Item can't be blank")
      end
    end
  end
end
