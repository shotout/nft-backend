<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;
    protected $table = "products";
    protected $primaryKey = 'id';

    protected $fillable = [
        'uuid','nft_title','nft_type','nft_price','nft_ammount','nft_description','nft_raffle','nft_community','nft_publish_date','is_published','created_at','updated_at','nft_blockchain','nft_mint','nft_exp_promo'
    ];

    public function blockchain()
    {
        return $this->hasMany('App\Models\products', 'product_id', 'id');
    }
}
