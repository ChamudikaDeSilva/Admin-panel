<?php

namespace App\Policies;

use App\Models\Module;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\DB;

class ModulePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Module $module)
    {
        $permissionName='Module_View';

        return DB::table('module_permissions')
        ->where('role_id',$user->role_id)
        ->where('name',$permissionName)
        ->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user,Module $module)
    {
        $permissionName='Module_Create';

        return DB::table('module_permissions')
        ->where('role_id',$user->role_id)
        ->where('name',$permissionName)
        ->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Module $module)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Module $module)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Module $module)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Module $module)
    {
        //
    }
}
