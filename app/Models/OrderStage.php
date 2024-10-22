<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property int $order_id
 * @property int $stage_id
 * @property string $date_created
 * @property int $created_by_id
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereCreatedById($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereDateCreated($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereStageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStage whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class OrderStage extends Model
{
    use HasFactory;
}
