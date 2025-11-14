### Define Prunable Eloquent Model in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP code demonstrates how to make an Eloquent model prunable by using the `Illuminate\Database\Eloquent\Prunable` trait and implementing the `prunable()` method. The `prunable()` method defines the query to identify models that should be deleted, such as records older than one month, and returns an Eloquent Builder instance.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class Flight extends Model
{
    use Prunable;

    /**
     * Get the prunable model query.
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
```

--------------------------------

### Iterate Over Eloquent Collection in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This example shows that Eloquent collections implement PHP's iterable interfaces, allowing them to be directly looped over using a `foreach` statement. It illustrates accessing properties of individual Eloquent models within the loop.

```php
foreach ($flights as $flight) {
    echo $flight->name;
}
```

--------------------------------

### Serialize Eloquent Collection to Array in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Convert an entire collection of Eloquent models into an array. Calling `toArray()` on a collection instance will serialize each model within the collection into an array.

```php
$users = User::all();

return $users->toArray();
```

--------------------------------

### Perform Deferred Loading for Eloquent Aggregate Functions with `loadSum`

Source: https://laravel.com/docs/12.x/eloquent-relationships

Illustrates the deferred versions of aggregate methods, such as `loadSum`. These can be used on Eloquent models that have already been retrieved, allowing on-demand calculation of aggregates without initial eager loading.

```php
$post = Post::first();

$post->loadSum('comments', 'votes');
```

--------------------------------

### Generate Eloquent Model in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This command creates a new Eloquent model class, typically located in the `app\Models` directory, which extends `Illuminate\Database\Eloquent\Model`.

```shell
php artisan make:model Flight
```

--------------------------------

### Return Eloquent Models/Collections Directly from Laravel Route to JSON in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Illustrates how Laravel automatically serializes Eloquent models and collections to JSON when they are returned directly from application routes or controllers, simplifying API responses.

```php
Route::get('/users', function () {
    return User::all();
});
```

--------------------------------

### Iterating through an Eloquent Collection in PHP

Source: https://laravel.com/docs/12.x/eloquent-collections

This snippet demonstrates how Eloquent collections can be iterated over like standard PHP arrays. It retrieves active users and then loops through each user to echo their name.

```php
use App\Models\User;

$users = User::where('active', 1)->get();

foreach ($users as $user) {
    echo $user->name;
}
```

--------------------------------

### Serialize Eloquent Model to JSON in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Convert an Eloquent model and its loaded relationships into a JSON string. The `toJson()` method is recursive and supports optional JSON encoding options, such as `JSON_PRETTY_PRINT` for formatted output.

```php
use App\Models\User;

$user = User::find(1);

return $user->toJson();

return $user->toJson(JSON_PRETTY_PRINT);
```

--------------------------------

### Serialize Eloquent Model with Relationships to Array in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Convert an Eloquent model and its loaded relationships into a recursive array structure. This method recursively serializes all attributes and relations, including nested relations, using the `toArray()` method.

```php
use App\Models\User;

$user = User::with('roles')->first();

return $user->toArray();
```

--------------------------------

### Set Custom Table Name for Eloquent Model (PHP)

Source: https://laravel.com/docs/12.x/eloquent

This snippet demonstrates how to explicitly define the database table associated with an Eloquent model. By default, Eloquent assumes a snake_case, plural version of the model name; this configuration allows overriding that convention.

```php
<?php

namespace AppModels;

use IlluminateDatabaseEloquentModel;

class Flight extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'my_flights';
}
```

--------------------------------

### Generate Eloquent Model with Migration in Laravel

Source: https://laravel.com/docs/12.x/eloquent

Use this Artisan command to create an Eloquent model and its corresponding database migration file simultaneously, streamlining the setup for a new table and its model.

```shell
php artisan make:model Flight --migration
```

--------------------------------

### Return Laravel Eloquent API Resource using Model's `toResource` Method

Source: https://laravel.com/docs/12.x/eloquent-resources

This PHP code shows a convenient way to return an Eloquent API Resource by calling the `toResource()` method directly on an Eloquent model instance. Laravel automatically discovers the corresponding resource class based on naming conventions and the model's namespace.

```php
return User::findOrFail($id)->toResource();
```

--------------------------------

### Chaining map/reduce operations on Eloquent Collections in PHP

Source: https://laravel.com/docs/12.x/eloquent-collections

This example showcases the power of chaining map/reduce operations on an Eloquent collection. It first uses `reject` to remove inactive users and then `map` to transform the collection into a list of user names.

```php
$names = User::all()->reject(function (User $user) {
    return $user->active === false;
})->map(function (User $user) {
    return $user->name;
});
```

--------------------------------

### Define Mass Prunable Eloquent Model in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP code illustrates how to define an Eloquent model for mass pruning using the `Illuminate\Database\Eloquent\MassPrunable` trait. Mass pruning performs deletions via efficient mass-deletion queries without retrieving individual models, making it suitable for large datasets, though it bypasses individual `pruning()` hooks and model events.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\MassPrunable;

class Flight extends Model
{
    use MassPrunable;

    /**
     * Get the prunable model query.
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
```

--------------------------------

### Perform Laravel Eloquent Model Operations Quietly

Source: https://laravel.com/docs/12.x/eloquent

This code illustrates how to perform various Eloquent model operations like `delete`, `forceDelete`, and `restore` without dispatching their respective events, by appending `Quietly` to the method name. This provides fine-grained control over event dispatching for specific model actions.

```php
$user->deleteQuietly();
$user->forceDeleteQuietly();
$user->restoreQuietly();
```

--------------------------------

### Define BelongsTo Relationship in Laravel Eloquent Model

Source: https://laravel.com/docs/12.x/eloquent-relationships

This PHP code defines a `Book` Eloquent model with a `belongsTo` relationship to an `Author` model. The `author` method specifies how to retrieve the author associated with a book.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    /**
     * Get the author that wrote the book.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }
}
```

--------------------------------

### Enable Soft Deletes in Laravel Eloquent Model

Source: https://laravel.com/docs/12.x/eloquent

To use soft deletes, add the `SoftDeletes` trait to your Eloquent model. This will automatically manage the `deleted_at` timestamp, casting it to a `DateTime` or `Carbon` instance.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flight extends Model
{
    use SoftDeletes;
}
```

--------------------------------

### Stream Large Datasets with `lazy` Collections in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This code shows how the `lazy` method can be used to efficiently process large datasets as a single stream. It returns a flattened `LazyCollection` of Eloquent models, executing queries in chunks behind the scenes without loading all records into memory at once.

```php
use App\Models\Flight;

foreach (Flight::lazy() as $flight) {
    // ...
}
```

--------------------------------

### Define Laravel Dynamic Eloquent Relationships at Runtime

Source: https://laravel.com/docs/12.x/eloquent-relationships

This code illustrates how to define relationships between Eloquent models at runtime using `resolveRelationUsing`. It takes the relationship name and a closure that returns a valid Eloquent relationship definition, typically used within a service provider for package development.

```php
use App\Models\Order;
use App\Models\Customer;

Order::resolveRelationUsing('customer', function (Order $orderModel) {
    return $orderModel->belongsTo(Customer::class, 'customer_id');
});
```

--------------------------------

### Use Eloquent `toResourceCollection` Method in Laravel

Source: https://laravel.com/docs/12.x/eloquent-resources

Illustrates a convenient way to return an Eloquent collection as a resource collection. Laravel automatically discovers the appropriate resource collection based on naming conventions (e.g., `User` model to `UserCollection`).

```php
return User::all()->toResourceCollection();
```

--------------------------------

### Illustrate N+1 Query Problem with Laravel Eloquent

Source: https://laravel.com/docs/12.x/eloquent-relationships

This PHP code demonstrates the N+1 query problem by retrieving all books and then iterating through them to access each book's author. This results in one query for books and an additional query for each book's author.

```php
use App\Models\Book;

$books = Book::all();

foreach ($books as $book) {
    echo $book->author->name;
}
```

--------------------------------

### Perform Aggregate Queries on Eloquent Models in Laravel

Source: https://laravel.com/docs/12.x/eloquent

Laravel Eloquent allows the use of aggregate methods like `count()` and `max()` directly on model queries. These methods, inherited from the query builder, return a scalar value representing the aggregate result rather than an Eloquent model collection or instance. They are useful for quickly calculating statistics such as the total number of records or the maximum value of a column.

```php
$count = Flight::where('active', 1)->count();

$max = Flight::where('active', 1)->max('price');
```

--------------------------------

### Create Eloquent Models with Mass Assignment using the create Method in Laravel

Source: https://laravel.com/docs/12.x/eloquent

Laravel Eloquent's `create()` method offers a convenient way to insert a new model and its attributes in a single statement. This method returns the newly created model instance. To use `create()`, the model must define a `$fillable` or `$guarded` property to protect against mass assignment vulnerabilities, as all attributes are passed in an array.

```php
use App\Models\Flight;

$flight = Flight::create([
    'name' => 'London to Paris',
]);
```

--------------------------------

### Convert Laravel Collection to Eloquent Query Builder

Source: https://laravel.com/docs/12.x/eloquent-collections

The `toQuery` method converts the collection into an Eloquent query builder instance. This builder includes a `whereIn` constraint based on the primary keys of the models in the collection, facilitating mass operations like updates or deletions on the original database records.

```php
use App\Models\User;

$users = User::where('status', 'VIP')->get();

$users->toQuery()->update([
    'status' => 'Administrator',
]);
```

--------------------------------

### Update an existing Laravel Eloquent model

Source: https://laravel.com/docs/12.x/eloquent

This snippet demonstrates updating an existing Laravel Eloquent model. It involves retrieving the model by its ID, modifying specific attributes, and then calling the `save()` method. The `updated_at` timestamp is automatically managed by Eloquent.

```php
use App\Models\Flight;

$flight = Flight::find(1);

$flight->name = 'Paris to London';

$flight->save();
```

--------------------------------

### Implicitly Serialize Eloquent Model to JSON String in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Demonstrate how casting an Eloquent model to a string automatically invokes its `toJson()` method, converting it into a JSON string. This provides a convenient way to get a JSON representation directly.

```php
return (string) User::find(1);
```

--------------------------------

### Process Large Datasets with `chunk` Method in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This code demonstrates using the `chunk` method on an Eloquent model to process large numbers of records in smaller batches. It retrieves 200 `Flight` models at a time, preventing memory exhaustion, and passes each chunk to a closure for processing.

```php
use App\Models\Flight;
use Illuminate\Database\Eloquent\Collection;

Flight::chunk(200, function (Collection $flights) {
    foreach ($flights as $flight) {
        // ...
    }
});
```

--------------------------------

### Define Eloquent Model Fillable Attributes for Mass Assignment in PHP

Source: https://laravel.com/docs/12.x/eloquent

This code block illustrates how to define the `$fillable` property within an Eloquent model. The `$fillable` array specifies which attributes are allowed to be mass assigned, protecting the model from unwanted or malicious data updates. This is a critical security measure against mass assignment vulnerabilities.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];
}
```

--------------------------------

### Implement Queueable Anonymous Eloquent Event Listeners in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This snippet illustrates how to make an anonymous model event listener queueable using `Illuminate\Events\queueable`. This ensures that the event handling logic is executed in the background via Laravel's queue system, improving application responsiveness for long-running tasks.

```php
use function Illuminate\Events\queueable;

static::created(queueable(function (User $user) {
    // ...
}));
```

--------------------------------

### Check if Laravel Eloquent Model is Soft Deleted

Source: https://laravel.com/docs/12.x/eloquent

The `trashed()` method can be called on an Eloquent model instance to determine if the model has been soft deleted, returning `true` if its `deleted_at` column is set.

```php
if ($flight->trashed()) {
    // ...
}
```

--------------------------------

### Disable Auto-Incrementing Primary Key in Eloquent Model (PHP)

Source: https://laravel.com/docs/12.x/eloquent

This example illustrates how to configure an Eloquent model to use a non-incrementing primary key. Setting `$incrementing` to `false` prevents Eloquent from assuming and automatically casting the primary key as an integer.

```php
<?php

class Flight extends Model
{
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
}
```

--------------------------------

### Attach a Castable Value Object to an Eloquent Model in PHP

Source: https://laravel.com/docs/12.x/eloquent-mutators

This PHP code demonstrates how to attach a value object class (e.g., `Address`) that implements the `Illuminate\Contracts\Database\Eloquent\Castable` interface to an Eloquent model's `casts` array. Eloquent will then use the `castUsing` method of the value object to determine the actual caster class.

```php
use App\ValueObjects\Address;

protected function casts(): array
{
    return [
        'address' => Address::class,
    ];
}
```

--------------------------------

### Utilize and Chain Eloquent Local Scopes in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP example shows how to apply defined local scopes to an Eloquent query. Scopes can be chained directly to the model query. It also demonstrates combining scopes with an `orWhere` condition using a closure and the higher-order `orWhere` method for fluent chaining.

```php
use App\Models\User;

$users = User::popular()->active()->orderBy('created_at')->get();
```

```php
$users = User::popular()->orWhere(function (Builder $query) {
    $query->active();
})->get();
```

```php
$users = User::popular()->orWhere->active()->get();
```

--------------------------------

### Generate a Laravel Eloquent API Resource Class

Source: https://laravel.com/docs/12.x/eloquent-resources

This Artisan command creates a new Eloquent API resource class in the `app/Http/Resources` directory. The generated class extends `Illuminate\Http\Resources\Json\JsonResource` and is used to transform individual models into JSON.

```shell
php artisan make:resource UserResource
```

--------------------------------

### Nested Eager Loading with Dot Syntax in Laravel Eloquent

Source: https://laravel.com/docs/12.x/eloquent-relationships

This PHP code demonstrates nested eager loading using 'dot' syntax. It loads a book's author and then the author's contacts in a single query, optimizing access to deeply nested relationships.

```php
$books = Book::with('author.contacts')->get();
```

--------------------------------

### Define Laravel Eloquent Observer Class

Source: https://laravel.com/docs/12.x/eloquent

This PHP class demonstrates the structure of a Laravel Eloquent Observer. It contains methods named after Eloquent events (e.g., `created`, `updated`, `deleted`), each receiving the affected model instance as an argument, allowing centralized event handling logic.

```php
<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // ...
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        // ...
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        // ...
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        // ...
    }

    /**
     * Handle the User "forceDeleted" event.
     */
    public function forceDeleted(User $user): void
    {
        // ...
    }
}
```

--------------------------------

### Filtering Eloquent Cursor Results with LazyCollection in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This example shows how to apply collection methods, specifically `filter`, to the results of an Eloquent `cursor`. The `cursor` returns a `LazyCollection`, allowing common collection operations while maintaining memory efficiency by processing models one by one. This is useful for filtering large datasets without loading all records into memory.

```php
use App\Models\User;

