<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppPreferance extends Model
{
    use HasFactory;
    protected $table = "app_preference";
    protected $primaryKey = 'uuid';
    
    protected $fillable = [
        'uuid','promotion_id','main_color','background_color','gradient1_color','gradient2_color','created_at','updated_at'
    ];

    public function promotion_id()
    {
        return $this->belongsTo("App\Models\Products", 'promotion_id');
    }
}
