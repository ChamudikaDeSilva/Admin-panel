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
 * @property int $order_id
 * @property int $discount_id
 * @property string $discount_amount
 * @property string $previous_price
 * @property string $current_price
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount whereCurrentPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount whereDiscountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount wherePreviousPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDiscount whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class OrderDiscount extends Model
{
    use HasFactory;
}