$users = User::cursor()->filter(function (User $user) {
    return $user->id > 500;
});

foreach ($users as $user) {
    echo $user->id;
}
```

--------------------------------

### Serialize Eloquent Model Attributes Only to Array in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Convert only an Eloquent model's attributes to an array, explicitly excluding its relationships. This is useful when you need just the model's direct data without any related data using the `attributesToArray()` method.

```php
$user = User::first();

return $user->attributesToArray();
```

--------------------------------

### Stream and Update Large Datasets with `lazyById` in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This snippet demonstrates `lazyById` for streaming and updating large datasets efficiently, especially when filtering by an ID column. It works similarly to `chunkById` but returns a `LazyCollection`, allowing for memory-efficient updates of 'departed' flights.

```php
Flight::where('departed', true)
    ->lazyById(200, column: 'id')
    ->each->update(['departed' => false]);
```

--------------------------------

### Disable Automatic Timestamps in Laravel Eloquent Models

Source: https://laravel.com/docs/12.x/eloquent

Eloquent automatically manages `created_at` and `updated_at` columns. To disable this behavior for a specific model, set the `$timestamps` property to `false`. This prevents Eloquent from attempting to write to these columns during model creation or updates.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
```

--------------------------------

### Generate Eloquent Model with Associated Classes in Laravel

