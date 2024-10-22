<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property int $order_id
 * @property int $deliveryman_id
 * @property int $customer_id
 * @property string $deliveryman_name
 * @property string $status
 * @property string $delivery_address
 * @property string|null $delivery_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereDeliveryAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereDeliveryDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereDeliverymanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereDeliverymanName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderDelivery whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class OrderDelivery extends Model
{
    use HasFactory;
}
