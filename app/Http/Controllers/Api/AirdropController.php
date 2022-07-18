<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\UserAirdrop;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class AirdropController extends Controller
{
    public function store($id)
    {
       try
        {
            $user = User::where('id', auth('sanctum')->user()->id)->first();
            $product = Product::where('id', $id)->first();

            //check user
            if(!$user)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ]);
            }

            //check product
            if(!$product)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found'
                ]);
            }

            $checkairdrop = UserAirdrop::where('user_id', $user->id)->where('product_id', $product->id)->first();

            if($checkairdrop)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already airdropped this product'
                ]);
            }

            $airdrop = new UserAirdrop();
            $airdrop->Uuid = Uuid::uuid4();
            $airdrop->user_id = $user->id;
            $airdrop->product_id = $product->id;
            $airdrop->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Users Airdrop created successfully'
            ]);
        }
        catch (\Exception $e)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ]);
            }
    }

    public function check ($id)
    {
        try
        {
        
            $user = User::where('id',auth('sanctum')->user()->id)->first();
            
            //check if user has airdroped this product
            $check = UserAirdrop::where('user_id', $user->id)->where('product_id', $id)->first();

            if($check)
            {
                return response()->json([
                    'status' => 'success',
                    'message' => 'User has airdropped this product'
                ]);
            }
            else
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User has not airdropped this product'
                ]);
            }

            
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
