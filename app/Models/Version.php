<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Version extends Model
{
    use HasFactory;
    protected $table = "app_version";
    protected $primaryKey = 'id';

    protected $fillable = [
        'app_version','app_status','created_at','updated_at'
    ];
}
