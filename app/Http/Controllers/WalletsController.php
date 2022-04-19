<?php

namespace App\Http\Controllers;

use App\DataTables\WalletsListDataTable;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;
use RealRashid\SweetAlert\Facades\Alert;
use Intervention\Image\Facades\Image;

class WalletsController extends Controller
{
    public function index(WalletsListDataTable $dataTable)
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'wallets';
        $data['page_title'] = __('Wallets');
        $data['total_wallet'] = Wallet::all()->count();
        

        $row_per_page = 10;

        return $dataTable->with('row_per_page', $row_per_page)->render('apps.wallets_list', $data);
        
    }


    public function create()
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'wallets';
        $data['page_title'] = __('Create Wallet');
        return view('apps.wallets_add', $data);
    }


    public function store(Request $request)
    {
        try{

                $validator = Validator::make($request->all(), [
                    'wallet_name' => 'required|max:30',
                    'wallet_logo' => 'required|mimes:jpg,jpeg,png|max:1148',
                ]);

                $validator->validate();

                if ($validator->fails()) {
                    Alert::Error('Error', $validator->errors());
                    return redirect()->back();
                }


                $imageName ='logo_wallet_'. time().'.'.$request->wallet_logo->extension();       
                $request->wallet_logo->move(public_path('storage/wallet_logo/'), $imageName);
                $destination_path = public_path('storage/wallet_logo/');
                $new_path = public_path('storage/wallet_logo/thumbnail/');
                copy($destination_path.$imageName, $new_path.$imageName);

                // //create thumbnail
                $largethumbnailpath = public_path('storage/wallet_logo/thumbnail/'.$imageName);
                $this->createThumbnail($largethumbnailpath, 300, 185);


                $wallet = new Wallet;
                $wallet->uuid = Uuid::uuid4();
                $wallet->name = $request->wallet_name;
                $wallet->image = 'storage/wallet_logo/'.$imageName;
                $wallet->save();

                Alert::success('Success', 'Wallet Created Successfully');
                return redirect()->route('wallet.list')->with('success', __('Wallet has been created successfully.'));


        }catch (\Exception $e) {
            Alert::error('Error', $e->getMessage());
            return redirect()->back();
        }
    }


    public function createThumbnail($path, $width, $height)
        {
            $img = Image::make($path)->resize($width, $height, function ($constraint) {
                $constraint->aspectRatio();
            });
            $img->save($path);
        }

    public function edit($id)
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'wallets';
        $data['page_title'] = __('Edit Wallet');
        $data['walletData'] = Wallet::find($id);
        return view('apps.wallets_edit', $data);
    }

    public function update(Request $request)
    {
        try{                

                if($request->wallet_logo != null){

                    $validator = Validator::make($request->all(), [
                        'wallet_logo' => 'mimes:jpg,jpeg,png|max:1148',
                    ]);
    
                    $validator->validate();
    
                    if ($validator->fails()) {
                        Alert::Error('Error', $validator->errors());
                        return route('wallet.list');
                    }

                    $imageName ='logo_wallet_'. time().'.'.$request->wallet_logo->extension();       
                    $request->wallet_logo->move(public_path('storage/wallet_logo/'), $imageName);
                    $destination_path = public_path('storage/wallet_logo/');
                    $new_path = public_path('storage/wallet_logo/thumbnail/');
                    copy($destination_path.$imageName, $new_path.$imageName);

                    // //create thumbnail
                    $largethumbnailpath = public_path('storage/wallet_logo/thumbnail/'.$imageName);
                    $this->createThumbnail($largethumbnailpath, 300, 185);

                    $updatewallet = Wallet::find($request->wallet_id);
                    $updatewallet->image = 'storage/wallet_logo/'.$imageName;
                    $updatewallet->save();
                }

                if($request->wallet_name != null){

                    $wallet = Wallet::find($request->wallet_id);
                    $wallet->name = $request->wallet_name;                   
                    $wallet->save();
                }

            Alert::success('Success', 'Wallet Updated Successfully');
            return redirect()->route('wallet.list');

        }catch (\Exception $e) {
            Alert::error('Error', $e->getMessage());
            return redirect()->route('wallet.list');
        }
    }


    public function destroy($id)
    {
        try{
            $wallet = Wallet::find($id);
            $wallet->delete();
            Alert::success('Success', 'Wallet Deleted Successfully');
            return redirect()->route('wallet.list');
        }catch (\Exception $e) {
            Alert::error('Error', $e->getMessage());
            return redirect()->route('wallet.list');
        }
    }
  
}
