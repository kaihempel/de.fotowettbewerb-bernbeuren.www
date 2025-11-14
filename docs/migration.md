### Refresh N Laravel Migrations (Rollback and Migrate)

Source: https://laravel.com/docs/12.x/migrations

Specify a `step` option with `migrate:refresh` to roll back and re-migrate a limited number of the most recent migrations. This provides a way to re-apply recent changes without affecting older, stable migrations.

```shell
php artisan migrate:refresh --step=5
```

--------------------------------

### Refresh Laravel Migrations (Rollback and Migrate)

Source: https://laravel.com/docs/12.x/migrations

The `migrate:refresh` command first rolls back all migrations and then re-runs them, effectively recreating the database schema. An optional `--seed` flag can be used to run database seeders immediately after migration, populating the newly created tables.

```shell
php artisan migrate:refresh

# Refresh the database and run all database seeds...
php artisan migrate:refresh --seed
```

--------------------------------

### Generate Laravel Failed Jobs Database Migration

Source: https://laravel.com/docs/12.x/queues

This shell command sequence creates a new migration file for the `failed_jobs` table, which stores information about jobs that have exceeded their retry attempts. The `migrate` command then runs the migration to create the table in the database.

```shell
php artisan make:queue-failed-table

php artisan migrate
```

--------------------------------

### Create and Run Database Notification Migration

Source: https://laravel.com/docs/12.x/notifications

These Artisan commands generate a database migration for storing notification information and then run the migration. This sets up the necessary table for Laravel's database notification channel.

```shell
php artisan make:notifications-table

php artisan migrate
```

--------------------------------

### Isolate Laravel Migration Execution with --isolated

Source: https://laravel.com/docs/12.x/migrations

Runs migrations while acquiring an atomic lock using the application's cache driver, preventing multiple servers from simultaneously attempting to migrate the database during deployment. This ensures data consistency but requires a compatible and shared cache driver.

```shell
php artisan migrate --isolated
```

--------------------------------

### Conditionally Run Laravel Migration with shouldRun Method

Source: https://laravel.com/docs/12.x/migrations

This PHP example demonstrates how to implement a `shouldRun` method within a migration class. If this method returns `false`, the migration will be skipped during the execution process, enabling conditional migration based on application features or other logic.

```php
use App\Models\Flights;
use Laravel\Pennant\Feature;

/**
 * Determine if this migration should run.
 */
public function shouldRun(): bool
{
    return Feature::active(Flights::class);
}
```

--------------------------------

### Generate Laravel Database Session Migration

Source: https://laravel.com/docs/12.x/session

This command generates a database migration to create the `sessions` table, which is required when using the `database` session driver in Laravel. After generating, the `migrate` command applies the migration to the database.

```shell
php artisan make:session-table

php artisan migrate
```

--------------------------------

### Drop All Tables and Run Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `migrate:fresh` command drops all tables from the database and then executes all migrations. This command is useful for starting with a completely clean database schema, and can also run seeders with `--seed`.

```shell
php artisan migrate:fresh

php artisan migrate:fresh --seed
```

--------------------------------

### Generate Laravel Queue Batches Table Migration

Source: https://laravel.com/docs/12.x/queues

Shows the Artisan commands necessary to generate a database migration for the `queue_batches` table, which is essential for utilizing Laravel's job batching feature, and then running the migration.

```shell
php artisan make:queue-batches-table

php artisan migrate
```

--------------------------------

### Rollback All Laravel Database Migrations

Source: https://laravel.com/docs/12.x/migrations

The `migrate:reset` command will roll back all of your application's migrations, effectively reverting the database to a state before any migrations were ever run. This is a comprehensive reset of the schema.

```shell
php artisan migrate:reset
```

--------------------------------

### Generate Laravel Database Queue Migration

Source: https://laravel.com/docs/12.x/queues

These Artisan commands are used to set up the database queue driver. The first command creates a migration file for the 'jobs' table, and the second command runs pending migrations to create the table in the database.

```shell
php artisan make:queue-table

php artisan migrate
```

--------------------------------

### Publish Laravel Package Migrations

Source: https://laravel.com/docs/12.x/packages

Inform Laravel about your package's database migrations so they can be published by the user. Use the `publishesMigrations` method in your service provider's `boot` method, specifying the directory containing your migrations. Laravel will automatically update the timestamps of published migrations.

```php
/**
 * Bootstrap any package services.
 */
public function boot(): void
{
    $this->publishesMigrations([
        __DIR__.'/../database/migrations' => database_path('migrations'),
    ]);
}
```

--------------------------------

### View Status of Laravel Database Migrations

Source: https://laravel.com/docs/12.x/migrations

Displays a list of all migrations, indicating which ones have been run and which are still pending execution. This command provides an overview of the current state of your database schema.

```shell
php artisan migrate:status
```

--------------------------------

### Drop All Tables and Run Laravel Migrations for Specific Connection

Source: https://laravel.com/docs/12.x/migrations

Use the `--database` option with `migrate:fresh` to specify which database connection should have its tables dropped and migrations run. This is essential when working with multiple database connections within a Laravel application.

