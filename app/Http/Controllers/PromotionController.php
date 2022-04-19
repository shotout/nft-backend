<?php

namespace App\Http\Controllers;

use App\DataTables\PromotionListDataTable;
use App\Models\AppPreferance;
use App\Models\Products;
use App\Models\Wallet;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx\Rels;
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
        $data ['walletData'] = Wallet::all();
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
            ]);

            $validator->validate();

            $promotion_id= Uuid::uuid4();

            $newpromotion = new Products();
            $newpromotion->uuid = $promotion_id;
            $newpromotion->nft_title = $request->nft_title;
            $newpromotion->nft_type = $request->nft_type;
            $newpromotion->nft_amount = $request->nft_amount;
            $newpromotion->nft_price = $request->nft_price;
            $newpromotion->nft_publish_date = $request->nft_date;
            $newpromotion->nft_description = $request->nft_desc;
            $newpromotion->nft_raffle = $request->nft_raffle;
            $newpromotion->nft_raffle = $request->nft_com;
            $newpromotion->created_at = date('Y-m-d H:i:s');
            $newpromotion->save();        

           
            $newcolor = new AppPreferance();
            $newcolor->uuid = Uuid::uuid4();
            $newcolor->promotion_id = $promotion_id;
            $newcolor->main_color = '#0DB7B7';
            $newcolor->background_color = '#BDBDCA';
            $newcolor->gradient1_color = '#0DB7B7';
            $newcolor->gradient2_color = '#81F4CC';
            $newcolor->created_at = date('Y-m-d H:i:s');
            $newcolor->save();


            Alert::success('Success', 'Promotion Created Successfully');
            return redirect()->intended('/promotion/create');
            
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
        $data['promotion'] = $promotion;
        return view('promotion.promotion_edit',$data);
    }
}

