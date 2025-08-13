<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\Review;
use App\Models\ShopImage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Nette\Utils\Random;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $status = request('status');

        // 店舗の前件を取得
        $query = Shop::with('reviews', 'shopImages')
        ->withCount('reviews')
        ->withAvg('reviews', 'rating');

        //検索条件がある場合
        if($request->has('search')){
            $search = $request->search;
            $query ->with('reviews', 'shopImages')->where('name', 'like', '%'.$search.'%')
                ->orWhere('location', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%');
        }
        $shops = $query->paginate(10);

        //新着のレビューを5件取得
        $newReviews = Review::with('shop', 'user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Home', [
            'shops' => $shops,
            'newReviews' => $newReviews,
            'status' => $status
        ]);
    }

    public function indexByUser($userId)
    {
        $user = User::find($userId);
        $shops = Shop::with("shopImages")
        ->where('created_by', $userId)->orWhere('updated_by', $userId)->get();
        return Inertia::render('Shop/IndexByUser', [
            'shops' => $shops,
            'user' => $user,
        ]);

    }

    public function detail($id)
    {
        $shop = shop::with('ShopImages')->find($id);
        //クエリパラメータからステータスを取得
        $status = request('status');
        //作成者と更新者のユーザーデータを取得
        $createdUser = User::find($shop->created_by);
        $updatedUser = User::find($shop->updated_by);
        //レビューを取得
        $reviews = Review::with('user', 'shop.shopImages')
            ->where('shop_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Shop/Detail', [
            'shop' => $shop,
            'createdUser' => $createdUser,
            'updatedUser' => $updatedUser,
            'reviews' => $reviews,
            'status' => $status
        ]);
    }

    public function create()
    {
        return Inertia::render('Shop/Create');
    }

    public function store(Request $request)
    {

        $user = Auth::user();
        if (!$user) {
            return redirect()->route('loging');
        }
        $status = "error";

        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);


        DB::beginTransaction();

        try {
            $shopModel = new Shop();
            $shop = $shopModel->saveShop([
                'name' => $request->name,
                'location' => $request->location,
                'description' => $request->description,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
            if ($request->file('images')) {
                $images = $request->file('images');
                foreach ($images as $image) {
                    $extention = $image->getClientOriginalExtension();
                    $random = Random::generate(16);
                    $fileName = $shop->id . '_' . $random . '.' . $extention;
                    $shopImageModel = new ShopImage();
                    $shopImageModel->saveImage([
                        'shop_id' => $shop->id,
                        'file_name' => $fileName,
                        'file_path' => 'storage/shop_images/' . $fileName,
                        'file_type' => $image->getClientMimeType(),
                        'file_size' => $image->getSize(),
                        'file_extension' => $extention,
                        'file_mime' => $image->getClientMimeType(),
                        'file_original_name' => $image->getClientOriginalName(),
                        'file_original_path' => $image->getPathname()
                    ]);
                    $image->storeAs('shop_images', $fileName, 'public');
                }
            }
            DB::commit();
            $status = 'shop-created';
        } catch (\Exception $e) {
            $message = $e->getMessage();
            Log::error($message);
            DB::rollBack();
            throw $e;
        }

        if ($shop) {
            $status = 'shop-created';
        }
        return redirect()->route('shop.index', [
            'id' => $shop->id,
            'status' => $status,
        ]);
    }

    public function edit($id)
    {
        $shop = Shop::with('shopImages')->find($id);
        return Inertia::render('Shop/Edit', [
            'shop' => $shop,
        ]);
    }

    public function update(Request $request)
    {
        $status = "error";
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $shopModel = new Shop();
            $shop = $shopModel->updateShop([
                'id' => $request->id,
                'name' => $request->name,
                'location' => $request->location,
                'description' => $request->description,
                'updated_by' => Auth::id(),
            ]);

            //既存画像の削除
            if($request->existingImages)
            {
                $existingImages = $request->existingImages;
                //画像のIDのみを取得
                $existingImageIds = array_column($existingImages, 'id');
                // DB::table('shop_images')->whereIn('id', $existingImageIds)->delete();

                $arrayShopImageIds = DB::table('shop_images')->whereIn('shop_id', $shop->id)->get(['id'])->toArray();
                $shopImageIds = array_column($arrayShopImageIds, 'id');
                $deleteImageIds = array_diff($shopImageIds, $existingImageIds);

                if(count($deleteImageIds) > 0){
                    DB::table('shop_images')->whereIn('id', $deleteImageIds)->delete();
                }

            }

            //新規画像の登録
            if ($request->file('images')) {
                $images = $request->file('images');
                foreach ($images as $image) {
                    $extention = $image->getClientOriginalExtension();
                    $random = Random::generate(16);
                    $fileName = $shop->id . '_' . $random . '.' . $extention;
                    $shopImageModel = new ShopImage();
                    $shopImageModel->saveImage([
                        'shop_id' => $shop->id,
                        'file_name' => $fileName,
                        'file_path' => 'storage/shop_images/' . $fileName,
                        'file_type' => $image->getClientMimeType(),
                        'file_size' => $image->getSize(),
                        'file_extension' => $extention,
                        'file_mime' => $image->getClientMimeType(),
                        'file_original_name' => $image->getClientOriginalName(),
                        'file_original_path' => $image->getPathname()
                    ]);
                    $image->storeAs('shop_images', $fileName, 'public');
                }
            }
            DB::commit();
            $status = 'shop-updated';
        } catch (\Exception $e) {
            $message = $e->getMessage();
            Log::error($message);
            DB::rollBack();
            throw $e;
        }
        return redirect()->route('shop.detail', [
            'id' => $shop->id,
            'status' => $status,
        ]);
    }

    public function destroy($id)
    {
        $status = "error";
        $shop = Shop::find($id);

        if (!$shop) {
            return redirect()->route('shop.index')->with('error', '店舗が見つかりません');
        }

        DB::beginTransaction();
        try {
            // 関連する画像を削除
            $shopImages = ShopImage::where('shop_id', $id)->get();
            if ($shopImages->count() > 0) {
                // ファイルも削除する場合
                foreach ($shopImages as $image) {
                    // 実際のファイルを削除
                    if (Storage::disk('public')->exists('shop_images/' . $image->file_name)) {
                        Storage::disk('public')->delete('shop_images/' . $image->file_name);
                    }
                }

                // データベースから画像レコードを削除
                ShopImage::where('shop_id', $id)->delete();
            }

            // 関連するレビューを削除
            Review::where('shop_id', $id)->delete();

            // 店舗を削除
            $shop->delete();

            DB::commit();
            $status = 'shop-deleted';

            return redirect()->route('shop.index')->with('status', $status);
        } catch (\Exception $e) {
            $message = $e->getMessage();
            Log::error($message);
            DB::rollBack();

            return redirect()->route('shop.index')->with('error', '削除に失敗しました');
        }
    }
}
