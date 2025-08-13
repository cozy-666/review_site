<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Review;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ReviewController extends Controller
{
    public function indexByUser($userId)
    {
        $user = User::find($userId);
        $reviews = Review::with('shop', 'user')
            ->where('user_id', $userId)
            ->get();
        return Inertia::render('Review/IndexByUser', [
            'reviews' => $reviews,
            'user' => $user,
        ]);
    }

    public function create($id)
    {
        $shop = Shop::find($id);
        return Inertia::render('Review/Create',[
            'shop' => $shop,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $status = "error";
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string|max:255'
        ]);

        $reviewModel=new Review();
        $review=$reviewModel->saveReview([
            'shop_id' => $request->shop_id,
            'user_id' => $user->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // ステータス
        if($review){
            $status = 'review.success';
        }
        return redirect()->route('shop.detail', [
            'id' => $request->shop_id,
            'status' => $status,
        ]);
    }

    public function edit($id)
    {
        $review = Review::with('shop')->find($id);

        $user=Auth::user();
        if($user->id !== $review->user_id)
        {
            // return redirect()->route('shop.index',[
            //     'status' => 'error',
            // ]);
            return abort(403);
        }


        return Inertia::render('Review/Edit', [
            'review' => $review,
        ]);
    }

    public function update (Request $request)
    {
        $status = "error";
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment'=> 'required|string|max:255',
        ]);

        $reviewModel = new Review();
        $review = $reviewModel->updateReview($request);

        if($review){
            $status = 'review-updated';
        }
        return redirect()->route('shop.detail', [
            'id'=>$review->shop_id,
            'status'=>$status,
        ]);
    }

    public function destroy($id)
    {
        $status = "error";
        $review = Review::find($id);
        if($review){
            $review->delete();
            $status= 'review-deleted';
        }
        return redirect()->route('shop.detail', [
            'id'=>$review->shop_id,
            'status'=>$status,
        ]);    }


}