```shell
php artisan migrate:fresh --database=admin
```

--------------------------------

### Run Laravel Database Migrations

Source: https://laravel.com/docs/12.x/index

After configuring a new database connection in Laravel's `.env` file (e.g., from SQLite to MySQL), this command is used to execute all pending database migrations. It creates the necessary tables in the newly configured database.

```bash
php artisan migrate
```

--------------------------------

### Rollback Latest Laravel Database Migration

Source: https://laravel.com/docs/12.x/migrations

This command rolls back the last batch of migrations that were run, which may include multiple migration files. It is used to undo the most recent set of database schema changes.

```shell
php artisan migrate:rollback
```

--------------------------------

### Rollback Specific Batch of Laravel Database Migrations

Source: https://laravel.com/docs/12.x/migrations

To roll back all migrations associated with a particular batch, use the `batch` option. The batch number corresponds to entries in your application's `migrations` database table, allowing for targeted rollbacks.

```shell
php artisan migrate:rollback --batch=3
```

--------------------------------

### Rollback N Laravel Database Migrations

Source: https://laravel.com/docs/12.x/migrations

Use the `step` option with the `migrate:rollback` command to undo a specific number of the most recent migrations. This provides granular control over reverting database schema changes.

```shell
php artisan migrate:rollback --step=5
```

--------------------------------

### Generate Eloquent Model with Migration in Laravel

Source: https://laravel.com/docs/12.x/eloquent

Use this Artisan command to create an Eloquent model and its corresponding database migration file simultaneously, streamlining the setup for a new table and its model.

```shell
php artisan make:model Flight --migration
```

--------------------------------

### Define a GEOGRAPHY Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `geography` method creates a `GEOGRAPHY` column with a specified spatial type and SRID (Spatial Reference System Identifier). This is used for storing geographic data. Database driver support and extensions like PostGIS for PostgreSQL are required.

```php
$table->geography('coordinates', subtype: 'point', srid: 4326);
```

--------------------------------

### Set Database Connection for Laravel Migration

Source: https://laravel.com/docs/12.x/migrations

This PHP snippet illustrates how to specify a different database connection (e.g., 'pgsql') for a specific migration. By setting the `protected $connection` property, the migration will interact with the designated database instead of the application's default connection.

```php
/**
 * The database connection that should be used by the migration.
 *
 * @var string
 */
protected $connection = 'pgsql';

/**
 * Run the migrations.
 */
public function up(): void
{
    // ...
}
```

--------------------------------

### Force Laravel Migrations in Production with --force

Source: https://laravel.com/docs/12.x/migrations

Bypasses the confirmation prompt when running potentially destructive migration commands in a production environment. Use this flag with extreme caution, as it can lead to data loss if not handled carefully.

```shell
php artisan migrate --force
```

--------------------------------

### Reset Database Using Migrations in Laravel Dusk

Source: https://laravel.com/docs/12.x/dusk

Demonstrates applying the `DatabaseMigrations` trait within Dusk tests to reset the database before each test. This ensures a consistent testing environment by re-running all migrations.

```php
<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;

pest()->use(DatabaseMigrations::class);

//

```

```php
<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    use DatabaseMigrations;

    //
}

```

--------------------------------

### Define an INTEGER Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `integer` method creates an `INTEGER` equivalent column. This is used for storing whole numbers.

```php
$table->integer('votes');
```

--------------------------------

### Define Laravel Migration to Create 'flights' Table

Source: https://laravel.com/docs/12.x/migrations

This PHP migration class demonstrates how to create a new 'flights' table with an auto-incrementing ID, string fields for name and airline, and standard timestamps using Laravel's schema builder within the `up` method. The corresponding `down` method provides the reversal logic by dropping the 'flights' table.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('airline');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('flights');
    }
};
```

--------------------------------

### Preview Laravel Migration SQL Statements with --pretend

Source: https://laravel.com/docs/12.x/migrations

Shows the raw SQL statements that would be executed by the migrations without actually applying them to the database. This is useful for reviewing and validating schema changes before committing them.

```shell
php artisan migrate --pretend
```

--------------------------------

### Define a DOUBLE Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `double` method creates a `DOUBLE` equivalent column. This is used for storing floating-point numbers with double precision.

```php
$table->double('amount');
```

--------------------------------

### Generate Database Cache Table Migration in Laravel

Source: https://laravel.com/docs/12.x/cache

This command creates the necessary database table for Laravel's 'database' cache driver. It's used when the default migration for the cache table is not present, followed by running the migrations.

```shell
php artisan make:cache-table

