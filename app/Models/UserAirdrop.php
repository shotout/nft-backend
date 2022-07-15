<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAirdrop extends Model
{
    protected $table = 'user_airdrops';
    use HasFactory;
    
    public function product()
    {
        return $this->belongsTo('\App\Models\Product')->with('collections');
    }
}
