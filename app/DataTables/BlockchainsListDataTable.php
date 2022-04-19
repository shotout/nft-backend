<?php
namespace App\DataTables;

use App\Models\Blockchain;
use Yajra\DataTables\Services\DataTable;

class BlockchainsListDataTable extends DataTable
{
    public function ajax()
    {
        $blockchains = $this->query();
        return datatables()
            ->of($blockchains)
            ->addColumn('name', function ($blockchains) {
                $blockchain = '';
                $blockchain .= '<a href="'. url('blockchain/edit/'. $blockchains->id) .'">'. $blockchains->name .'</a><br>';
                return  $blockchain . '<a href="'. url("blockchain/edit/". $blockchains->id) .'"  target="_blank"></a>';

            })
            ->addColumn('vektor', function ($blockchains) {
                if (isset($blockchains->vektor)  && !empty($blockchains->vektor)) {
                    if (file_exists($blockchains->vektor)) {
                        $img = '<img src="'. url($blockchains->vektor) .'" alt="" width="50" height="50">';
                    } else {
                        $img = '<img src="'. url("public/dist/img/default-image.png") .'" alt="" width="50" height="50">';
                    }
                } else {
                        $img = '<img src="'. url("public/dist/img/default-image.png") .'" alt="" width="50" height="50">';
                }
                return $img;
            })
            ->addColumn('action', function ($blockchains) {
                $delete = '<form method="POST" action="'.url("blockchain/delete/".$blockchains->id).'"accept-charset="UTF-8" class="display_inline" id="delete-item-'. $blockchains->id .'">
                ' . csrf_field() . '
                    <input type="hidden" name="id" value="'.$blockchains->id.'">
                    <button title="' . __('Delete') . '" class="btn btn-xs btn-danger" type="button" data-toggle="modal" data-id="'. $blockchains->id .'" data-target="#confirmDelete" data-label = "Delete" data-title="' . __('Delete item') . '" data-message="' . __('Are you sure to delete this item?') . '">
                        <i class="feather icon-trash-2"></i> 
                    </button>
                </form>';
                return $delete;
            })
            ->rawColumns(['name','vektor','action'])
            ->make(true);
    }


    public function query() {
        $blockchains = Blockchain::select();        
        return $this->applyScopes($blockchains);
    }

    public function html() {
        return $this->builder()
        ->addColumn(['data' => 'id', 'name' => 'id', "visible" => false])
        ->addColumn(['data' => 'vektor', 'name' => 'img', 'title' => __('Logo'), 'orderable' => false, 'searchable' => false])
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