php artisan migrate
```

--------------------------------

### Create ULID Column in Laravel Migration

Source: https://laravel.com/docs/12.x/migrations

The `ulid` method creates a ULID (Universally Unique Lexicographically Sortable Identifier) equivalent column in a database table. It is used within a Laravel migration's schema definition to add a column that stores ULID values.

```php
$table->ulid('id');
```

--------------------------------

### Define a FLOAT Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `float` method creates a `FLOAT` equivalent column. It can specify the precision for single-precision floating-point numbers.

```php
$table->float('amount', precision: 53);
```

--------------------------------

### Create Year Column in Laravel Migration

Source: https://laravel.com/docs/12.x/migrations

The `year` method creates a `YEAR` equivalent column in a database table, suitable for storing year values. This can be useful for birth years, publication years, or other date-related attributes.

```php
$table->year('birth_year');
```

--------------------------------

### Preview Laravel Migration Rollback SQL Statements

Source: https://laravel.com/docs/12.x/migrations

The `--pretend` flag allows you to view the SQL statements that would be executed during a `migrate:rollback` operation without actually applying the changes to the database. This is useful for verifying the intended database modifications.

```shell
php artisan migrate:rollback --pretend
```

--------------------------------

### Create Vector Column in Laravel Migration

Source: https://laravel.com/docs/12.x/migrations

The `vector` method creates a column designed to store vector embeddings, typically used in machine learning or AI applications. It requires specifying the number of dimensions for the vector.

```php
$table->vector('embedding', dimensions: 100);
```

--------------------------------

### Define a JSON Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `json` method creates a `JSON` equivalent column for storing structured data. When using SQLite, it defaults to a `TEXT` column. This is useful for flexible data storage.

```php
$table->json('options');
```

--------------------------------

### Create Unique Index by Chaining (PHP)

Source: https://laravel.com/docs/12.x/migrations

Demonstrates how to create a unique index on a new column by chaining the `unique()` method directly to the column definition within a Laravel migration. This ensures that all values in the column are distinct.

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->string('email')->unique();
});
```

--------------------------------

### Define a ULID Foreign Key Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `foreignUlid` method creates a `ULID` equivalent column, suitable for Universally Unique Lexicographically Sortable Identifiers. This provides a unique, sortable identifier for foreign key relationships.

```php
$table->foreignUlid('user_id');
```

--------------------------------

### Define a UUID Foreign Key Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `foreignUuid` method creates a `UUID` equivalent column, suitable for Universally Unique Identifiers. This provides a unique identifier for foreign key relationships.

```php
$table->foreignUuid('user_id');
```

--------------------------------

### Create UUID Column in Laravel Migration

Source: https://laravel.com/docs/12.x/migrations

The `uuid` method creates a UUID (Universally Unique Identifier) equivalent column in a database table. This is commonly used for primary keys or unique identifiers where a distributed, non-sequential ID is preferred.

```php
$table->uuid('id');
```

--------------------------------

### Define an Auto-Incrementing Primary Key Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `increments` method creates an auto-incrementing `UNSIGNED INTEGER` equivalent column, suitable for a primary key. It ensures unique, sequential identifiers for table records.

```php
$table->increments('id');
```

--------------------------------

### Define a GEOMETRY Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `geometry` method creates a `GEOMETRY` column with a specified spatial type and SRID (Spatial Reference System Identifier). This is used for storing geometric data. Database driver support and extensions like PostGIS for PostgreSQL are required.

```php
$table->geometry('positions', subtype: 'point', srid: 0);
```

--------------------------------

### Install Laravel Cashier Package and Publish Migrations/Config (Shell)

Source: https://laravel.com/docs/12.x/billing

This series of commands installs the Laravel Cashier package via Composer, publishes its database migrations, runs the migrations, and optionally publishes the configuration file. These steps are essential for setting up Cashier's database tables and default settings.

```shell
composer require laravel/cashier
```

```shell
php artisan vendor:publish --tag="cashier-migrations"
```

```shell
php artisan migrate
```

```shell
php artisan vendor:publish --tag="cashier-config"
```

--------------------------------

### Define an IP Address Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `ipAddress` method creates a `VARCHAR` equivalent column for storing IP addresses. When using PostgreSQL, it intelligently creates an `INET` column. This method simplifies storing network addresses.

```php
$table->ipAddress('visitor');
```

--------------------------------

### Define an UNSIGNED BIGINT Foreign ID Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `foreignId` method creates an `UNSIGNED BIGINT` equivalent column, typically used for foreign keys. This method is a convenient way to define ID columns that will reference other tables.

```php
$table->foreignId('user_id');
```

--------------------------------

### Define a LONGTEXT Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `longText` method creates a `LONGTEXT` equivalent column, suitable for storing large amounts of text. For MySQL or MariaDB, it can be combined with `charset('binary')` to create a `LONGBLOB` for binary data. This is ideal for extensive descriptions or content.

```php
$table->longText('description');
```

```php
$table->longText('data')->charset('binary'); // LONGBLOB
```

--------------------------------

### Install Laravel Passport with Artisan

Source: https://laravel.com/docs/12.x/passport

Installs Laravel Passport by running necessary database migrations for OAuth2 clients and access tokens, and generates encryption keys. This command sets up the basic Passport infrastructure.

```shell
php artisan install:api --passport
```

--------------------------------

### Define a JSONB Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `jsonb` method creates a `JSONB` equivalent column, which is a binary JSON format often more efficient for querying. When using SQLite, it defaults to a `TEXT` column. This provides optimized storage for JSON data.

