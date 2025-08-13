<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Shop;
use App\Models\Review;


// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(20)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        Shop::factory()->count(20)->create();
        Review::factory()->count(20)->create();

    }
}
