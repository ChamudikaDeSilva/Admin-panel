<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleModulePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Root'],
            ['name' => 'Admin'],
            ['name' => 'Customer'],
            ['name' => 'Supplier'],
        ];

        // Insert data into 'roles' table
        DB::table('roles')->insert($roles);
    }
}