```php
$table->jsonb('options');
```

--------------------------------

### Set Default JSON Array with Expression in Laravel Migration

Source: https://laravel.com/docs/12.x/migrations

This migration example shows how to set a default value for a JSON column using a database-specific expression. By using `Illuminate\Database\Query\Expression`, Laravel avoids quoting the value, allowing direct use of database functions like `JSON_ARRAY()` for default values. Support for default expressions depends on the database driver, version, and field type.

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->json('movies')->default(new Expression('(JSON_ARRAY())'));
            $table->timestamps();
        });
    }
};
```

--------------------------------

### Define a DECIMAL Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `decimal` method creates a `DECIMAL` column with specified total digits (precision) and decimal places (scale). This is useful for storing precise numerical values like currency. For example, it can define a column named 'amount' with a total of 8 digits, 2 of which are after the decimal point.

```php
$table->decimal('amount', total: 8, places: 2);
```

--------------------------------

### Apply Nullable Modifier to Column in Laravel Migration

Source: https://laravel.com/docs/12.x/migrations

This example demonstrates how to apply the `nullable` modifier to a column, allowing it to store `NULL` values. The `nullable()` method is chained after the column type definition within a Laravel schema builder. This snippet uses `Schema::table` to modify an existing table.

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->string('email')->nullable();
});
```

--------------------------------

### Define an ENUM Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `enum` method creates an `ENUM` column, restricting values to a predefined set. It can accept an array of strings or the `Enum::cases()` method for more dynamic enum definitions. This ensures data integrity by limiting column entries to specific valid options.

```php
$table->enum('difficulty', ['easy', 'hard']);
```

```php
use App\Enums\Difficulty;

$table->enum('difficulty', Difficulty::cases());
```

--------------------------------

### Define a Foreign ID Column for a Model in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `foreignIdFor` method adds a `{column}_id` equivalent column for a given model class. The column type (`UNSIGNED BIGINT`, `CHAR(36)`, or `CHAR(26)`) adapts based on the model's key type. This simplifies creating foreign keys that follow Eloquent conventions.

```php
$table->foreignIdFor(User::class);
```

--------------------------------

### Add and Remove `deleted_at` Column using Laravel Migrations

Source: https://laravel.com/docs/12.x/eloquent

Laravel's schema builder provides `softDeletes()` and `dropSoftDeletes()` helper methods to easily add or remove the `deleted_at` timestamp column to your database table, which is required for Eloquent soft deletes.

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('flights', function (Blueprint $table) {
    $table->softDeletes();
});

Schema::table('flights', function (Blueprint $table) {
    $table->dropSoftDeletes();
});
```

--------------------------------

### Define an Auto-Incrementing Primary ID Column in Laravel Migrations

Source: https://laravel.com/docs/12.x/migrations

The `id` method is an alias for `bigIncrements`, creating an auto-incrementing `UNSIGNED BIGINT` primary key. By default, it names the column 'id', but a custom name can be provided. This is a common way to define primary keys.

```php
$table->id();
```

--------------------------------

### Publish Laravel Pennant Configuration and Migration Files

Source: https://laravel.com/docs/12.x/pennant

This Artisan command publishes the configuration file (`config/pennant.php`) and migration files for Laravel Pennant. It's essential for customizing Pennant's settings and setting up its database tables.

```shell
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
```

--------------------------------

### Migrate to UUIDv4 for Models in Laravel Eloquent (PHP)

Source: https://laravel.com/docs/12.x/upgrade

In Laravel 12.x, the `HasUuids` trait now generates UUIDv7 compatible IDs. If you need to retain the previous behavior of using ordered UUIDv4 strings for model IDs, you must switch to using the `HasVersion4Uuids` trait instead.

```php
use Illuminate\Database\Eloquent\Concerns\HasVersion4Uuids as HasUuids;
```

--------------------------------

### Define Envoy Deploy Task with Conditional Variable Usage (Blade)

Source: https://laravel.com/docs/12.x/envoy

This Blade snippet defines an Envoy task named 'deploy' that runs on a remote server. It demonstrates how to conditionally execute commands based on a passed variable, like '$branch', and performs a git pull and artisan migration.

```Blade
@servers(['web' => ['user@192.168.1.1']])

@task('deploy', ['on' => 'web'])
    cd /home/user/example.com

    @if ($branch)
        git pull origin {{ $branch }}
    @endif

    php artisan migrate --force
@endtask
```

--------------------------------

### Enable Database Truncation in Laravel Dusk Tests

Source: https://laravel.com/docs/12.x/dusk

This snippet demonstrates how to apply the `DatabaseTruncation` trait to your test classes. It ensures that the database is migrated once and then truncated for subsequent tests, offering a performance boost. Examples are provided for both Pest and PHPUnit testing frameworks.

```php
<?php

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Laravel\Dusk\Browser;

pest()->use(DatabaseTruncation::class);

//

```

```php
<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    use DatabaseTruncation;

    //
}

