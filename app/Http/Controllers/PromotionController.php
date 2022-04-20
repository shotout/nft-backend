<?php

namespace App\Http\Controllers;

use App\DataTables\PromotionListDataTable;
use App\Models\AppPreferance;
use App\Models\Blockchain;
use App\Models\Collection;
use App\Models\Collections;
use App\Models\Communities;
use App\Models\Products;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;
use RealRashid\SweetAlert\Facades\Alert;

class PromotionController extends Controller
{

    public function __construct()
            {
                $this->middleware('web');
            }

    public function index(PromotionListDataTable $dataTable)
    {
        $data['menu'] = 'promotions';
        $data['sub_menu'] = 'promotion_list';
        $data['page_title'] = __('Promotion');
       
        $row_per_page = 10;

        return $dataTable->with('row_per_page', $row_per_page)->render('promotion.promotion_list', $data);
    }

    public function create()
    {
        $data = ['menu' => 'promotions','sub_menu' => 'create_promotion', 'page_title' => __('Create Promotion')];
        $data ['blockchainData'] = Blockchain::all();
        return view('promotion.promotion_add',$data);
    }


    public function upload(Request $request)
    {
        if (!empty($_FILES['attachment'])) {
            $uploaderId = $request->uploader_id;
            $tempDirectory = "public/contents/temp";
            if (!file_exists($tempDirectory)) {
                mkdir($tempDirectory, config('app.filePermission'), true);
            }
            $files = $request->attachment;
            if ($_FILES['attachment']['error'] <> 0 || !is_uploaded_file($_FILES['attachment']['tmp_name'])) {
                $this->_returnJSON(false, __('Error in uploading file. Please try again.'));
            }
            
            $maxFileSize = maxFileSize($_FILES['attachment']["size"]);
            if (isset($maxFileSize['status']) && $maxFileSize['status'] == 0) {
                $this->_returnJSON(false, $maxFileSize['message']);
            }

            $validator = Validator::make($request->all(), []);

            $validator->after(function ($validator) use ($request) {
                $files  = $request->file('attachment');
                if (empty($files)) {
                    return true;
                }
                
                if (checkFileValidationOne($files->getClientOriginalExtension()) == false) {
                    $validator->errors()->add('upload_File', __('Allowed File Extensions: jpg, png, gif, docx, xls, xlsx, csv and pdf'));
                }
            });

            if ($validator->fails()) {
                $this->_returnJSON(false, __('Invalid file type'));
            }
            
            $attachment = md5(time()) .'_'. $uploaderId .'_'. $_FILES["attachment"]["name"];
            $attachment = str_replace(array('/',' '), '_', $attachment);
            $attachmentPath = $tempDirectory .'/'. $attachment;
            if (move_uploaded_file($_FILES['attachment']['tmp_name'], $attachmentPath)) {
                $this->_returnJSON(true, array('message' => __('Uploaded successfully'), 'attachment' => $attachment, 'attachment_type' => getFileIcon($_FILES["attachment"]["name"]), 'attachment_path' => $attachmentPath, 'attachment_name' => $_FILES["attachment"]["name"]));
            }
        }
        $this->_returnJSON(false, __('Error in uploading file. Please try again.'));
    }


    public function store(Request $request) {
        try{
            $validator=Validator::make($request->all(),[ 
            'nft_title' => ['required'], 
            'nft_type' => ['required'],
            'nft_amount' => ['required'],
            'nft_price' => ['required'],
            'nft_date' => ['required'],
            'nft_desc' => ['required'],
            'nft_raffle' => ['required'],
            'nft_com' => ['required'],
            'nft_blockchain' => ['required'],
            'nft_mint' => ['required'],
            ]);

            $validator->validate();           

            $newpromotion = new Products();
            $newpromotion->uuid = Uuid::uuid4();
            $newpromotion->nft_title = $request->nft_title;
            $newpromotion->nft_type = $request->nft_type;
            $newpromotion->nft_amount = $request->nft_amount;
            $newpromotion->nft_price = $request->nft_price;
            $newpromotion->nft_publish_date = $request->nft_date;
            $newpromotion->nft_description = $request->nft_desc;
            $newpromotion->nft_raffle = $request->nft_raffle;
            $newpromotion->nft_community = $request->nft_com;
            $newpromotion->nft_blockchain = $request->nft_blockchain;
            $newpromotion->nft_mint = $request->nft_mint;
            $newpromotion->created_at = date('Y-m-d H:i:s');
            $newpromotion->save();     

            $promotion_id = Products::Latest('id')->first();
            $promotion_id = $promotion_id->id;
           
            $newcolor = new AppPreferance();
            $newcolor->uuid = Uuid::uuid4();
            $newcolor->promotion_id = $promotion_id;
            $newcolor->main_color = '#0DB7B7';
            $newcolor->background_color = '#BDBDCA';
            $newcolor->gradient1_color = '#0DB7B7';
            $newcolor->gradient2_color = '#81F4CC';
            $newcolor->created_at = date('Y-m-d H:i:s');
            $newcolor->save();


            $imageName ='collection_'. time().'.'.$request->nft_cover->extension();
            $request->nft_cover->move(public_path('storage/collection/'), $imageName);


            $newcollection = new Collections();
            $newcollection->uuid = Uuid::uuid4();
            $newcollection->promotion_id = $promotion_id;
            $newcollection->image =  'storage/collection/'.$imageName;
            $newcollection->type = 1;
            $newcollection->created_at = date('Y-m-d H:i:s');   
            $newcollection->save();

            $newcommunities = new Communities();
            $newcommunities->uuid = Uuid::uuid4();
            $newcommunities->promotion_id = $promotion_id;
            $newcommunities->telegram = $request->nft_telegram;
            $newcommunities->discord = $request->nft_discord;
            $newcommunities->twitter = $request->nft_twitter;                                                                                                                                 
            $newcommunities->created_at = date('Y-m-d H:i:s');
            $newcommunities->save();


            Alert::success('Success', 'Promotion Created Successfully');
            return redirect()->intended('/promotion/list');
            
        } catch (Exception $e) {
            DB::rollBack();
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    }


    public function edit($id)
    {
        $data = ['menu' => 'promotions','sub_menu' => 'edit_promotion', 'page_title' => __('Edit Promotion')];
        $promotion = Products::where('id',$id)->first();
        $data['color'] = AppPreferance::where('promotion_id',$id)->first();
        $data['collection'] = Collections::where('promotion_id',$id)->get();
        $data['promotion'] = $promotion;
        return view('promotion.promotion_edit',$data);
    }

    public function collection(Request $request)
    {   
        try{ 
            
            $validator = Validator::make($request->all(), [
                'collection' => 'mimes:jpg,jpeg,png|max:1148',
            ]);

            $validator->validate();

            if ($validator->fails()) {
                Alert::Error('Error', $validator->errors());
                return redirect()->back();
            }

            $imageName ='collection_'. time().'.'.$request->collection->extension();
            $request->collection->move(public_path('storage/collection/'), $imageName);


            $newcollection = new Collections();
            $newcollection->uuid = Uuid::uuid4();
            $newcollection->promotion_id = $request->promotion_id;
            $newcollection->image =  'storage/collection/'.$imageName;
            $newcollection->type = 1;
            $newcollection->created_at = date('Y-m-d H:i:s');   
            $newcollection->save();

            Alert::success('Success', 'Collection Add Successfully');
            return redirect()->back();
        } catch (Exception $e) {
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    }
}

