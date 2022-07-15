<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\UserAirdrop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;

class AirdropController extends Controller
{
    public function store(Request $request)
    {
       try
        {
            //validate
            $validator = Validator::make($request->all(), [
                'product_id' => 'required',
                'user_id' => 'required',
            ]);

            $validator->validate();

            $user = User::find($request->user_id);
            $product = Product::find($request->product_id);

            if(!$user || !$product)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User or Product not found'
                ]);
            }

            $airdrop = new UserAirdrop();
            $airdrop->Uuid = Uuid::uuid4();
            $airdrop->user_id = $user->id;
            $airdrop->product_id = $product->id;
        }
        catch (\Exception $e)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ]);
            }
    }
}
