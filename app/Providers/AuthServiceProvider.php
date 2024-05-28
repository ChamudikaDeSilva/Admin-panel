<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\Dashboard;
use App\Models\Module;
use App\Policies\DashboardPolicy;
use App\Policies\ModulePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Dashboard::class => DashboardPolicy::class,
        Module::class => ModulePolicy::class,

    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

    }
}
