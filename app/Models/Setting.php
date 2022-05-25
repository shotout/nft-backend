<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;
    protected $table = "app_setting";
    protected $primaryKey = 'id';

    protected $fillable = [
        'skip_button'
    ];

}
