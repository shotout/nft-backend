<nav class="pcoded-navbar {{ getThemeClass('navbar') }}">
    <div class="navbar-wrapper">
        <div class="navbar-brand header-logo">
            <a href="{{ url('dashboard') }}" class="b-brand">

                <span class="b-title" title="{{ 'NFT of The Day' }}">{{ 'NFT of The Day' }}</span>
            </a>
            <a class="mobile-menu" id="mobile-collapse" href="javascript:"><span></span></a>
        </div>
        <div class="navbar-content scroll-div">
            <ul class="nav pcoded-inner-navbar">
                <li class="nav-item pcoded-menu-caption">
                    <label>{{ __('NAVIGATION') }}</label>
                </li>

                <li data-username="dashboard" class="nav-item {{ $menu == 'Admins' ? 'active' : '' }}">
                    <a href="{{ url('/admin/list') }}" class="nav-link "><span class="pcoded-micon"><i class="feather icon-users"></i></span><span class="pcoded-mtext">{{ __('Admins') }} </span></a>

                </li>           
            </ul>
                </li><br><br>
                
            </ul>
        </div>
    </div>
</nav>
