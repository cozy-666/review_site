<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class ScreenshotSeeder extends Seeder {
    public function run(): void {
        DB::transaction(function () {
        if (!app()->environment('local', 'demo') || DB::table('users')->exists()) throw new \RuntimeException('Use an empty local demo database');
        $uid = DB::table('users')->insertGetId(['name'=>'小鳥 遥','email'=>'demo@example.invalid','password'=>Hash::make('DemoOnly123!'),'email_verified_at'=>now(),'created_at'=>now(),'updated_at'=>now()]);
        foreach (['こもれび喫茶室','どうぶつ文具店'] as $name) {
            $id = DB::table('shops')->insertGetId(['name'=>$name,'location'=>'こもれび通り','description'=>'季節の雑貨と手作りの小物が並ぶ、こもれび通りのお店です。','created_by'=>$uid,'updated_by'=>$uid,'created_at'=>now(),'updated_at'=>now()]);
            DB::table('reviews')->insert(['shop_id'=>$id,'user_id'=>$uid,'rating'=>4,'comment'=>'落ち着いた雰囲気で、ゆっくり過ごせました。','created_at'=>now(),'updated_at'=>now()]);
        }
        });
    }
}
