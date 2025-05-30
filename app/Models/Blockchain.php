<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blockchain extends Model
{
    use HasFactory;
    protected $table = "blockchains";
    protected $primaryKey = 'id';

    protected $fillable = [
        'uuid','name','vektor','created_at','updated_at'
    ];
}