```

--------------------------------

### Define an Auto-Incrementing Big Integer Primary Key in Laravel

Source: https://laravel.com/docs/12.x/migrations

The `bigIncrements` method is used in Laravel migrations to create an auto-incrementing `UNSIGNED BIGINT` column, which serves as a primary key. It's suitable for tables expected to have a very large number of records. This method takes the column name as its argument.

```php
$table->bigIncrements('id');
```

--------------------------------

### Run Laravel Artisan Commands with Xdebug in Sail

Source: https://laravel.com/docs/12.x/sail

Demonstrates how to execute Laravel Artisan commands both without (`sail artisan migrate`) and with an active Xdebug session (`sail debug migrate`). The `sail debug` command facilitates debugging for CLI-based operations within the Sail environment.

```shell
# Run an Artisan command without Xdebug...
sail artisan migrate

# Run an Artisan command with Xdebug...
sail debug migrate
```

--------------------------------

### Install Laravel Telescope

Source: https://laravel.com/docs/12.x/telescope

Installs Laravel Telescope via Composer, publishes its assets and migrations, and then runs database migrations to create the necessary tables for storing Telescope's data.

```shell
composer require laravel/telescope
```

```shell
php artisan telescope:install
```

```shell
php artisan migrate
```

--------------------------------

### Publish Fortify Resources using Artisan

Source: https://laravel.com/docs/12.x/fortify

Run this Artisan command to publish Fortify's essential resources to your application. It generates action files, the service provider, configuration file, and database migrations required for Fortify to function.

```shell
php artisan fortify:install
```

--------------------------------

### Install Laravel Telescope for Local Development Only

Source: https://laravel.com/docs/12.x/telescope

Installs Laravel Telescope as a development dependency, publishes its assets and migrations, and runs database migrations. This approach is used when Telescope is intended only for local development environments.

```shell
composer require laravel/telescope --dev
```

```shell
php artisan telescope:install
```

```shell
php artisan migrate
```

--------------------------------

### Publish Laravel Pulse Vendor Files

Source: https://laravel.com/docs/12.x/pulse

Run this Artisan command to publish Pulse's essential files, including configuration and database migrations. This makes them accessible for customization within your application.

```shell
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"
```

--------------------------------

### Specify Tables for Database Truncation in Laravel Dusk

Source: https://laravel.com/docs/12.x/dusk

This code shows how to define which tables should be truncated by setting the `$tablesToTruncate` property in your test class. By default, all tables except 'migrations' are truncated; this allows for explicit control over the truncation scope.

```php
/**
 * Indicates which tables should be truncated.
 *
 * @var array
 */
protected $tablesToTruncate = ['users'];

```

--------------------------------

### Display help screen for a Laravel Artisan command

Source: https://laravel.com/docs/12.x/artisan

Use this shell command to view detailed information, including arguments, options, and a description, for a specific Artisan command like `migrate`.

```shell
php artisan help migrate
```

--------------------------------

### Reset database after tests in Laravel with RefreshDatabase trait

Source: https://laravel.com/docs/12.x/database-testing

This snippet demonstrates how to use the `RefreshDatabase` trait in Laravel tests (Pest or PHPUnit) to automatically reset the database after each test. This prevents data from previous tests from affecting subsequent ones, ensuring test isolation. The trait runs tests within a database transaction, which is faster than full migrations.

```php
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

test('basic example', function () {
    $response = $this->get('/');

    // ...
});
```

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic functional test example.
     */
    public function test_basic_example(): void
    {
        $response = $this->get('/');

        // ...
    }
}
```

--------------------------------

### Modify Column and Index Simultaneously (PHP)

Source: https://laravel.com/docs/12.x/migrations

Explains how to add or drop indexes when modifying a column's definition. The `change` method itself doesn't alter indexes, so index modifiers must be used explicitly alongside the column modification.

```php
// Add an index...
$table->bigIncrements('id')->primary()->change();

// Drop an index...
$table->char('postal_code', 10)->unique(false)->change();
```

--------------------------------

### Publish Specific Package File Groups in Laravel (PHP)

Source: https://laravel.com/docs/12.x/packages

Illustrates how to define and publish different groups of package assets or resources, such as configuration files and migrations, separately by 'tagging' them within the service provider's 'boot' method. This allows users to publish only what they need.

```php
/**
 * Bootstrap any package services.
 */
public function boot(): void
{
    $this->publishes([
        __DIR__.'/../config/package.php' => config_path('package.php')
    ], 'courier-config');

    $this->publishesMigrations([
        __DIR__.'/../database/migrations/' => database_path('migrations')
    ], 'courier-migrations');
}
```

--------------------------------

### Define Envoy Task with Confirmation Prompt (Blade)

Source: https://laravel.com/docs/12.x/envoy

This Blade snippet shows how to add a confirmation prompt before executing a sensitive Envoy task. By setting `confirm` to `true`, the user will be asked to approve the task's execution, which is especially useful for destructive operations like database migrations.

```Blade
@task('deploy', ['on' => 'web', 'confirm' => true])
    cd /home/user/example.com
    git pull origin {{ $branch }}
    php artisan migrate
@endtask
```

