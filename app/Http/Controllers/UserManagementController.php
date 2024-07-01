<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
    public function editAdmin($id)
    {
        $user = User::findOrFail($id);
        $authUser = auth()->user();

        return Inertia::render('UserManagement/admin_edit', [
            'user' => $user,
            'auth' => $authUser,
        ]);
    }

    public function updateAdmin(Request $request, $id)
    {
        // Find the user by id
        $user = User::findOrFail($id);

        // Validate the request data (you may customize the validation rules as needed)
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        // Update the user's name and email
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];

        // If password is provided, update it
        if ($request->filled('password')) {
            $user->password = bcrypt($validatedData['password']);
        }

        // Save the user changes
        $user->save();

        // Return a success response
        return response()->json(['message' => 'The admin updated successfully', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete user'], 500);
        }
    }

    public function toggleUserStatus(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        try {
            // Flip the value of isDisabled
            $user->is_disabled = !$user->is_disabled; // Toggle the value

            // Save the updated value to the database
            $user->save();

            // You can return a response indicating success if needed
            return response()->json(['message' => 'User status toggled successfully', 'isDisabled' => $user->isDisabled], 200);
        } catch (\Exception $e) {
            // Return an error response if something went wrong
            return response()->json(['error' => 'Failed to toggle user status', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAdminStatus($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['is_disabled' => $user->is_disabled], 200);
    }

    public function deleteMultiple(Request $request)
    {
        $userIds = $request->input('admin_ids');

        // Debugging line
        Log::info('Received admin_ids:', $userIds);

        if (is_array($userIds) && count($userIds) > 0) {
            User::whereIn('id', $userIds)->delete();
            return response()->json(['message' => 'Admins deleted successfully']);
        }

        return response()->json(['message' => 'No admins selected'], 400);
    }






}
