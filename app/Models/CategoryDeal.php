<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $category_id
 * @property int $deal_id
 * @property-read \App\Models\Category|null $categorydeal
 * @property-read \App\Models\Deal $deal
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal query()
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal whereDealId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryDeal whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
