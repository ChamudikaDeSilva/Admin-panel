<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function adminIndex()
    {
        $admins = User::all();

        return Inertia::render('UserManagement/admin', [
            'admins' => $admins,
        ]);
    }

    public function fetchAdmins()
    {
        $admins = User::where('role_id', 2)->get();
        return response()->json(['admins' => $admins]);
    }


    public function createAdmin(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
          ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 2, // Explicitly set role_id to 2 for admins
        ]);

        // Optionally, you can assign a role to the new user here

        return response()->json(['message' => 'Admin created successfully'], 201);
    }



}
