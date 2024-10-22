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
 * @property int $product_id
 * @property int $deals_id
 * @property string $product_qty
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal query()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal whereDealsId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal whereProductQty($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductDeal whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ProductDeal extends Model
{
    use HasFactory;
}
