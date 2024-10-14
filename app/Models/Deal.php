<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function discounts()
    {
        return $this->belongsToMany(Discount::class);
    }

    public function category()
    {
        return $this->belongsToMany(Category::class);
    }
}
