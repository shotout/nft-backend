<?php
namespace App\DataTables;

use App\Models\Wallet;
use Yajra\DataTables\Services\DataTable;

class WalletsListDataTable extends DataTable
{
    public function ajax()
    {
        $wallets = $this->query();
        return datatables()
            ->of($wallets)
            ->addColumn('name', function ($wallets) {
                $wallet = '';
                $wallet .= '<a href="'. url('wallet/edit/'. $wallets->id) .'">'. $wallets->name .'</a><br>';
                return  $wallet . '<a href="'. url("wallet/edit/". $wallets->id) .'"  target="_blank"></a>';

            })
            ->addColumn('img', function ($wallets) {
                if (isset($wallets->image)  && !empty($wallets->image)) {
                    if (file_exists($wallets->image)) {
                        $img = '<img src="'. url($wallets->image) .'" alt="" width="50" height="50">';
                    } else {
                        $img = '<img src="'. url("public/dist/img/default-image.png") .'" alt="" width="50" height="50">';
                    }
                } else {
                        $img = '<img src="'. url("public/dist/img/default-image.png") .'" alt="" width="50" height="50">';
                }
                return $img;
            })
            ->addColumn('action', function ($wallets) {
                $delete = '<form method="POST" action="'.url("wallet/delete/".$wallets->id).'"accept-charset="UTF-8" class="display_inline" id="delete-item-'. $wallets->id .'">
                ' . csrf_field() . '
                    <input type="hidden" name="id" value="'.$wallets->id.'">
                    <button title="' . __('Delete') . '" class="btn btn-xs btn-danger" type="button" data-toggle="modal" data-id="'. $wallets->id .'" data-target="#confirmDelete" data-label = "Delete" data-title="' . __('Delete item') . '" data-message="' . __('Are you sure to delete this item?') . '">
                        <i class="feather icon-trash-2"></i> 
                    </button>
                </form>';
                return $delete;
            })
            ->rawColumns(['name','img','action'])
            ->make(true);
    }


    public function query() {
        $wallets = Wallet::select();        
        return $this->applyScopes($wallets);
    }

    public function html() {
        return $this->builder()
        ->addColumn(['data' => 'id', 'name' => 'id', "visible" => false])
        ->addColumn(['data' => 'img', 'name' => 'img', 'title' => __('Picture'), 'orderable' => false, 'searchable' => false])
        ->addColumn(['data' => 'name', 'name' => 'name', 'title' => __('Name')])     
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
