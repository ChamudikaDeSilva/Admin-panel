<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'description',
        'quantity',
        'unit_price',
        'isAvailable',
        'image',
        'category_id',
        'image'

    ];

    protected $casts = [
        'isAvailable' => 'boolean',
    ];
}
