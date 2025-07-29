# 🚨 Laravel API Debug Checklist

## 1. Pastikan Laravel API Running
```bash
cd path/to/laravel/project
php artisan serve --host=127.0.0.1 --port=8000
```

## 2. Test API Health
```bash
curl http://127.0.0.1:8000/api/test
```

## 3. Check CORS Configuration
File: `config/cors.php`
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## 4. Install Laravel Sanctum (if not installed)
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

## 5. Configure Sanctum
File: `config/sanctum.php`
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),
```

## 6. Check Route Registration
File: `routes/api.php` should have:
```php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/test', function () {
    return response()->json(['status' => 'success', 'message' => 'API is working']);
});
```

## 7. Check Middleware
File: `app/Http/Kernel.php`
```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

## 8. Create Test User
```bash
php artisan tinker

# In tinker:
$user = new App\Models\User();
$user->name = 'Test User';
$user->email = 'test@example.com';
$user->password = bcrypt('password123');
$user->role = 'member';
$user->is_active = true;
$user->save();
```

## 9. Test Login Manually
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected response:
```json
{
    "status": "success",
    "message": "Login successful",
    "token": "1|abcdef...",
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "role": "member"
    }
}
```

## 10. Common Errors & Solutions

### CORS Error
- Add localhost:3000 to allowed_origins in cors.php
- Make sure CORS middleware is enabled

### 404 Not Found
- Check if routes are registered properly
- Make sure Laravel is running on correct port

### 500 Internal Server Error
- Check Laravel logs: `tail -f storage/logs/laravel.log`
- Check database connection
- Check if all migrations are run

### 422 Validation Error
- Check if request data matches validation rules
- Make sure required fields are provided

### Token Issues
- Make sure Sanctum is properly configured
- Check if token is being sent in Authorization header

## Frontend Debug Steps:
1. Open http://localhost:3000/test-api
2. Test API connection first
3. Test login with known credentials
4. Check browser console for errors
5. Check Network tab for HTTP requests/responses
