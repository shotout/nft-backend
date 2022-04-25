<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\UserWatchlist;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function list(Request $request)
    {
        // limit
        if ($request->has('length') && $request->input('length') != '') {
            $length = $request->input('length');
        } else {
            $length = 3;
        }

        // order by field
        if ($request->has('column') && $request->input('column') != '') {
            $column = $request->input('column');
        } else {
            $column = 'nft_publish_date';
        }

        // order direction
        if ($request->has('dir') && $request->input('dir') != '') {
            $dir = $request->input('dir');
        } else {
            $dir = 'desc';
        }

        // order by
        $query = Product::with('collections','blockchain','preferance','community')
            ->whereDate('nft_publish_date', '<=', now())
            ->orderBy($column, $dir);

        // search
        if ($request->has('search') && $request->input('search') != '') {
            $query->where(function($q) use($request) {
                $q->where('field1', 'like', '%' . $request->input('search') . '%')
                    ->orWhere('field2', 'like', '%' . $request->input('search') . '%');
            });
        }

        // pagination
        $products = $query->paginate($length);

        // is watch list
        foreach ($products as $product) {
            $product->watch_list = UserWatchlist::where('user_id', auth('sanctum')->user()->id)
                ->where('product_id', $product->id)
                ->exists();
        }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    public function show($id)
    {
        // find product
        $product = Product::with('collections','blockchain','preferance','community')->where('uuid', $id)->first();

        // if not found
        if (!$product) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found',
            ]);
        }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }
}