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
 * @property int $module_id
 * @property int $permission_id
 * @property int $role_id
 * @property string $name
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission query()
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission whereModuleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission wherePermissionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModulePermission whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ModulePermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_id',
        'module_id',
        'permission_id',
        'name',
    ];
}
