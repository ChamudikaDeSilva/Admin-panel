<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stages = [
            ['name' => 'Accepted'],
            ['name' => 'Packing'],
            ['name' => 'Out-For-Delivery'],
            ['name' => 'Delivered'],
        ];

        // Insert data into 'roles' table
        DB::table('stages')->insert($stages);
    }
}
