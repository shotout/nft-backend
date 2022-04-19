<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;
    protected $table = "wallets";
    protected $primaryKey = 'id';

    protected $fillable = [
        'uuid','name','image','created_at','updated_at'
    ];
}
