<?php

namespace App\Http\Controllers;

use App\DataTables\BlockchainsListDataTable;
use App\Models\Blockchain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;
use RealRashid\SweetAlert\Facades\Alert;
use Intervention\Image\Facades\Image;

class BlockchainsController extends Controller
{
    public function index(BlockchainsListDataTable $dataTable)
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'blockchains';
        $data['page_title'] = __('Blockchains');
        $data['total_blockchain'] = Blockchain::all()->count();      
                
        $row_per_page = 10;
        
        return $dataTable->with('row_per_page', $row_per_page)->render('apps.blockchains_list', $data);
        
    }


    public function create()
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'blockchains';
        $data['page_title'] = __('Create Blockchain');
        return view('apps.blockchains_add', $data);
    }


    public function createThumbnail($path, $width, $height)
        {
            $img = Image::make($path)->resize($width, $height, function ($constraint) {
                $constraint->aspectRatio();
            });
            $img->save($path);
        }


    public function store(Request $request)
    {
        try{

                $validator = Validator::make($request->all(), [
                    'blockchain_name' => 'required|max:80',
                    'blockchain_logo' => 'required|mimes:jpg,png,svg,jpeg',
                ]);

                $validator->validate();

                if ($validator->fails()) {
                    Alert::Error('Error', $validator->errors());
                    return redirect()->back();
                }

                $dir = createDirectory("storage/blockchain_logo/thumbnail/");
                $imageName ='logo_blockchain_'. time().'.'.$request->blockchain_logo->extension();       
                $request->blockchain_logo->move(public_path('storage/blockchain_logo/'), $imageName);
                $destination_path = public_path('storage/blockchain_logo/');
                $new_path = public_path('storage/blockchain_logo/thumbnail/');
                copy($destination_path.$imageName, $new_path.$imageName);

                // //create thumbnail
                // $largethumbnailpath = public_path('storage/blockchain_logo/thumbnail/'.$imageName);
                // $this->createThumbnail($largethumbnailpath, 300, 185);
                
                $newblockchain = new Blockchain;
                $newblockchain->uuid = Uuid::uuid4();
                $newblockchain->name = $request->blockchain_name;
                $newblockchain->vektor = 'storage/blockchain_logo/'.$imageName;
                $newblockchain->created_at = date('Y-m-d H:i:s');
                $newblockchain->save();

                Alert::Success('Success', 'Blockchain has been added successfully.');
                return redirect()->route('bc.list');
        }catch(\Exception $e){
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    }

    public function edit ($id)
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'blockchains';
        $data['page_title'] = __('Edit Blockchain');
        $data['blockchainData'] = Blockchain::find($id);
        return view('apps.blockchains_edit', $data);
    }


    public function update (Request $request)
    {
        try{
                    if($request->blockchain_logo != null){

                        $validator = Validator::make($request->all(), [
                        'blockchain_logo' => 'mimes:jpg,jpeg,png,svg|max:1148',
                    ]);
    
                    $validator->validate();
    
                    if ($validator->fails()) {
                        Alert::Error('Error', $validator->errors());
                        return route('bc.list');
                    }

                    $imageName ='logo_blockchain_'. time().'.'.$request->blockchain_logo->extension();       
                    $request->blockchain_logo->move(public_path('storage/blockchain_logo/'), $imageName);
                    $destination_path = public_path('storage/blockchain_logo/');
                    $new_path = public_path('storage/blockchain_logo/thumbnail/');
                    copy($destination_path.$imageName, $new_path.$imageName);

                    // //create thumbnail
                    $largethumbnailpath = public_path('storage/blockchain_logo/thumbnail/'.$imageName);
                    $this->createThumbnail($largethumbnailpath, 300, 185);

                    $updateblockchain = Blockchain::find($request->blockchain_id);
                    $updateblockchain->vektor = 'storage/blockchain_logo/'.$imageName;
                    $updateblockchain->save();
                }

                if($request->blockchain_name != null){

                    $blockchain = Blockchain::find($request->blockchain_id);
                    $blockchain->name = $request->blockchain_name;                   
                    $blockchain->save();

                    Alert::Success('Success', 'Blockchain has been updated successfully.');
                    return redirect()->route('bc.list');
                }
        }catch(\Exception $e){
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    
    }


    public function destroy($id)
    {
        try{
            $blockchain = Blockchain::find($id);
            $blockchain->delete();
            Alert::Success('Success', 'Blockchain has been deleted successfully.');
            return redirect()->route('bc.list');
        }catch(\Exception $e){
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    }
}