--------------------------------

### Rename an Existing Database Table (PHP)

Source: https://laravel.com/docs/12.x/migrations

This code demonstrates how to rename an existing database table. The `Schema::rename` method is used, requiring two arguments: the current table name (`$from`) and the new table name (`$to`).

```php
use Illuminate\Support\Facades\Schema;

Schema::rename($from, $to);
```

--------------------------------

### Publish default Artisan command stubs for customization via shell

Source: https://laravel.com/docs/12.x/artisan

Explains how to publish the default Artisan `make` command stubs to your application's `stubs` directory. This allows for customization of generated classes like controllers, jobs, and migrations.

```shell
php artisan stub:publish
```

--------------------------------

### Import External Envoy Tasks and Stories

Source: https://laravel.com/docs/12.x/envoy

Demonstrates the use of the `@import` directive to include tasks and stories defined in other `Envoy.blade.php` files. This allows for modular organization and reuse of Envoy configurations.

```blade
@import('vendor/package/Envoy.blade.php')
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

### Translate Keys with Inflection using Laravel trans_choice()

Source: https://laravel.com/docs/12.x/strings

The `trans_choice()` helper function translates a given translation key, applying inflection based on a provided count. Similar to `trans()`, it returns the key if the translation is not found.

```php
echo trans_choice('messages.notifications', $unreadCount);
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

### Assert Moved Permanently HTTP Status (PHP)

Source: https://laravel.com/docs/12.x/http-tests

Assert that the response has a moved permanently (301) HTTP status code. This confirms that a resource has been permanently redirected to a new URI.

```php
$response->assertMovedPermanently();
```

--------------------------------

### Define Foreign Key with On Update/Delete Actions (Laravel)

Source: https://laravel.com/docs/12.x/migrations

This snippet illustrates how to define foreign key constraints with specific actions for `onUpdate` and `onDelete` events, such as 'cascade'. These actions dictate the behavior of related records when the referenced key is updated or deleted.

```php
$table->foreignId('user_id')
    ->constrained()
    ->onUpdate('cascade')
    ->onDelete('cascade');
```

--------------------------------

### Get Eloquent Model Current and Previous Attribute Changes (getChanges, getPrevious) in PHP

Source: https://laravel.com/docs/12.x/eloquent

This example shows how `getChanges` and `getPrevious` methods provide insight into attribute modifications after an update operation. `getChanges` returns an array of attributes that were updated with their new values. Conversely, `getPrevious` returns an array of the same attributes but with their original values before the update occurred.

```php
$user = User::find(1);

$user->name; // John
$user->email; // john@example.com

$user->update([
    'name' => 'Jack',
    'email' => 'jack@example.com',
]);

$user->getChanges();

/*
    [
        'name' => 'Jack',
        'email' => 'jack@example.com',
    ]
*/

$user->getPrevious();

/*
    [
        'name' => 'John',
        'email' => 'john@example.com',
    ]
*/
```

--------------------------------

### Rename a Database Column (PHP)

Source: https://laravel.com/docs/12.x/migrations

Demonstrates how to rename an existing column in a database table using the `renameColumn` method within a Laravel schema builder closure. It takes the old column name and the new column name as arguments.

```php
Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('from', 'to');
});
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

### Queue Import Records to Laravel Scout Index via Artisan Command

Source: https://laravel.com/docs/12.x/scout

To import existing records into Laravel Scout using queued jobs, employ the `scout:queue-import` Artisan command. This command supports chunked processing, specified with the `--chunk` option, making it suitable for large datasets.

```shell
php artisan scout:queue-import "App\Models\Post" --chunk=500
```

--------------------------------

### Drop Database Tables (PHP)

Source: https://laravel.com/docs/12.x/migrations

This snippet provides examples for deleting database tables. The `Schema::drop` method removes a table, while `Schema::dropIfExists` safely removes a table only if it exists, preventing errors if the table is already absent.

```php
Schema::drop('users');
```

```php
Schema::dropIfExists('users');
```

--------------------------------

### Modify Column Type and Attributes (PHP)

Source: https://laravel.com/docs/12.x/migrations

Illustrates how to change an existing column's type or attributes, such as increasing string length, using the `change` method in Laravel's schema builder. All desired attributes must be explicitly re-specified to avoid losing them.

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('name', 50)->change();
});
```

--------------------------------

### Modify Column Retaining All Attributes (PHP)

Source: https://laravel.com/docs/12.x/migrations

Shows how to modify a column while explicitly retaining all its original attributes like `unsigned`, `default`, and `comment` using the `change` method. Any modifier not explicitly called will be dropped.

```php
Schema::table('users', function (Blueprint $table) {
    $table->integer('votes')->unsigned()->default(1)->comment('my comment')->change();
});
```

--------------------------------

### Add nullable polymorphic relationship columns in Laravel

Source: https://laravel.com/docs/12.x/migrations

The `nullableMorphs` method is similar to `morphs` but creates nullable versions of the `{column}_id` and `{column}_type` columns. This is useful when the polymorphic relationship might not always exist or can be optional, preventing database errors for missing related entries.

