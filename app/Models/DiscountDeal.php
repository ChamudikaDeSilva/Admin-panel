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
 * @property int $discount_id
 * @property int $deal_id
 * @property string $discount_amount
 * @property string $previous_price
 * @property string $current_price
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal query()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal whereCurrentPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal whereDealId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal whereDiscountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal wherePreviousPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscountDeal whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DiscountDeal extends Model
{
    use HasFactory;
}
