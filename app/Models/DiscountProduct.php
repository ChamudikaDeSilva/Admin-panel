<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property int $discount_id
 * @property int $product_id
 * @property string $discount_amount
 * @property string $previous_price
 * @property string $current_price
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct query()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereCurrentPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereDiscountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct wherePreviousPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountProduct whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DiscountProduct extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'discount_id'];
}
