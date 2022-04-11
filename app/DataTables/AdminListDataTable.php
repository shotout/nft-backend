<?php
namespace App\DataTables;

use App\Models\Admin;
use App\Models\Admins;
use Yajra\DataTables\Services\DataTable;

class AdminListDataTable extends DataTable
{
    public function ajax()
    {
        $admins = $this->query();
        return datatables()
            ->of($admins)
            ->addColumn('name', function ($admins) {
                $admin = '';
                $admin .= '<a href="'. url('admin/edit/'. $admins->id) .'">'. $admins->name .'</a><br>';
                return  $admin . '<a href="'. url("admin/adminlogin/". $admins->id) .'"  target="_blank"></a>';

            })
            ->addColumn('inactive', function ($admins) {
                if ($admins->is_active == 1) {
                    $status = '<div class="switch d-inline m-r-10">
                            <input class="status" type="checkbox" data-admin_id="'. $admins->id .'"  id="switch-'. $admins->id .'" checked="">
                            <label for="switch-'. $admins->id .'" class="cr"></label>
                        </div>';
                } else {
                    $status = '<div class="switch d-inline m-r-10">
                            <input class="status" type="checkbox" data-admin_id="'. $admins->id .'"  id="switch-'. $admins->id .'">
                            <label for="switch-'. $admins->id .'" class="cr"></label>
                        </div>';
                }
                return $status;
            })
            ->rawColumns(['name','inactive', 'email'])
            ->make(true);
    }


    public function query() {
        $admin = isset($_GET['admin']) ? $_GET['admin'] : null;
        $admins = Admins::select();
        if (!empty($admin) && $admin == "admin_inactive") {
            $admins->where('is_active', 0);
        } else if (!empty($admin) && $admin == "total") {
            $admins;
        } else {
            $admins->where('is_active', 1);
        }
        return $this->applyScopes($admins);
    }

    public function html() {
        return $this->builder()
        ->addColumn(['data' => 'id', 'name' => 'id', "visible" => false])
        ->addColumn(['data' => 'name', 'name' => 'name', 'title' => __('Name')])
        ->addColumn(['data' => 'inactive', 'name' => 'inactive', 'title' => __('Status'), 'orderable' => false])
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
        return 'admins_' . time();
    }
}