Source: https://laravel.com/docs/12.x/eloquent

These commands demonstrate how to generate an Eloquent model along with various related classes such as factories, seeders, controllers, policies, or form requests, using a combination of flags or the `--all` shortcut.

```shell
# Generate a model and a FlightFactory class...
php artisan make:model Flight --factory
php artisan make:model Flight -f

# Generate a model and a FlightSeeder class...
php artisan make:model Flight --seed
php artisan make:model Flight -s

# Generate a model and a FlightController class...
php artisan make:model Flight --controller
php artisan make:model Flight -c

# Generate a model, FlightController resource class, and form request classes...
php artisan make:model Flight --controller --resource --requests
php artisan make:model Flight -crR

# Generate a model and a FlightPolicy class...
php artisan make:model Flight --policy

# Generate a model and a migration, factory, seeder, and controller...
php artisan make:model Flight -mfsc

# Shortcut to generate a model, migration, factory, seeder, policy, controller, and form requests...
php artisan make:model Flight --all
php artisan make:model Flight -a

# Generate a pivot model...
php artisan make:model Member --pivot
php artisan make:model Member -p
```

--------------------------------

### Eager Load Single Relationship with Laravel Eloquent 'with' Method

Source: https://laravel.com/docs/12.x/eloquent-relationships

