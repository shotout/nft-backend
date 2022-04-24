<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public function blockchain()
    {
        return $this->hasOne('\App\Models\Blockchain', 'id', 'nft_blockchain');
    }

    public function preferance()
    {
        return $this->hasOne('\App\Models\AppPreferance');
    }

    public function community()
    {
        return $this->hasOne('\App\Models\Communities');
    }

    public function collections()
    {
        return $this->hasMany('\App\Models\Collections');
    }
}