<?php
namespace App\DataTables;

use App\Models\Faq;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Yajra\DataTables\Services\DataTable;

class FaqListDataTable extends DataTable
{
    public function ajax()
    {
        $faqs = $this->query();
        return datatables()
            ->of($faqs)
            ->addColumn('question', function ($faqs) {
                $faq = '';
                $faq .= '<a href="'. url('faq/edit/'. $faqs->id) .'">'. $faqs->question .'</a><br>';
                return  $faq . '<a href="'. url("wallet/edit/". $faqs->id) .'"  target="_blank"></a>';

            })
            ->addColumn('parent', function ($faqs) {
                $faq = '';
                if($faqs->parent != null){
                    $faq = 'Guidelines';
                }else{
                    $faq = 'FAQ';
                }
                return  $faq;
            })
            ->addColumn('action', function ($faqs) {
                $delete = '<form method="POST" action="'.url("faq/delete/".$faqs->id).'"accept-charset="UTF-8" class="display_inline" id="delete-item-'. $faqs->id .'">
                ' . csrf_field() . '
                    <input type="hidden" name="id" value="'.$faqs->id.'">
                    <button title="' . __('Delete') . '" class="btn btn-xs btn-danger" type="button" data-toggle="modal" data-id="'. $faqs->id .'" data-target="#confirmDelete" data-label = "Delete" data-title="' . __('Delete item') . '" data-message="' . __('Are you sure to delete this item?') . '">
                        <i class="feather icon-trash-2"></i> 
                    </button>
                </form>';
                return $delete;
            })
            ->rawColumns(['question','answer','parent','action'])
            ->make(true);
    }


    public function query() {
        $faqs = Faq::select();        
        return $this->applyScopes($faqs);
    }

    public function html() {
        return $this->builder()
        ->addColumn(['data' => 'id', 'name' => 'id', "visible" => false])
        ->addColumn(['data' => 'question', 'name' => 'question', 'title' => __('Question')])     
        ->addColumn(['data' => 'answer', 'name' => 'answer', 'title' => __('Answer')], 'width:500px')
        ->addColumn(['data' => 'parent', 'name' => 'parent', 'title' => __('Parent Question')], 'width:500px')
        ->addColumn(['data' => 'action', 'name' => 'action', 'title' => __('Action'), 'orderable' => false, 'searchable' => false]) 
            ->parameters([
            'pageLength' => $this->row_per_page,            
            'order' => [0, 'DESC']
            ]);
    }

    protected function getColumns()
    {
        return [
            'id',
            'created_at',
            'updated_at',
        ];
    }

    protected function filename()
    {
        return '_wallet' . time();
    }
}
