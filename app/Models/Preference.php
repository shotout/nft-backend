<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Preference extends Model
{
    public $timestamps = false;
    protected $fillable = ['category', 'field', 'value'];

    public static function getAll()
    {
        $data = Cache::get('gb-preferences');
        if (empty($data)) {
            $data = parent::all();
            Cache::put('gb-preferences', $data, 30 * 86400);
        }

        return $data;
    }
}
