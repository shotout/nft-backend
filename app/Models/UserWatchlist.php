<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserWatchlist extends Model
{
    use HasFactory;

    protected $table = 'user_watchlists';
    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo('\App\Models\Product')->with('collections');
    }
}
