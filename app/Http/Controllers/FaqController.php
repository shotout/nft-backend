<?php

namespace App\Http\Controllers;

use App\DataTables\FaqListDataTable;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;
use RealRashid\SweetAlert\Facades\Alert;

class FaqController extends Controller
{
    public function index(FaqListDataTable $dataTable)
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'faq';
        $data['page_title'] = __('FAQ');
        $row_per_page = 10;

        return $dataTable->with('row_per_page', $row_per_page)->render('apps.faqs_list', $data);
    }

    
    public function create()
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'faq';
        $data['page_title'] = __('Create FAQ');
        $data['faqData'] = Faq::where('parent',null)->get();
        return view('apps.faqs_add', $data);
    }


    public function store(Request $request)
    {
        try{

                $validator = Validator::make($request->all(), [
                    'faq_question' => 'required',
                    'faq_answer' => 'required',
                ]);

                $validator->validate();

                if ($validator->fails()) {
                    Alert::Error('Error', $validator->errors());
                    return redirect()->back();
                }

                if($request->parent == ""){

                    $faq = new Faq;
                    $faq->uuid = Uuid::uuid4();
                    $faq->question = $request->faq_question;
                    $faq->answer = $request->faq_answer;
                    $faq->save();
                    Alert::Success('Success', 'FAQ has been added successfully.');
                }else{

                    $faq = new Faq;
                    $faq->uuid = Uuid::uuid4();
                    $faq->question = $request->faq_question;
                    $faq->answer = $request->faq_answer;
                    $faq->parent = $request->parent;
                    $faq->save();
                    Alert::Success('Success', 'Guidelines has been added successfully.');
                }

                
                return redirect()->route('faq.list');

        }catch(\Exception $e){
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    }


    public function edit($id)
    {
        $data['menu'] = 'app';
        $data['sub_menu'] = 'faq';
        $data['page_title'] = __('Edit FAQ');
        $data['faqData'] = Faq::where('parent',null)->get();
        $data['faq'] = Faq::find($id);
        return view('apps.faqs_edit', $data);
    }

    public function update(Request $request)
    {
        try{

                $validator = Validator::make($request->all(), [
                    'faq_question' => 'required',
                    'faq_answer' => 'required',
                ]);

                $validator->validate();

                if ($validator->fails()) {
                    Alert::Error('Error', $validator->errors());
                    return redirect()->back();
                }

                $faq = Faq::find($request->faq_id);
                $faq->question = $request->faq_question;
                $faq->answer = $request->faq_answer;
                $faq->save();

                Alert::Success('Success', 'FAQ has been updated successfully.');
                return redirect()->route('faq.list');

        }catch(\Exception $e){
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    }

    public function destroy($id)
    {
        try{
            $faq = Faq::find($id);
            $faq->delete();
            Alert::Success('Success', 'FAQ has been deleted successfully.');
            return redirect()->route('faq.list');
        }catch(\Exception $e){
            Alert::Error('Error', $e->getMessage());
            return redirect()->back();
        }
    }
}