This PHP code demonstrates basic eager loading to solve the N+1 query problem. By using the `with('author')` method, it retrieves all books and their authors in just two queries, optimizing database access.

```php
$books = Book::with('author')->get();

foreach ($books as $book) {
    echo $book->author->name;
}
```

--------------------------------

### Define Eloquent HasMany Relationship in PHP

Source: https://laravel.com/docs/12.x/eloquent-relationships

This code defines a one-to-many relationship (`HasMany`) in a Laravel Eloquent `Post` model, linking it to `Comment` models. By convention, Eloquent automatically infers the `post_id` foreign key on the `Comment` model, but it can be overridden. This method allows accessing related comments.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    /**
     * Get the comments for the blog post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

--------------------------------

### Utilize Eloquent Scopes with Pending Attributes for Model Creation in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP example demonstrates how to use a scope defined with `withAttributes` to create a new Eloquent model. The attributes specified in `withAttributes` are automatically applied to the newly created model, simplifying initialization and ensuring consistency.

```php
$draft = Post::draft()->create(['title' => 'In Progress']);

$draft->hidden; // true
```

--------------------------------

### Dynamically Querying Morph To Relationships by Type in Laravel

Source: https://laravel.com/docs/12.x/eloquent-relationships

This snippet demonstrates how to add conditional query constraints to `whereHasMorph` based on the specific type of the related polymorphic model. The closure receives the `$type` argument, allowing dynamic column selection or other logic for filtering.

```php
use Illuminate\Database\Eloquent\Builder;

$comments = Comment::whereHasMorph(
    'commentable',
    [Post::class, Video::class],
    function (Builder $query, string $type) {
        $column = $type === Post::class ? 'content' : 'title';

        $query->where($column, 'like', 'code%');
    }
)->get();
```

--------------------------------

### Partition Laravel Collection Based on a Callback

Source: https://laravel.com/docs/12.x/eloquent-collections

The `partition` method divides the collection into two separate `Illuminate\Database\Eloquent\Collection` instances based on a given callback. The first collection contains elements for which the callback returns `true`, and the second for `false`.

```php
$partition = $users->partition(fn ($user) => $user->age > 18);

dump($partition::class);    // Illuminate\Support\Collection
dump($partition[0]::class); // Illuminate\Database\Eloquent\Collection
dump($partition[1]::class); // Illuminate\Database\Eloquent\Collection
```

--------------------------------

### Retrieve Only Soft Deleted Laravel Eloquent Models

Source: https://laravel.com/docs/12.x/eloquent

To query and retrieve *only* the soft deleted models, use the `onlyTrashed()` method on the Eloquent model or query builder. This will exclude models that have not been soft deleted.

```php
$flights = Flight::onlyTrashed()
    ->where('airline_id', 1)
    ->get();
```

--------------------------------

### Define MorphTo Relationship in Laravel Eloquent Model

Source: https://laravel.com/docs/12.x/eloquent-relationships

This PHP code defines an `ActivityFeed` Eloquent model with a `morphTo` relationship named `parentable`. This allows the `ActivityFeed` to belong to different types of parent models dynamically.

```php
<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityFeed extends Model
{
    /**
     * Get the parent of the activity feed record.
     */
    public function parentable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

--------------------------------

### Apply Query Constraints to Eloquent Deferred Counts with `loadCount`

Source: https://laravel.com/docs/12.x/eloquent-relationships

Shows how to set additional query constraints on a deferred count using `loadCount`. An array keyed by relationships with closure values allows filtering the count query based on specific conditions.

```php
$book->loadCount(['reviews' => function (Builder $query) {
    $query->where('rating', 5);
}])
```

