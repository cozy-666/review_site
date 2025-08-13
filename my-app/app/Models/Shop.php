<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
        'created_by',
        'updated_by'
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shopImages()
    {
        return $this->hasMany(ShopImage::class);
    }

    public function getReviewsAvgRatingAttribute()
    {
        return round($this->reviews()->avg('rating'), 1);
    }



    public function saveShop($data)
    {
        $this->name = $data['name'];
        $this->location = $data['location'];
        $this->description = $data['description'];
        $this->created_by = $data['created_by'];
        $this->updated_by = $data['updated_by'];

        $this->save();

        return $this;
    }
    public function updateShop($data)
    {
        $shop = $this->find($data['id']);
        $shop->name = $data['name'];
        $shop->location = $data['location'];
        $shop->description = $data['description'];
        $shop->updated_by = $data['updated_by'];

        $shop->save();

        return $shop;
    }

}