```php
$table->nullableMorphs('taggable');
```

--------------------------------

### Translate Keys with Laravel trans() Function

Source: https://laravel.com/docs/12.x/strings

The `trans()` helper function translates a given translation key using configured language files. If the key does not exist, it returns the key itself.

```php
echo trans('messages.welcome');
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

### Drag and Drop Element to Another in Laravel Dusk

Source: https://laravel.com/docs/12.x/dusk

This PHP code demonstrates dragging an element from one selector to another, simulating a drag-and-drop interaction. The `drag` method takes two selectors: the source element and the target element.

```php
$browser->drag('.from-selector', '.to-selector');
```

--------------------------------

### Create Unique Index Separately (PHP)

Source: https://laravel.com/docs/12.x/migrations

Shows an alternative way to create a unique index by calling the `unique()` method on the schema builder blueprint after the column definition. It accepts the column name as an argument.

```php
$table->unique('email');
```

--------------------------------

### Update Homestead Source Code via Git

Source: https://laravel.com/docs/12.x/homestead

These Git commands are used to update the Homestead source code when the repository was cloned directly. `git fetch` retrieves new data from the remote repository, and `git pull origin release` merges changes from the 'release' branch into the local working directory, ensuring the latest stable version.

```shell
git fetch

git pull origin release
```

--------------------------------

### Add Column to Existing Table (PHP)

Source: https://laravel.com/docs/12.x/migrations

This snippet illustrates how to update an existing database table by adding a new column. It uses the `Schema::table` method, passing the table name and a closure to add an integer column named 'votes' to the 'users' table.

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->integer('votes');
});
```

--------------------------------

### Use placeholders with pluralization and Laravel's trans_choice function

Source: https://laravel.com/docs/12.x/localization

This PHP snippet demonstrates how to define placeholders within pluralization strings and then replace them using the `trans_choice` function. The translation string includes a `:value` placeholder, which is replaced by passing an associative array as the third argument to `trans_choice`, allowing dynamic values to be inserted into the pluralized output.

```php
'minutes_ago' => '{1} :value minute ago|[2,*] :value minutes ago',

echo trans_choice('time.minutes_ago', 5, ['value' => 5]);
```

--------------------------------

### Redirect to Previous Location with back() in Laravel

Source: https://laravel.com/docs/12.x/helpers

The `back` function in Laravel generates an HTTP redirect response, sending the user back to their previous location. It supports optional custom HTTP status codes, headers, and a fallback URL in case the previous location is not available.

```php
return back($status = 302, $headers = [], $fallback = '/');
```

```php
return back();
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

### Manage Belongs To Eloquent Relationships in Laravel

Source: https://laravel.com/docs/12.x/eloquent-relationships

The `associate` method links a child model to a new parent model by setting the foreign key on the child model. Conversely, the `dissociate` method removes this association by setting the relationship's foreign key to `null`. Both operations require saving the child model to persist the changes to the database.

```php
use App\Models\Account;

$account = Account::find(10);

$user->account()->associate($account);

$user->save();
```

```php
$user->account()->dissociate();

$user->save();
```

--------------------------------

### Import All Records to Laravel Scout Index via Artisan Command

Source: https://laravel.com/docs/12.x/scout

Batch import all existing database records of a specific model into your Laravel Scout search indexes using the `scout:import` Artisan command. This is useful when integrating Scout into an existing project with pre-populated data.

```shell
php artisan scout:import "App\Models\Post"
```

--------------------------------

### Extract items from an array with Arr::take (PHP)

Source: https://laravel.com/docs/12.x/helpers

The `Arr::take` method returns a new array containing a specified number of items. A positive integer takes items from the beginning of the array, while a negative integer takes them from the end. This helper is part of `Illuminate\Support\Arr`.

```php
use Illuminate\Support\Arr;

$array = [0, 1, 2, 3, 4, 5];

$chunk = Arr::take($array, 3);

// [0, 1, 2]
```

```php
$array = [0, 1, 2, 3, 4, 5];

$chunk = Arr::take($array, -2);

// [4, 5]
```

--------------------------------

### Count Related Models on Morph To Relationships using `morphWithCount`

Source: https://laravel.com/docs/12.x/eloquent-relationships

Explains how to eager load 'morph to' relationships and their related model counts. It uses `with` in combination with the `morphTo` relationship's `morphWithCount` method to count different related entities (e.g., tags for photos, comments for posts) dynamically based on the parentable type.

```php
use Illuminate\Database\Eloquent\Relations\MorphTo;

$activities = ActivityFeed::with([
    'parentable' => function (MorphTo $morphTo) {
        $morphTo->morphWithCount([
            Photo::class => ['tags'],
            Post::class => ['comments'],
        ]);
    }])->get();
