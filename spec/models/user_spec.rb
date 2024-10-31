require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    @user = FactoryBot.build(:user)
  end

  describe 'ユーザー新規登録' do
    context '新規登録できるとき' do
      it 'nicknameとemail、passwordとpassword_confirmationが存在すれば登録できる' do
        expect(@user).to be_valid
      end
    end

    context '新規登録できないとき' do
      it 'nicknameが空では登録できない' do
        @user.nickname = ''
        @user.valid?
        expect(@user.errors.full_messages).to include "Nickname can't be blank"
      end

      it 'emailが空では登録できない' do
        @user.email = ''
        @user.valid?
        expect(@user.errors.full_messages).to include "Email can't be blank"
      end

      it '重複したemailが存在する場合は登録できない' do
        @user.save
        another_user = FactoryBot.build(:user, email: @user.email) # emailのみ重複
        another_user.valid?
        expect(another_user.errors.full_messages).to include('Email has already been taken')
      end

      it 'emailは@を含まないと登録できない' do
        @user.email = 'testmail'
        @user.valid?
        expect(@user.errors.full_messages).to include('Email is invalid')
      end

      it 'passwordが必須である' do
        @user.password = nil
        @user.password_confirmation = nil
        @user.valid?
        expect(@user.errors.full_messages).to include("Password can't be blank")
      end

      it 'passwordが5文字以下では登録できない' do
        @user.password = '00000'
        @user.password_confirmation = '00000'
        @user.valid?
        expect(@user.errors.full_messages).to include('Password is too short (minimum is 6 characters)')
      end

      it 'passwordとpassword_confirmationが不一致では登録できない' do
        @user.password = '123456'
        @user.password_confirmation = '1234567'
        @user.valid?
        expect(@user.errors.full_messages).to include("Password confirmation doesn't match Password")
      end

      it '英字のみのパスワードでは登録できない' do
        @user.password = 'abcdef' # 英字のみ
        @user.password_confirmation = 'abcdef'
        @user.valid?
        expect(@user.errors.full_messages).to include('Password は半角英数字混合で入力してください')
      end

      it '数字のみのパスワードでは登録できない' do
        @user.password = '123456' # 数字のみ
        @user.password_confirmation = '123456'
        @user.valid?
        expect(@user.errors.full_messages).to include('Password は半角英数字混合で入力してください')
      end

      it '全角文字を含むパスワードでは登録できない' do
        @user.password = 'ａｂｃ123' # 全角文字を含む
        @user.password_confirmation = 'ａｂｃ123'
        @user.valid?
        expect(@user.errors.full_messages).to include('Password は半角英数字混合で入力してください')
      end
    end
    context '姓・名（全角）のバリデーション' do
      it '姓（全角）が空だと登録できない' do
        @user.last_name = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("Last name can't be blank")
      end

      it '姓（全角）に半角文字が含まれていると登録できない' do
        @user.last_name = 'Yamada'
        @user.valid?
        expect(@user.errors.full_messages).to include('Last name must be full-width Japanese characters')
      end

      it '名（全角）が空だと登録できない' do
        @user.first_name = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("First name can't be blank")
      end

      it '名（全角）に半角文字が含まれていると登録できない' do
        @user.first_name = 'Taro'
        @user.valid?
        expect(@user.errors.full_messages).to include('First name must be full-width Japanese characters')
      end
    end
    context '姓・名（カナ）のバリデーション' do
      it '姓（カナ）が空だと登録できない' do
        @user.last_name_kana = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("Last name kana can't be blank")
      end

      it '姓（カナ）にカタカナ以外の文字（平仮名・漢字・英数字・記号）が含まれていると登録できない' do
        @user.last_name_kana = 'やまだ'
        @user.valid?
        expect(@user.errors.full_messages).to include('Last name kana must be full-width Katakana characters')

        @user.last_name_kana = '山田'
        @user.valid?
        expect(@user.errors.full_messages).to include('Last name kana must be full-width Katakana characters')

        @user.last_name_kana = 'YAMADA'
        @user.valid?
        expect(@user.errors.full_messages).to include('Last name kana must be full-width Katakana characters')

        @user.last_name_kana = 'やま@だ'
        @user.valid?
        expect(@user.errors.full_messages).to include('Last name kana must be full-width Katakana characters')
      end

      it '名（カナ）が空だと登録できない' do
        @user.first_name_kana = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("First name kana can't be blank")
      end

      it '名（カナ）にカタカナ以外の文字（平仮名・漢字・英数字・記号）が含まれていると登録できない' do
        @user.first_name_kana = 'たろう'
        @user.valid?
        expect(@user.errors.full_messages).to include('First name kana must be full-width Katakana characters')

        @user.first_name_kana = '太郎'
        @user.valid?
        expect(@user.errors.full_messages).to include('First name kana must be full-width Katakana characters')

        @user.first_name_kana = 'TARO'
        @user.valid?
        expect(@user.errors.full_messages).to include('First name kana must be full-width Katakana characters')

        @user.first_name_kana = 'たろ@う'
        @user.valid?
        expect(@user.errors.full_messages).to include('First name kana must be full-width Katakana characters')
      end
    end
    context '生年月日のバリデーション' do
      it '生年月日が空だと登録できない' do
        @user.birth_date = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("Birth date can't be blank")
      end
    end
  end
end