--------------------------------

### Conditionally Eager Load Relationships in Laravel Collection

Source: https://laravel.com/docs/12.x/eloquent-collections

The `loadMissing` method eagerly loads specified relationships for all models in the collection only if those relationships haven't been loaded already. This prevents unnecessary database queries, supporting single, multiple, nested, and conditional relationships.

```php
$users->loadMissing(['comments', 'posts']);

$users->loadMissing('comments.author');

$users->loadMissing(['comments', 'posts' => fn ($query) => $query->where('active', 1)]);
```

--------------------------------

### Customize Laravel Eloquent Lazy Loading Violation Handling

Source: https://laravel.com/docs/12.x/eloquent-relationships

Allows customization of the behavior when a lazy loading violation occurs. Instead of throwing an exception, you can configure Eloquent to log the violation or perform other actions, preventing application interruption in specific scenarios.

```php
Model::handleLazyLoadingViolationUsing(function (Model $model, string $relation) {
    $class = $model::class;

    info("Attempted to lazy load [{$relation}] on model [{$class}].");
});
```

--------------------------------

### Define Laravel Has Many Eloquent Relationship

Source: https://laravel.com/docs/12.x/eloquent-relationships

This example provides the basic structure for defining a one-to-many relationship in Laravel Eloquent. It shows a `User` model having many `Post` models, specifying the method signature and return type for the relationship.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    /**
     * Get all of the posts for the user.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

--------------------------------

### Define Dynamic Eloquent Local Scopes in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP code illustrates how to create a dynamic local scope in Laravel Eloquent that accepts parameters. Additional parameters are added to the scope method's signature after the `$query` parameter, allowing for flexible query constraints based on input.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Scope a query to only include users of a given type.
     */
    #[Scope]
    protected function ofType(Builder $query, string $type): void
    {
        $query->where('type', $type);
    }
}
```

--------------------------------

### Append Eloquent Model Attributes at Runtime in Laravel

Source: https://laravel.com/docs/12.x/eloquent-serialization

This snippet shows how to dynamically append additional attributes to a Laravel Eloquent model instance at runtime using `append`, `mergeAppends`, or `setAppends` methods. These methods allow for flexible control over which attributes are included in the model's array or JSON representation.

```php
return $user->append('is_admin')->toArray();

return $user->mergeAppends(['is_admin', 'status'])->toArray();

return $user->setAppends(['is_admin'])->toArray();
```

--------------------------------

### Include Soft Deleted Laravel Eloquent Models in Query Results

Source: https://laravel.com/docs/12.x/eloquent

By default, soft deleted models are excluded from query results. To include them, call the `withTrashed()` method on the Eloquent query builder before executing the query.

```php
use App\Models\Flight;

$flights = Flight::withTrashed()
    ->where('account_id', 1)
    ->get();
```

--------------------------------

### Perform mass updates on Laravel Eloquent models

Source: https://laravel.com/docs/12.x/eloquent

This example demonstrates how to perform a mass update on multiple Laravel Eloquent models that match specific query conditions. The `update()` method takes an associative array of columns and their new values. Note that Eloquent model events (`saving`, `updated`, etc.) are not fired during mass updates as models are not individually retrieved.

```php
Flight::where('active', 1)
    ->where('destination', 'San Diego')
    ->update(['delayed' => 1]);
```

--------------------------------

### Permanently Delete Laravel Eloquent Models via Relationship (Force Delete)

Source: https://laravel.com/docs/12.x/eloquent

The `forceDelete()` method can be used on Eloquent relationship queries to permanently remove associated models from the database, ignoring soft delete status.

```php
$flight->history()->forceDelete();
```

--------------------------------

### Temporarily Modify Eloquent Attribute Visibility in Laravel

Source: https://laravel.com/docs/12.x/eloquent-serialization

These examples demonstrate how to temporarily make specific attributes visible or hidden on a Laravel Eloquent model instance using `makeVisible`, `mergeVisible`, `makeHidden`, and `mergeHidden` methods. They return the modified model instance, typically converted to an array.

```php
return $user->makeVisible('attribute')->toArray();

return $user->mergeVisible(['name', 'email'])->toArray();
```

```php
return $user->makeHidden('attribute')->toArray();

return $user->mergeHidden(['name', 'email'])->toArray();
```

--------------------------------

### Hide Eloquent Model Attributes from JSON/Array Serialization in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Define a `$hidden` property in an Eloquent model to prevent specific attributes, such as sensitive information like passwords, from being included in its array or JSON representation during serialization.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = ['password'];
}
```

--------------------------------

### Return a Laravel Eloquent API Resource from a Route

Source: https://laravel.com/docs/12.x/eloquent-resources

This PHP example demonstrates how to return a `UserResource` instance directly from a route closure. The resource class accepts an Eloquent model instance via its constructor, which it then transforms into a JSON response when returned from the route.

```php
use App\Http\Resources\UserResource;
use App\Models\User;

Route::get('/user/{id}', function (string $id) {
    return new UserResource(User::findOrFail($id));
});
```

--------------------------------

### Register Eloquent Model Events with Closures in Laravel's booted Method

Source: https://laravel.com/docs/12.x/eloquent

