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
 * @property int $subcategory_id
 * @property int $deal_id
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal whereDealId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal whereSubcategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubcategoryDeal whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class SubcategoryDeal extends Model
{
    use HasFactory;
}