```

--------------------------------

### Cache Laravel Event Mappings (Artisan)

Source: https://laravel.com/docs/12.x/deployment

This command caches the application's auto-discovered event to listener mappings. Running it during your deployment process optimizes event loading and improves application performance.

```shell
php artisan event:cache
```

--------------------------------

### Dispatch Eloquent Model Events with $dispatchesEvents in Laravel

Source: https://laravel.com/docs/12.x/eloquent

This code demonstrates how to map Eloquent model lifecycle events to custom event classes using the `$dispatchesEvents` property within a Laravel model. Each mapped event, like `saved` or `deleted`, will dispatch the specified event class, allowing for structured event handling.

```php
<?php

namespace App\Models;

use App\Events\UserDeleted;
use App\Events\UserSaved;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The event map for the model.
     *
     * @var array<string, string>
     */
    protected $dispatchesEvents = [
        'saved' => UserSaved::class,
        'deleted' => UserDeleted::class,
    ];
}
```

--------------------------------

### Forward Additional Network Ports in Homestead.yaml

Source: https://laravel.com/docs/12.x/homestead

This YAML configuration shows how to forward additional network ports from your host machine to the Vagrant box. Specify `send` (host port), `to` (guest port), and optionally `protocol` (TCP is default) for custom port mapping.

```yaml
ports:
    - send: 50000
      to: 5000
    - send: 7777
      to: 777
      protocol: udp
```

--------------------------------

### Load Morph Count for Polymorphic Relationships in Laravel

Source: https://laravel.com/docs/12.x/eloquent-relationships

This code demonstrates how to use `loadMorphCount` to defer the loading of relationship counts for various `parentable` models associated with `ActivityFeed` instances. It allows specifying different relationships to count for each morphable type.

```php
$activities = ActivityFeed::with('parentable')->get();

$activities->loadMorphCount('parentable', [
    Photo::class => ['tags'],
    Post::class => ['comments'],
]);
```

--------------------------------

### Add nullable ULID polymorphic relationship columns in Laravel

Source: https://laravel.com/docs/12.x/migrations

The `nullableUlidMorphs` method creates nullable columns for polymorphic relationships, specifically using ULIDs for the ID. This allows for optional ULID-based polymorphic associations.

```php
$table->nullableUlidMorphs('taggable');
```

--------------------------------

### Flash Input and Redirect in Laravel

Source: https://laravel.com/docs/12.x/requests

This snippet illustrates how to combine input flashing with redirection using `withInput()`. This is a common pattern to repopulate forms when validation fails, redirecting back to the form with the previously entered data. It can also exclude specific fields before flashing.

```php
return redirect('/form')->withInput();

return redirect()->route('user.create')->withInput();

return redirect('/form')->withInput(
    $request->except('password')
);
```

--------------------------------

### Define BelongsTo/MorphTo Relationships within Laravel Factory definition

Source: https://laravel.com/docs/12.x/eloquent-factories

Shows how to define inverse relationships like `belongsTo` or `morphTo` directly within a model's factory `definition` method. This is typically done by assigning a new factory instance to the foreign key of the relationship.

```php
use App\Models\User;

/**
 * Define the model's default state.
 *
 * @return array<string, mixed>
 */
public function definition(): array
{
    return [
        'user_id' => User::factory(),
        'title' => fake()->title(),
        'content' => fake()->paragraph(),
    ];
}
```

--------------------------------

### Recursively Save Eloquent Model and Relationships with `push`

Source: https://laravel.com/docs/12.x/eloquent-relationships

Shows how to use the `push` method to save a parent model and all of its associated relationships that have been modified. This is useful for persisting changes across an entire model graph with one call.

```php
$post = Post::find(1);

$post->comments[0]->message = 'Message';
$post->comments[0]->author->name = 'Author Name';

$post->push();
```

--------------------------------

### Define ULID Morph Columns for Eloquent Relationships in Laravel

Source: https://laravel.com/docs/12.x/migrations

The `ulidMorphs` method is a convenience for defining polymorphic Eloquent relationships using ULID identifiers. It automatically creates `{column}_id` (CHAR(26)) and `{column}_type` (VARCHAR) columns for the specified relationship name.

```php
$table->ulidMorphs('taggable');
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

### Conditionally Apply Transformation if String Doesn't Start With Substring with Laravel `Str::of()->whenDoesntStartWith()` in PHP

Source: https://laravel.com/docs/12.x/strings

The `whenDoesntStartWith` method executes a closure if the `Stringable` instance does not begin with a specified substring. The closure receives the fluent string for modification.

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('disney world')->whenDoesntStartWith('sea', function (Stringable $string) {
    return $string->title();
});

// 'Disney World'
```

--------------------------------

### Querying All Related Morph To Models with Wildcard in Laravel

Source: https://laravel.com/docs/12.x/eloquent-relationships

This snippet demonstrates using a wildcard (`*`) with `whereHasMorph` to query across all possible polymorphic types of a "morph to" relationship. It allows applying constraints to all related models without explicitly listing each type, though it requires an additional database query.

```php
use Illuminate\Database\Eloquent\Builder;

$comments = Comment::whereHasMorph('commentable', '*', function (Builder $query) {
    $query->where('title', 'like', 'foo%');
})->get();
```