This example shows how to define model event listeners using closures directly within the `booted` static method of an Eloquent model. This approach allows for inline handling of events like `created` without requiring separate event classes, providing a concise way to react to model lifecycle changes.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::created(function (User $user) {
            // ...
        });
    }
}
```

--------------------------------

### Restore Soft Deleted Laravel Eloquent Models via Relationship

Source: https://laravel.com/docs/12.x/eloquent

The `restore()` method can also be applied to Eloquent relationship queries to restore associated soft deleted models, setting their `deleted_at` column to `null`.

```php
$flight->history()->restore();
```

--------------------------------

### Group orWhere clauses in Laravel Eloquent relationships for correct scoping

Source: https://laravel.com/docs/12.x/eloquent-relationships

This code shows how to use logical grouping with a closure (`where(function (Builder $query) {...})`) to ensure `orWhere` clauses are correctly scoped within the relationship's constraints. This prevents the `or` condition from overriding the parent relationship and ensures the query remains specific to the user.

```php
use Illuminate\Database\Eloquent\Builder;

$user->posts()
    ->where(function (Builder $query) {
        return $query->where('active', 1)
            ->orWhere('votes', '>=', 100);
    })
    ->get();
```

```sql
select *
from posts
where user_id = ? and (active = 1 or votes >= 100)
```

--------------------------------

### Iterating Eloquent Models with Cursor in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This snippet demonstrates using the `cursor` method on an Eloquent query to iterate over a large number of records. It significantly reduces memory consumption by loading only one model into memory at a time, leveraging PHP generators. This is suitable for scenarios where eager loading relationships is not required.

```php
use App\Models\Flight;

foreach (Flight::where('destination', 'Zurich')->cursor() as $flight) {
    // ...
}
```

--------------------------------

### Return an ad-hoc Laravel Resource Collection from a route

Source: https://laravel.com/docs/12.x/eloquent-resources

This PHP code shows how to quickly generate and return a resource collection for multiple models directly from a route. It uses the `toResourceCollection()` method available on Eloquent collections (e.g., `User::all()`) to transform all models into an API-friendly array.

```php
use App\Models\User;

Route::get('/users', function () {
    return User::all()->toResourceCollection();
});
```

--------------------------------

### Define Eloquent Local Scopes in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP code demonstrates how to define local scopes on a Laravel Eloquent model. Scopes are implemented as protected methods annotated with `#[Scope]` and receive a `Builder` instance to apply query constraints. They should return the query builder or `void`.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Scope a query to only include popular users.
     */
    #[Scope]
    protected function popular(Builder $query): void
    {
        $query->where('votes', '>', 100);
    }

    /**
     * Scope a query to only include active users.
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('active', 1);
    }
}
```

--------------------------------

### Customize Eloquent Date Format per Attribute using Casts in Laravel

Source: https://laravel.com/docs/12.x/eloquent-serialization

This code illustrates how to specify custom date and datetime serialization formats for individual attributes in a Laravel Eloquent model using the `casts` method. This allows for fine-grained control over how specific date attributes appear in array and JSON representations.

```php
protected function casts(): array
{
    return [
        'birthday' => 'date:Y-m-d',
        'joined_at' => 'datetime:Y-m-d H:00',
    ];
}
```

--------------------------------

### Perform Basic Search Query and Retrieve Eloquent Models in PHP

Source: https://laravel.com/docs/12.x/scout

This snippet illustrates how to initiate a search query on an Eloquent model using the `search()` method and retrieve the matching results as Eloquent models. The `get()` method is chained to execute the search and fetch the data.

```php
use App\Models\Order;

$orders = Order::search('Star Trek')->get();
```

--------------------------------

### Appending attributes to Eloquent Collection models in PHP

Source: https://laravel.com/docs/12.x/eloquent-collections

The `append` method is used to specify attributes that should be added to each model in the collection when serialized, such as computed properties. It can accept a single attribute string or an array of attribute strings.

```php
$users->append('team');

$users->append(['team', 'is_admin']);
```

--------------------------------

### Apply Logical Grouping with `chunkById` Conditions in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This example demonstrates how to logically group complex `where` conditions within a closure when using `chunkById`. This approach is crucial when `chunkById` adds its own 'where' conditions, preventing conflicts and ensuring the desired filtering logic for updates.

```php
Flight::where(function ($query) {
    $query->where('delayed', true)->orWhere('cancelled', true);
})->chunkById(200, function (Collection $flights) {
    $flights->each->update([
        'departed' => false,
        'cancelled' => true
    ]);
}, column: 'id');
```

--------------------------------

### Excluding models by primary key from Eloquent Collection in PHP

Source: https://laravel.com/docs/12.x/eloquent-collections

The `except` method filters an Eloquent collection, returning all models except those with the specified primary keys. It takes an array of primary keys as an argument to exclude particular models.

```php
$users = $users->except([1, 2, 3]);
```

--------------------------------

### Prevent Eloquent Lazy Loading in Laravel

Source: https://laravel.com/docs/12.x/eloquent-relationships

Instructs Laravel to prevent lazy loading of Eloquent relationships. This method should typically be called in the `boot` method of your `AppServiceProvider` and can be conditionally applied, for example, only in non-production environments to avoid performance issues.

```php
use IlluminateDatabaseEloquentModel;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Model::preventLazyLoading(! $this->app->isProduction());
}
```

--------------------------------

### Basic Eloquent Model Class Structure in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP snippet illustrates the fundamental structure of an Eloquent model class, including its namespace, the required `use` statement for the base `Model` class, and the class definition.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    // ...
}
```

--------------------------------

### Define a Laravel Horizon Queueable Job with Eloquent Model

Source: https://laravel.com/docs/12.x/horizon

This PHP code defines a `RenderVideo` job that implements `ShouldQueue` and utilizes the `Queueable` trait. It demonstrates how a job's constructor can accept an Eloquent model, enabling Horizon to automatically tag the job based on the model's class and primary key.

```php
<?php

namespace App\Jobs;

use App\Models\Video;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RenderVideo implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Video $video,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // ...
    }
}
```

--------------------------------

### Access Laravel Eloquent HasOne Relationship

Source: https://laravel.com/docs/12.x/eloquent-relationships

After defining a one-to-one relationship using `hasOne`, you can access the related model record (e.g., a Phone from a User) directly as a dynamic property. Eloquent automatically handles the lookup based on conventions.

```php
$phone = User::find(1)->phone;
```

--------------------------------

### Schedule Daily Model Pruning in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP snippet demonstrates how to schedule the `model:prune` Artisan command to run daily within Laravel's console kernel. This ensures that prunable models are regularly cleaned up according to their defined `prunable()` queries, maintaining a tidy database.

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('model:prune')->daily();
```

--------------------------------

### Combine Eloquent Aggregate Functions with Custom Select Statements

Source: https://laravel.com/docs/12.x/eloquent-relationships

Provides an example of combining aggregate methods like `withExists` with a `select` statement. It reiterates that aggregate methods should be called after the `select` method to ensure proper query construction.

```php
$posts = Post::select(['title', 'body'])
    ->withExists('comments')
    ->get();
```

--------------------------------

### Defining a Single Attribute Mutator in Eloquent (PHP)

Source: https://laravel.com/docs/12.x/eloquent-mutators

This PHP class defines an Eloquent mutator for the `first_name` attribute, demonstrating both getter and setter logic. The `set` closure transforms the input value to lowercase before it's stored in the model, while the `get` closure capitalizes the stored value when accessed. This ensures consistent data formatting.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Interact with the user's first name.
     */
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower($value),
        );
    }
}
```

--------------------------------

### Implement Laravel Attachable Interface for Custom Mail Attachments

Source: https://laravel.com/docs/12.x/mail

To make an Eloquent model attachable to mail messages, implement the `Illuminate\Contracts\Mail\Attachable` interface. This requires defining a `toMailAttachment` method that returns an `Illuminate\Mail\Attachment` instance, typically created from a file path.

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Mail\Attachable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Attachment;

class Photo extends Model implements Attachable
{
    /**
     * Get the attachable representation of the model.
     */
    public function toMailAttachment(): Attachment
    {
        return Attachment::fromPath('/path/to/file');
    }
}
```

