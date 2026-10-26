<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class ScreenshotSeeder extends Seeder {
    public function run(): void {
        DB::transaction(function () {
        if (!app()->environment('local') || DB::table('users')->exists()) throw new \RuntimeException('Use an empty local demo database');
        $uid = DB::table('users')->insertGetId(['name'=>'架空利用者A','email'=>'demo@example.invalid','password'=>Hash::make('DemoOnly123!'),'email_verified_at'=>now(),'created_at'=>now(),'updated_at'=>now()]);
        foreach (['架空の喫茶室A','架空の雑貨店B'] as $name) {
            $id = DB::table('shops')->insertGetId(['name'=>$name,'location'=>'架空エリア','description'=>'画面撮影専用の架空店舗です。','created_by'=>$uid,'updated_by'=>$uid,'created_at'=>now(),'updated_at'=>now()]);
            DB::table('reviews')->insert(['shop_id'=>$id,'user_id'=>$uid,'rating'=>4,'comment'=>'撮影用の架空レビューです。','created_at'=>now(),'updated_at'=>now()]);
        }
        });
    }
}
