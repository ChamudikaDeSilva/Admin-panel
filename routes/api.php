<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ModulePermissionController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserManagementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Modules
Route::get('/modules/get', [ModuleController::class, 'moduleIndex']);
Route::post('/modules/create', [ModuleController::class, 'store']);
Route::delete('/modules/delete/{id}', [ModuleController::class, 'destroy']);

//Permissions
Route::get('/permissions/get', [PermissionController::class, 'permissionIndex']);
Route::post('/permissions/create', [PermissionController::class, 'store']);
Route::delete('/permissions/delete/{id}', [PermissionController::class, 'destroy']);

//Module Permissions
Route::get('roles/modules/permissions/get', [ModulePermissionController::class, 'modulePermissionIndex']);
Route::post('/module/permissions/create', [ModulePermissionController::class, 'store']);
Route::delete('/module/permissions/delete', [ModulePermissionController::class, 'destroy']);
Route::get('/module/permissions/{role}', [ModulePermissionController::class, 'fetchModulePermissions']);

//User Management
Route::post('/user/management/admins/create', [UserManagementController::class, 'createAdmin'])->name('admins.store');
Route::get('/user/management/fetch/admins', [UserManagementController::class, 'fetchAdmins']);
Route::get('/user/management/admins/edit/{id}', [UserManagementController::class, 'editAdmin'])->name('admins.edit');
Route::put('/user/management/update/admin/{id}', [UserManagementController::class, 'updateAdmin'])->name('admins.update');
Route::delete('/user/management/delete/admin/{id}', [UserManagementController::class, 'destroy'])->name('admins.delete');
Route::put('/user/management/disable/admin/{id}', [UserManagementController::class, 'toggleUserStatus'])->name('admins.disable');
Route::get('/user/management/admin/status/{id}', [UserManagementController::class, 'getAdminStatus'])->name('admins.getUserStatus');