--------------------------------

### Prevent Lazy Loading in Laravel Eloquent

Source: https://laravel.com/docs/12.x/eloquent

This PHP code shows how to prevent N+1 query issues by configuring Eloquent to prevent lazy loading. The `preventLazyLoading` method is typically called in the `boot` method of `AppServiceProvider`, conditionally disabling lazy loading only in non-production environments to avoid impact on production systems.

```php
use Illuminate\Database\Eloquent\Model;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Model::preventLazyLoading(! $this->app->isProduction());
}
```

--------------------------------

### Example SQL query generated by a Laravel global scope

Source: https://laravel.com/docs/12.x/eloquent

This SQL query demonstrates the effect of the `AncientScope` applied to a `User` model, filtering records based on their `created_at` timestamp.

```sql
select * from `users` where `created_at` < 0021-02-18 00:00:00
```

--------------------------------

### Create Eloquent Model After Defining Fillable Attributes (create) in PHP

Source: https://laravel.com/docs/12.x/eloquent

Once the `$fillable` property is defined on an Eloquent model, this example shows how to use the `create` method to safely insert a new record into the database. The `create` method will only assign attributes present in the `$fillable` array, returning the newly created model instance. This ensures secure and efficient record creation.

```php
$flight = Flight::create(['name' => 'London to Paris']);
```

--------------------------------

### Configure AsCollection Cast in Laravel Eloquent

Source: https://laravel.com/docs/12.x/eloquent-mutators

This example demonstrates how to cast a JSON attribute to a Laravel `Collection` instance using the `AsCollection` cast within an Eloquent model's `casts()` method. This provides the full power of Laravel collections for interacting with the attribute's data.

```php
use Illuminate\Database\Eloquent\Casts\AsCollection;

/**
 * Get the attributes that should be cast.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'options' => AsCollection::class,
    ];
}
```

--------------------------------

### Populate Eloquent Model with Attributes (fill) in PHP

Source: https://laravel.com/docs/12.x/eloquent

This snippet demonstrates the `fill` method, which is used to populate an existing Eloquent model instance with an array of attributes. Similar to `create`, the `fill` method respects the `$fillable` (or `$guarded`) property to prevent mass assignment vulnerabilities. It allows for updating multiple attributes on a model without explicitly setting each one individually.

```php
$flight->fill(['name' => 'Amsterdam to Frankfurt']);
```

--------------------------------

### Process and Update Large Datasets with `chunkById` in Laravel PHP

Source: https://laravel.com/docs/12.x/eloquent

