<?php

namespace App\Http\Controllers\Api;

use App\Models\Faq;
use App\Http\Controllers\Controller;

class FaqController extends Controller
{
    public function list()
    {
        // get all faq
        $faqs = Faq::whereNull('parent')->orderBy('id', 'desc')->get();

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $faqs
        ]);
    }

    public function show($id)
    {
        // find faq
        $faq = Faq::where('uuid', $id)->with('childs')->first();

        // if not found
        if (!$faq) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found',
            ]);
        }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $faq
        ]);
    }

    public function flag($flag)
    {
        // find faq
        $faq = Faq::whereNull('parent')->where('flag', $flag)->with('childs')->first();

        // if not found
        if (!$faq) {
            return response()->json([
                'status' => 'failed',
                'message' => 'data not found',
            ]);
        }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $faq
        ]);
    }
}