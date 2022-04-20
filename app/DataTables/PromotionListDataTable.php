<?php
namespace App\DataTables;

use App\Models\Products;
use App\Models\Wallet;
use Yajra\DataTables\Services\DataTable;

class PromotionListDataTable extends DataTable
{
    public function ajax()
    {
        $promotions = $this->query();
        return datatables()
            ->of($promotions)
            ->addColumn('nft_title', function ($promotions) {
                $promotion = '';
                $promotion .= '<a href="'. url('promotion/edit/'. $promotions->id) .'">'. $promotions->nft_title .'</a><br>';
                return  $promotion . '<a href="'. url("promotion/edit/". $promotions->id) .'"  target="_blank"></a>';

            })
            ->rawColumns(['nft_title','nft_type','nft_publish_date','nft_price'])
            ->make(true);
    }


    public function query() {
        $promotions = Products::select();        
        return $this->applyScopes($promotions);
    }

    public function html() {
        return $this->builder()
        ->addColumn(['data' => 'id', 'name' => 'id', "visible" => false])
        ->addColumn(['data' => 'nft_type', 'name' => 'nft_type', 'title' => __('Type')])     
        ->addColumn(['data' => 'nft_title', 'name' => 'nft_title', 'title' => __('Title')])           
        ->addColumn(['data' => 'nft_publish_date', 'name' => 'nft_publish_date', 'title' => __('Publish Date')])   
        ->addColumn(['data' => 'nft_price', 'name' => 'nft_price', 'title' => __('Price')])   
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
        return '_promotion' . time();
    }
}