This snippet illustrates the `chunkById` method, which is used when filtering results by a column that will also be updated during iteration. It ensures consistent results by retrieving models with an `id` greater than the last processed model, updating 'departed' flights in chunks of 200.

```php
Flight::where('departed', true)
    ->chunkById(200, function (Collection $flights) {
        $flights->each->update(['departed' => false]);
    }, column: 'id');
```

--------------------------------

### Customize Laravel Eloquent HasOne Local Key

Source: https://laravel.com/docs/12.x/eloquent-relationships

By default, Eloquent matches the foreign key to the parent model's primary key (`id`). If the parent's primary key is different, specify it as the third argument to the `hasOne` method, after the custom foreign key.

```php
return $this->hasOne(Phone::class, 'foreign_key', 'local_key');
```

--------------------------------

### Access Laravel Eloquent relationships as dynamic properties

Source: https://laravel.com/docs/12.x/eloquent-relationships

This snippet illustrates accessing an Eloquent relationship as a dynamic property (e.g., `$user->posts`). This method performs lazy loading, fetching related data only when accessed. For improved performance with frequently accessed relationships, consider using eager loading.

```php
use App\Models\User;

$user = User::find(1);

foreach ($user->posts as $post) {
    // ...
}
```

--------------------------------

### Dispatch a Laravel Horizon Job with an Eloquent Model

Source: https://laravel.com/docs/12.x/horizon

This PHP snippet illustrates how to dispatch the `RenderVideo` job, passing an Eloquent `Video` model instance. When dispatched in this manner, Horizon intelligently searches the job's properties for Eloquent models and automatically tags the job using the model's class name and primary key.

```php
use App\Jobs\RenderVideo;
use App\Models\Video;

$video = Video::find(1);

RenderVideo::dispatch($video);
```

--------------------------------

### Define an anonymous Laravel global scope with a closure

Source: https://laravel.com/docs/12.x/eloquent

For simpler scopes, you can use closures directly within the model's `booted` method. Provide a unique string name as the first argument to `addGlobalScope` for these anonymous scopes.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('ancient', function (Builder $builder) {
            $builder->where('created_at', '<', now()->subYears(2000));
        });
    }
}
```

--------------------------------

### Eager Load Relationships for Models in Laravel Collection

Source: https://laravel.com/docs/12.x/eloquent-collections

The `load` method eager loads specified relationships for all models currently within the collection. It supports loading single, multiple, nested relationships, and even conditional eager loading using a closure to customize the query.

```php
$users->load(['comments', 'posts']);

$users->load('comments.author');

$users->load(['comments', 'posts' => fn ($query) => $query->where('active', 1)]);
```

--------------------------------

### Use Eloquent `withSum` for Other Aggregate Functions

Source: https://laravel.com/docs/12.x/eloquent-relationships

Demonstrates using `withSum` to calculate the sum of a column on related models. Eloquent provides similar methods like `withMin`, `withMax`, `withAvg`, and `withExists`, which add a `{relation}_{function}_{column}` attribute to the parent models.

```php
use App\Models\Post;

$posts = Post::withSum('comments', 'votes')->get();

foreach ($posts as $post) {
    echo $post->comments_sum_votes;
}
```

--------------------------------

### Make Eloquent Model Attributes Visible for JSON/Array Serialization in PHP

Source: https://laravel.com/docs/12.x/eloquent-serialization

Use the `$visible` property in an Eloquent model to create an "allow list" of attributes. Only the attributes specified in this array will be included in the model's array or JSON serialization, hiding all others by default.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * The attributes that should be visible in arrays.
     *
     * @var array
     */
    protected $visible = ['first_name', 'last_name'];
}
```

--------------------------------

### Utilize Dynamic Eloquent Local Scopes in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This PHP example demonstrates how to call a dynamic local scope, passing the required arguments. The scope applies a query constraint based on the provided parameter, filtering results dynamically.

```php
$users = User::ofType('admin')->get();
```

--------------------------------

### Pass Arguments to a Castable Value Object in Eloquent Model in PHP

Source: https://laravel.com/docs/12.x/eloquent-mutators

This PHP example illustrates how to pass arguments to a `Castable` value object when defining it in an Eloquent model's `casts` array. These arguments will be received by the `castUsing` static method of the `Castable` class, enabling dynamic casting behavior.

```php
use App\ValueObjects\Address;

protected function casts(): array
{
    return [
        'address' => Address::class.':argument',
    ];
}
```

--------------------------------

### Eager Load Multiple Relationships with Laravel Eloquent

Source: https://laravel.com/docs/12.x/eloquent-relationships

This PHP code shows how to eager load several relationships on a model simultaneously. By passing an array of relationship names to the `with` method, both 'author' and 'publisher' relationships are loaded efficiently.

```php
$books = Book::with(['author', 'publisher'])->get();
```

--------------------------------

### Return Custom Laravel Resource Collection via Route

Source: https://laravel.com/docs/12.x/eloquent-resources

Demonstrates how to instantiate and return a custom `UserCollection` from a Laravel route or controller. This approach utilizes the explicitly defined custom collection, enabling the inclusion of bespoke metadata as configured in the `UserCollection` class.

```php
use App\Http\Resources\UserCollection;
use App\Models\User;

Route::get('/users', function () {
    return new UserCollection(User::all());
});
```