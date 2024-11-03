# spec/models/item_spec.rb

require 'rails_helper'

RSpec.describe Item, type: :model do
  before do
    @item = FactoryBot.build(:item)
  end

  describe '商品出品機能' do
    context '出品が成功する場合' do
      it '全ての属性が正しく存在する場合は有効である' do
        expect(@item).to be_valid
      end
    end

    context '出品が失敗する場合' do
      it '名前がないと無効である' do
        @item.name = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Name can't be blank")
      end

      it '説明がないと無効である' do
        @item.description = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Description can't be blank")
      end

      it '価格が存在しない場合は無効である' do
        @item.price = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Price can't be blank")
      end

      it '価格が300円未満の場合は無効である' do
        @item.price = 299
        @item.valid?
        expect(@item.errors.full_messages).to include('Price must be greater than or equal to 300')
      end

      it '価格が9,999,999円を超える場合は無効である' do
        @item.price = 10_000_000
        @item.valid?
        expect(@item.errors.full_messages).to include('Price must be less than or equal to 9999999')
      end

      it 'カテゴリーが選択されていない場合は無効である' do
        @item.category_id = 0
        @item.valid?
        expect(@item.errors.full_messages).to include('Category を選択してください')
      end

      it '状態が選択されていない場合は無効である' do
        @item.condition_id = 0
        @item.valid?
        expect(@item.errors.full_messages).to include('Condition を選択してください')
      end

      it '配送料負担が選択されていない場合は無効である' do
        @item.shipping_cost_id = 0
        @item.valid?
        expect(@item.errors.full_messages).to include('Shipping cost を選択してください')
      end

      it '発送元地域が選択されていない場合は無効である' do
        @item.prefecture_id = 0
        @item.valid?
        expect(@item.errors.full_messages).to include('Prefecture を選択してください')
      end

      it '発送日数が選択されていない場合は無効である' do
        @item.shipping_time_id = 0
        @item.valid?
        expect(@item.errors.full_messages).to include('Shipping time を選択してください')
      end

      it '画像が存在しない場合は無効である' do
        @item.image = nil
        @item.valid?
        expect(@item.errors.full_messages).to include("Image can't be blank")
      end

      it 'userが紐づいていない場合は無効である' do
        @item.user = nil
        @item.valid?
        expect(@item.errors.full_messages).to include('User must exist')
      end

      it '価格に半角数値以外が含まれている場合は無効である' do
        @item.price = '３００' # 全角数字を設定
        @item.valid?
        expect(@item.errors.full_messages).to include('Price is not a number')
      end
    end
  end
end
