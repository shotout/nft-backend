<?php

namespace App\Http\Controllers\Api;

use Ramsey\Uuid\Uuid;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\UserWatchlist;
use App\Http\Controllers\Controller;

class WatchlistController extends Controller
{
    public function list(Request $request)
    {
        // limit
        if ($request->has('length') && $request->input('length') != '') {
            $length = $request->input('length');
        } else {
            $length = 5;
        }

        // order by field
        if ($request->has('column') && $request->input('column') != '') {
            $column = $request->input('column');
        } else {
            $column = 'id';
        }

        // order direction
        if ($request->has('dir') && $request->input('dir') != '') {
            $dir = $request->input('dir');
        } else {
            $dir = 'desc';
        }

        // order by
        $query = UserWatchlist::where('user_id', auth('sanctum')->user()->id)
            ->with('product')
            ->orderBy($column, $dir);

        // search
        if ($request->has('search') && $request->input('search') != '') {
            $query->where(function($q) use($request) {
                $q->where('field1', 'like', '%' . $request->input('search') . '%')
                    ->orWhere('field2', 'like', '%' . $request->input('search') . '%');
            });
        }

        // pagination
        $watchList = $query->paginate($length);

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $watchList
        ]);
    }

    public function store($id)
    {
        // find product
        $product = Product::where('uuid', $id)->first();

        if (!$product) {
            return response()->json([
                'status' => 'failed',
                'message' => 'product not found',
            ]);
        }

        // add to watchlists if not exists
        $hasWatch = UserWatchlist::where('user_id', auth()->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if (!$hasWatch) {
            $wlist = new UserWatchlist;
            $wlist->uuid = Uuid::uuid4();
            $wlist->user_id = auth()->user()->id;
            $wlist->product_id = $product->id;
            $wlist->save();

            // retun response
            return response()->json([
                'status' => 'success',
                'message' => 'add data success',
            ]);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'data has exists',
            ]);
        }
    }

    public function destroy($id)
    {
        // find product
        $product = Product::where('uuid', $id)->first();

        if (!$product) {
            return response()->json([
                'status' => 'failed',
                'message' => 'product not found',
            ]);
        }

        // find watchlist
        $userWatchlist = UserWatchlist::where('user_id', auth('sanctum')->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if ($userWatchlist) {
            // delete
            $userWatchlist->delete();

            // retun response
            return response()->json([
                'status' => 'success',
                'message' => 'delete data success',
            ]);
        } else {
            // retun response
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found',
            ]);
        }
    }
}