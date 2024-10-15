<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryDeal extends Model
{
    use HasFactory;

    public function categorydeal()
    {
        return $this->belongsTo(Category::class);
    }

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}
