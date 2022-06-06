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
        'uuid','product_id','main_color','background_color','gradient1_color','gradient2_color','badge_color','timer_title','button_label','expired_label','created_at','updated_at'
    ];

    public function product_id()
    {
        return $this->belongsTo("App\Models\Products", 'product_id');
    }
}
