# README

## users テーブル


|Column	            | Type	       | Options                    |
|-------------------|--------------|----------------------------|
|id                 |	bigint       |	PK                        |
|nickname	          | string	     | null: false                |
|email              |	string       | null: false, unique: true  |
|encrypted_password	| string	     | null: false                |
|first_name	        | string	     | null: false                |
|last_name          |	string	     | null: false                |
|first_name_kana    |	string	     | null: false                |
|last_name_kana	    | string       | null: false                |
|birth_date	        | date	       | null: false                |
|created_at	        |timestamp	   |default: -> { 'CURRENT_TIMESTAMP' }|

### Association
- has_many :items
- has_many :orders

## items テーブル

|Column	            | Type	       |Options                  |
|-------------------|--------------|-------------------------|
|id                 |	bigint	     | PK                      |
|name	              | string	     | null: false             |
|description        |	text	       | null: false             |
|category_id        |	integer	     | null: false             |
|condition_id	      | integer	     | null: false             |
|shipping_cost_id   |	integer	     | null: false             |
|prefecture_id	    | integer	     | null: false             |
|shipping_time_id	  | integer	     | null: false             |
|price	            | integer      | null: false             |
|user               | references   | null: false, foreign_key: true|
|created_at	        |timestamp	   |default: -> { 'CURRENT_TIMESTAMP' }|


### Association
- belongs_to :user
- has_one :order

## orders テーブル

|Column	             | Type	        | Options             |
|--------------------|--------------|---------------------|
|id                  |	bigint      |	PK                  |
|user                | references	  |null: false, foreign_key: true|
|item                | references	  |null: false, foreign_key: true|
|created_at	         | timestamp    |	default: -> { 'CURRENT_TIMESTAMP' }|


### Association
- belongs_to :user
- belongs_to :item
- has_one :shared_address

## shared_addresses テーブル

|Column              |	Type	      | Options               |
|--------------------|--------------|-----------------------|
|id                  |	bigint	    | PK                    |
|postal_code         |	string	    | null: false           |
|prefecture_id	     |  integer	    | null: false           |
|city                |	string      |	null: false           |
|address	           |  string	    | null: false           |
|building_name	     |  string	    |                       |
|phone_number        |	string	    | null: false           |
|order               |  references	|null: false, foreign_key: true|
|created_at          |	timestamp	  |default: -> { 'CURRENT_TIMESTAMP' }|


### Association
- belongs_to :order

