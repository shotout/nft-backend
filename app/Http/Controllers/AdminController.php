<?php

namespace App\Http\Controllers;

use App\DataTables\AdminListDataTable;
use App\Http\Controllers\Controller;
use App\Models\Admins;
use Contentful\Delivery\Client as DeliveryClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Contentful\Management\Client;
use Contentful\Core\Api\Exception;
use Contentful\Management\Resource\Entry;


class AdminController extends Controller
{
    //prepare contentful api
    

  
   

    public function index(AdminListDataTable $dataTable)
    {   
       
        $data['menu'] = 'Admin';
        $data['sub_menu'] = 'Admin';
        $data['page_title'] = __('Admins');
        $data['total_admin'] = Admins::all()->count();
        $data['admin_active'] = Admins::where('is_active', 1)->count();
        $data['admin_inactive'] = Admins::where('is_active', 0)->count();
        

        $row_per_page = 10;

        return $dataTable->with('row_per_page', $row_per_page)->render('admin.admin_list', $data);
    }

    public function create()
    {
        $data['menu'] = 'Admin';
        $data['sub_menu'] = 'Admin';
        $data['page_title'] = __('Create Admin');
        return view('admin.admin_add', $data);
    }


    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'admin_name' => 'required|max:30',
            'admin_email' => 'required|max:30',
            'admin_password' => ['nullable', 'unique:admins,email'],
            
        ]);
        
        if ($validator->fails()) {
            $data = [];
            if (isset($request->type) && !empty($request->type)) {
                $data['status'] = false;
                $data['errors'] = $validator->errors()->first();
                return $data;
            }
            return back()->withErrors($validator)->withInput();
        }
        try {
            
            DB::beginTransaction();
            $newAdmin = new Admins();
            $newAdmin->name = stripBeforeSave($request->admin_name);
            $newAdmin->email = stripBeforeSave($request->admin_email);
            $newAdmin->password = Hash::make($request->admin_password);
            $newAdmin->created_at = date('Y-m-d H:i:s');
            
            $newAdmin->save();           
           
            DB::commit();

            Session::flash('success', __('Successfully Saved'));

            return redirect()->intended("admin/list");
             
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withInput()->withErrors(['error' => $e->getMessage()]);
        }
        
    }


    public function edit($id)
    {
        $data['menu'] = 'Admins';
        $data['sub_menu'] = 'Admins';
        $data['page_title'] = __('Admins Edit');
        $data['adminData'] = Admins::find($id);        
        $data['status_tab'] = 'active';

        return view('admin.admin_edit', $data);
    }

    //change status of admin
    public function changeStatus(Request $request)
    {
        $admin = Admins::find(1);
        $admin->is_active=$request->status;
        $admin->save();

        
        DB::commit();
        
        $data['admin_active'] = Admins::where('is_active', 1)->count();
        $data['admin_inactive'] = Admins::where('is_active', 0)->count();
        $data['total_admin'] = intval($data['admin_active']) + intval($data['admin_inactive']);
        $data['status'] = 'success';

        return $data;

    }
    


}
