### Scope Event Fakes in Laravel with `Event::fakeFor`

Source: https://laravel.com/docs/12.x/events

This code demonstrates how to temporarily fake event dispatching for a specific closure using `Event::fakeFor` in Laravel tests. It ensures that events within the closure are faked and asserted, while events outside the closure dispatch normally. This is useful for isolating event behavior during testing.

```php
<?php

use AppEventsOrderCreated;
use AppModelsOrder;
use IlluminateSupportFacadesEvent;

test('orders can be processed', function () {
    $order = Event::fakeFor(function () {
        $order = Order::factory()->create();

        Event::assertDispatched(OrderCreated::class);

        return $order;
    });

    // Events are dispatched as normal and observers will run...
    $order->update([
        // ...
    ]);
});
```

```php
<?php

namespace TestsFeature;

use AppEventsOrderCreated;
use AppModelsOrder;
use IlluminateSupportFacadesEvent;
use TestsTestCase;

class ExampleTest extends TestCase
{
    /**
     * Test order process.
     */
    public function test_orders_can_be_processed(): void
    {
        $order = Event::fakeFor(function () {
            $order = Order::factory()->create();

            Event::assertDispatched(OrderCreated::class);

            return $order;
        });

        // Events are dispatched as normal and observers will run...
        $order->update([
            // ...
        ]);
    }
}
```

--------------------------------

### Fake Specific Laravel Events for Testing

Source: https://laravel.com/docs/12.x/events

This code illustrates how to fake only a specific subset of events using `Event::fake([EventClass::class])`. Other events will be dispatched normally. This is useful when you only want to mock the behavior of certain events while allowing others to run their listeners. Examples are provided for both Pest and PHPUnit testing frameworks.

```php
test('orders can be processed', function () {
    Event::fake([
        OrderCreated::class,
    ]);

    $order = Order::factory()->create();

    Event::assertDispatched(OrderCreated::class);

    // Other events are dispatched as normal...
    $order->update([
        // ...
    ]);
});
```

```php
/**
 *
 * Test order process.
 */
public function test_orders_can_be_processed(): void
{
    Event::fake([
        OrderCreated::class,
    ]);

    $order = Order::factory()->create();

    Event::assertDispatched(OrderCreated::class);

    // Other events are dispatched as normal...
    $order->update([
        // ...
    ]);
}
```

--------------------------------

### Generate Laravel Event and Listener Classes with Artisan

Source: https://laravel.com/docs/12.x/events

Use the `make:event` and `make:listener` Artisan commands to quickly scaffold event and listener classes. Listeners can be generated with a specific event to listen for, or interactively, prompting for details.

```shell
php artisan make:event PodcastProcessed

php artisan make:listener SendPodcastNotification --event=PodcastProcessed
```

```shell
php artisan make:event

php artisan make:listener
```

--------------------------------

### List All Registered Laravel Event Listeners

Source: https://laravel.com/docs/12.x/events

The `event:list` Artisan command displays all event listeners registered within the Laravel application. This command helps in verifying event registration, understanding the event flow, and debugging listener issues.

```shell
php artisan event:list
```

--------------------------------

### Register Wildcard Event Listener (PHP)

Source: https://laravel.com/docs/12.x/events

Registers a wildcard event listener using the `*` character to catch multiple events. The listener receives the event name as its first argument and an array of event data as its second argument, allowing for flexible event handling across various event types.

```php
Event::listen('event.*', function (string $eventName, array $data) {
    // ...
});
```

--------------------------------

### Assert Laravel Event Dispatch with Closure Conditions

Source: https://laravel.com/docs/12.x/events

This snippet shows how to pass a closure to `assertDispatched` to perform a more specific truth test on the dispatched event. The closure receives the event instance, allowing for assertions based on event properties, such as checking if an order ID matches. This provides fine-grained control over event assertion logic.

```php
Event::assertDispatched(function (OrderShipped $event) use ($order) {
    return $event->order->id === $order->id;
});
```

--------------------------------

### Assert Laravel Event Listener Registration

Source: https://laravel.com/docs/12.x/events

This example demonstrates how to use `Event::assertListening()` to verify that a specific event listener is registered for a given event. It takes the event class and the listener class as arguments. This is useful for testing the event-listener mapping without actually dispatching the event.

```php
Event::assertListening(
    OrderShipped::class,
    SendShipmentNotification::class
);
```

--------------------------------

### Define Event Class with Eloquent Model (PHP)

Source: https://laravel.com/docs/12.x/events

Defines a simple event class that serves as a data container, holding an Eloquent model instance. It utilizes `Dispatchable`, `InteractsWithSockets`, and `SerializesModels` traits, with `SerializesModels` gracefully handling the serialization of Eloquent models when the event is queued.

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Order $order,
    ) {}
}
```

--------------------------------

### Fake and Assert Dispatched Events in Laravel Tests

Source: https://laravel.com/docs/12.x/events

This code demonstrates how to use `Event::fake()` to prevent event listeners from executing during testing. It then uses various assertion methods like `assertDispatched`, `assertDispatchedOnce`, `assertNotDispatched`, and `assertNothingDispatched` to verify event dispatch behavior. This approach is suitable for both Pest and PHPUnit testing frameworks.

```php
<?php

use AppEventsOrderFailedToShip;
use AppEventsOrderShipped;
use IlluminateSupportFacadesEvent;

test('orders can be shipped', function () {
    Event::fake();

    // Perform order shipping...

    // Assert that an event was dispatched...
    Event::assertDispatched(OrderShipped::class);

    // Assert an event was dispatched twice...
    Event::assertDispatched(OrderShipped::class, 2);

    // Assert an event was dispatched once...
    Event::assertDispatchedOnce(OrderShipped::class);

    // Assert an event was not dispatched...
    Event::assertNotDispatched(OrderFailedToShip::class);

    // Assert that no events were dispatched...
    Event::assertNothingDispatched();
});
```

```php
<?php

namespace TestsFeature;

use AppEventsOrderFailedToShip;
use AppEventsOrderShipped;
use IlluminateSupportFacadesEvent;
use TestsTestCase;

class ExampleTest extends TestCase
{
    /**
     *
     * Test order shipping.
     */
    public function test_orders_can_be_shipped(): void
    {
        Event::fake();

        // Perform order shipping...

        // Assert that an event was dispatched...
        Event::assertDispatched(OrderShipped::class);

        // Assert an event was dispatched twice...
        Event::assertDispatched(OrderShipped::class, 2);

        // Assert an event was dispatched once...
        Event::assertDispatchedOnce(OrderShipped::class);

        // Assert an event was not dispatched...
        Event::assertNotDispatched(OrderFailedToShip::class);

        // Assert that no events were dispatched...
        Event::assertNothingDispatched();
    }
}
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

### Register Class-Based Event Listener (PHP)

Source: https://laravel.com/docs/12.x/events

Registers an event with a corresponding class-based listener within the `boot` method of `AppServiceProvider` using the `Event` facade. This establishes a clear mapping between an event and the logic that should respond to it.

```php
use App\Domain\Orders\Events\PodcastProcessed;
use App\Domain\Orders\Listeners\SendPodcastNotification;
use Illuminate\Support\Facades\Event;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(
        PodcastProcessed::class,
        SendPodcastNotification::class,
    );
}
```

--------------------------------

### Fake All Laravel Events Except Specific Ones

Source: https://laravel.com/docs/12.x/events

This snippet shows how to use `Event::fake()->except([EventClass::class])` to fake all events except those explicitly listed. This is useful when you want most event listeners to be disabled during testing, but need specific events to trigger their full functionality. It provides an inverse control compared to faking only a subset.

```php
Event::fake()->except([
    OrderCreated::class,
]);
```

--------------------------------

### Define Laravel Event Broadcast Conditions with `broadcastWhen`

Source: https://laravel.com/docs/12.x/broadcasting

Implement the `broadcastWhen` method in your Laravel event class to conditionally broadcast an event. This method should return a boolean value, determining if the event should be dispatched based on specific criteria, such as a model's attribute value.

```php
/**
 * Determine if this event should broadcast.
 */
public function broadcastWhen(): bool
{
    return $this->order->value > 100;
}
```

--------------------------------

### Listen to Laravel Echo Events with Type Safety using useEcho Hook (TypeScript)

Source: https://laravel.com/docs/12.x/broadcasting

This snippet demonstrates how to enhance type safety when using the `useEcho` hook by providing a generic type argument for the expected broadcast event payload. This improves code clarity and enables better tooling support for event data.

```typescript
type OrderData = {
    order: {
        id: number;
        user: {
            id: number;
            name: string;
        };
        created_at: string;
    };
};

useEcho<OrderData>(`orders.${orderId}`, "OrderShipmentStatusUpdated", (e) => {
    console.log(e.order.id);
    console.log(e.order.user.id);
});
```

--------------------------------

### Conditionally Broadcast Laravel Model Events by Type

Source: https://laravel.com/docs/12.x/broadcasting

The `broadcastOn` method receives an `$event` argument, which indicates the type of model event ('created', 'updated', 'deleted', 'trashed', 'restored'). By inspecting this argument, you can return different channels or an empty array to conditionally broadcast or prevent broadcasting for specific event types.

```php
/**
 * Get the channels that model events should broadcast on.
 *
 * @return array<string, array<int, \Illuminate\Broadcasting\Channel|\Illuminate\Database\Eloquent\Model>>
 */
public function broadcastOn(string $event): array
{
    return match ($event) {
        'deleted' => [],
        default => [$this, $this->user],
    };
}
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

### Immediately Broadcast Anonymous Event (Laravel PHP)

Source: https://laravel.com/docs/12.x/broadcasting

By default, 'send' dispatches events to the queue. Use the 'sendNow' method to broadcast an anonymous event immediately, bypassing the queue for real-time or critical updates.

```php
Broadcast::on('orders.'.$order->id)->sendNow();
```

--------------------------------

### Customize Anonymous Event Name and Data (Laravel PHP)

Source: https://laravel.com/docs/12.x/broadcasting

This code demonstrates customizing an anonymous event's name using 'as' and including specific data using 'with'. This allows for more meaningful events and payloads without defining a full event class.

```php
Broadcast::on('orders.'.$order->id)
    ->as('OrderPlaced')
    ->with($order)
    ->send();
```

--------------------------------

### Handle Multiple Laravel Events with Union Types

Source: https://laravel.com/docs/12.x/events

This PHP code demonstrates using union types in an event listener's `handle` method. It allows a single listener to elegantly process multiple distinct event types, enhancing code reusability and reducing redundant listeners.

```php
/**
 * Handle the event.
 */
public function handle(PodcastProcessed|PodcastPublished $event): void
{
    // ...
}
```

--------------------------------

### Defer Laravel Event Dispatching with Event::defer() in PHP

Source: https://laravel.com/docs/12.x/events

These snippets demonstrate how to defer the dispatching of events in Laravel until after a specific code block completes. The "Event::defer()" method takes a closure, and all events triggered within it are dispatched only after the closure finishes, ensuring related records are available. An optional second argument allows deferring only specific event types.

```php
use AppModelsUser;
use IlluminateSupportFacadesEvent;

Event::defer(function () {
    $user = User::create(['name' => 'Victoria Otwell']);

    $user->posts()->create(['title' => 'My first post!']);
});
```

```php
use AppModelsUser;
use IlluminateSupportFacadesEvent;

Event::defer(function () {
    $user = User::create(['name' => 'Victoria Otwell']);

    $user->posts()->create(['title' => 'My first post!']);
}, ['eloquent.created: '.User::class]);
```

--------------------------------

### Listen for Specific Events on Presence Channel with Echo (JavaScript)

Source: https://laravel.com/docs/12.x/broadcasting

This JavaScript example expands on joining a presence channel by demonstrating how to listen for custom events like 'NewMessage' on that channel. It shows how to chain the `listen` method after defining presence-related callbacks to handle application-specific real-time updates.

```js
Echo.join(`chat.${roomId}`)
    .here(/* ... */)
    .joining(/* ... */)
    .leaving(/* ... */)
    .listen('NewMessage', (e) => {
        // ...
    });
```

--------------------------------

### Dispatch Laravel Events in PHP

Source: https://laravel.com/docs/12.x/events

These snippets illustrate how to dispatch events in Laravel, both unconditionally and conditionally. The "dispatch" method on an event class triggers its listeners, while "dispatchIf" and "dispatchUnless" allow dispatching based on a boolean condition. This mechanism decouples actions from their triggers, promoting cleaner code architecture.

```php
<?php

namespace AppHttpControllers;

use AppEventsOrderShipped;
use AppModelsOrder;
use IlluminateHttpRedirectResponse;
use IlluminateHttpRequest;

class OrderShipmentController extends Controller
{
    /**
     * Ship the given order.
     */
    public function store(Request $request): RedirectResponse
    {
        $order = Order::findOrFail($request->order_id);

        // Order shipment logic...

        OrderShipped::dispatch($order);

        return redirect('/orders');
    }
}
```

```php
OrderShipped::dispatchIf($condition, $order);

OrderShipped::dispatchUnless($condition, $order);
```

--------------------------------

### Customize Model Broadcast Event Name and Payload in PHP

Source: https://laravel.com/docs/12.x/broadcasting

These PHP methods, `broadcastAs` and `broadcastWith`, allow for custom naming and payload generation for model broadcast events. They receive the model event type as an argument, enabling different names and data based on the operation (e.g., 'created', 'updated'). Returning `null` from `broadcastAs` falls back to convention.

```php
/**
 * The model event's broadcast name.
 */
public function broadcastAs(string $event): string|null
{
    return match ($event) {
        'created' => 'post.created',
        default => null,
    };
}

/**
 * Get the data to broadcast for the model.
 *
 * @return array<string, mixed>
 */
public function broadcastWith(string $event): array
{
    return match ($event) {
        'created' => ['title' => $this->title],
        default => ['model' => $this],
    };
}
```

--------------------------------

### Configure Event to Broadcast to Laravel Presence Channel (PHP)

Source: https://laravel.com/docs/12.x/broadcasting

This PHP code demonstrates how to configure a Laravel event to broadcast specifically to a presence channel. By returning an instance of `PresenceChannel` from the event's `broadcastOn` method, the event will be dispatched to all authorized subscribers of that channel.

```php
/**
 * Get the channels the event should broadcast on.
 *
 * @return array<int, \Illuminate\Broadcasting\Channel>
 */
public function broadcastOn(): array
{
    return [
        new PresenceChannel('chat.'.$this->message->room_id),
    ];
}
```

--------------------------------

### Register Queueable Closure Listener (PHP)

Source: https://laravel.com/docs/12.x/events

Registers a closure-based event listener that will be executed via Laravel's queue system. Wrapping the closure with `Illuminate\Events\queueable` ensures that the listener's execution is deferred to a background queue, improving application responsiveness.

```php
use App\Events\PodcastProcessed;
use function Illuminate\Events\queueable;
use Illuminate\Support\Facades\Event;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(queueable(function (PodcastProcessed $event) {
        // ...
    }));
}
```

--------------------------------

### Customize Laravel Event Broadcast Connection within Event Constructor (PHP)

Source: https://laravel.com/docs/12.x/broadcasting

This example shows how to define the broadcast connection directly within an event's constructor using the 'broadcastVia' method. Ensure the event class uses the 'InteractsWithBroadcasting' trait for this method to be available. This approach sets the connection for all broadcasts of this specific event type.

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderShipmentStatusUpdated implements ShouldBroadcast
{
    use InteractsWithBroadcasting;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        $this->broadcastVia('pusher');
    }
}
```

--------------------------------

### Dispatch an Event in Laravel (PHP)

Source: https://laravel.com/docs/12.x/helpers

The `event` function dispatches a given event to all its registered listeners. This is a core mechanism for decoupled communication and side-effect handling between different parts of a Laravel application.

```php
event(new UserRegistered($user));
```

--------------------------------

### Enable Console Events in Laravel Tests

Source: https://laravel.com/docs/12.x/console-tests

To dispatch `CommandStarting` and `CommandFinished` console events during your Laravel application's tests, use the `Illuminate\Foundation\Testing\WithConsoleEvents` trait. By default, these events are not active during testing, but the trait allows them to be captured and asserted within your test suite for both Pest and PHPUnit.

```php
<?php

use Illuminate\Foundation\Testing\WithConsoleEvents;

pest()->use(WithConsoleEvents::class);

// ...
```

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithConsoleEvents;
use Tests\TestCase;

class ConsoleEventTest extends TestCase
{
    use WithConsoleEvents;

    // ...
}
```

--------------------------------

### Listen to Laravel Model Broadcast Events with Echo in JavaScript

Source: https://laravel.com/docs/12.x/broadcasting

This JavaScript code demonstrates how to listen for specific model broadcast events in a client-side application using Laravel Echo. It connects to a private channel based on model conventions and logs the event data (including the model's properties) when a `UserUpdated` event occurs, prefixed with a dot to indicate a non-namespaced event.

```javascript
Echo.private(`App.Models.User.${this.user.id}`)
    .listen('.UserUpdated', (e) => {
        console.log(e.model);
    });
```

--------------------------------

### Define Laravel Broadcast Event with Private Channel

Source: https://laravel.com/docs/12.x/broadcasting

This PHP code demonstrates how to define a broadcast event in Laravel by implementing the `ShouldBroadcast` interface. It shows how to specify a private channel for the event using `PrivateChannel` and how to pass a user model to the event constructor.

```php
<?php

namespace AppEvents;

use AppModelsUser;
use IlluminateBroadcastingChannel;
use IlluminateBroadcastingInteractsWithSockets;
use IlluminateBroadcastingPresenceChannel;
use IlluminateBroadcastingPrivateChannel;
use IlluminateContractsBroadcastingShouldBroadcast;
use IlluminateQueueSerializesModels;

class ServerCreated implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public User $user,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->user->id),
        ];
    }
}
```

--------------------------------

### Broadcast Event with Laravel `toOthers` Helper (PHP)

Source: https://laravel.com/docs/12.x/broadcasting

This PHP snippet illustrates how to use the `broadcast` helper to dispatch an event in Laravel. It also shows how to chain the `toOthers()` method to prevent the event from being broadcast back to the user who triggered it, useful for UI updates without self-reflection.

```php
broadcast(new NewMessage($message));

broadcast(new NewMessage($message))->toOthers();
```

--------------------------------

### Dispatch Laravel Event After Database Transaction Commit in PHP

Source: https://laravel.com/docs/12.x/events

This snippet shows how to ensure a Laravel event is only dispatched after the active database transaction successfully commits. By implementing the "ShouldDispatchAfterCommit" interface on the event class, the event will be discarded if the transaction fails, preventing inconsistent state. If no transaction is active, the event dispatches immediately.

```php
<?php

namespace AppEvents;

use AppModelsOrder;
use IlluminateBroadcastingInteractsWithSockets;
use IlluminateContractsEventsShouldDispatchAfterCommit;
use IlluminateFoundationEventsDispatchable;
use IlluminateQueueSerializesModels;

class OrderShipped implements ShouldDispatchAfterCommit
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Order $order,
    ) {}
}
```

--------------------------------

### Listening to Object Resolution Events in Laravel Container (PHP)

Source: https://laravel.com/docs/12.x/container

Demonstrates how to use `$this->app->resolving()` to listen for events when the container resolves an object. It shows examples for listening to specific types (`Transistor::class`) or any type of object, allowing for modification before the object is consumed.

```php
use App\Services\Transistor;
use Illuminate\Contracts\Foundation\Application;

$this->app->resolving(Transistor::class, function (Transistor $transistor, Application $app) {
    // Called when container resolves objects of type "Transistor"...
});

$this->app->resolving(function (mixed $object, Application $app) {
    // Called when container resolves object of any type...
});
```

--------------------------------

### Configure Laravel Model for Automatic Event Broadcasting

Source: https://laravel.com/docs/12.x/broadcasting

To enable automatic broadcasting for an Eloquent model, use the `Illuminate\Database\Eloquent\BroadcastsEvents` trait and define a `broadcastOn` method. This method should return an array of channels (e.g., `Channel`, `PrivateChannel`, or the model instance itself) that the model's events will be broadcast on when it is created, updated, or deleted.

```php
<?php

namespace App\Models;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use BroadcastsEvents, HasFactory;

    /**
     * Get the user that the post belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the channels that model events should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel|\Illuminate\Database\Eloquent\Model>
     */
    public function broadcastOn(string $event): array
    {
        return [$this, $this->user];
    }
}
```

--------------------------------

### Register Closure-Based Event Listener (PHP)

Source: https://laravel.com/docs/12.x/events

Registers an anonymous closure-based event listener within the `boot` method of `AppServiceProvider`. This provides a quick way to define event handling logic inline without creating a separate listener class.

```php
use App\Events\PodcastProcessed;
use Illuminate\Support\Facades\Event;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(function (PodcastProcessed $event) {
        // ...
    });
}
```

--------------------------------

### Handle Laravel Event in Listener Class

Source: https://laravel.com/docs/12.x/events

This PHP code defines a `handle` method within an event listener class. Laravel automatically registers this method as a listener for the type-hinted `App\Events\PodcastProcessed` event, processing it when dispatched.

```php
use App\Events\PodcastProcessed;

class SendPodcastNotification
{
    /**
     * Handle the event.
     */
    public function handle(PodcastProcessed $event): void
    {
        // ...
    }
}
```

--------------------------------

### Example Broadcast Event Payload in JSON

Source: https://laravel.com/docs/12.x/broadcasting

This JSON object illustrates the typical payload structure for a model broadcast event, specifically for a `PostUpdated` event. It includes the `model` properties containing the model's data and a `socket` ID, following Laravel's event convention.

```json
{
    "model": {
        "id": 1,
        "title": "My first post"
        ...
    },
    ...
    "socket": "someSocketId"
}
```

--------------------------------

### Defining a Basic Laravel Event Listener

Source: https://laravel.com/docs/12.x/events

This PHP snippet demonstrates how to define a basic event listener in Laravel. The `handle` method receives the event instance, allowing the listener to react to the dispatched event. Event listeners can also type-hint dependencies in their constructor for automatic injection by Laravel's service container.

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;

class SendShipmentNotification
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(OrderShipped $event): void
    {
        // Access the order using $event->order...
    }
}
```

--------------------------------

### Join Presence Channel and Handle Events with Echo (JavaScript)

Source: https://laravel.com/docs/12.x/broadcasting

This JavaScript example shows how to join a presence channel using Echo's `join` method. It defines callbacks for `here` (initial members), `joining` (new member), `leaving` (member exits), and `error` events, providing real-time awareness of channel participants.

```js
Echo.join(`chat.${roomId}`)
    .here((users) => {
        // ...
    })
    .joining((user) => {
        console.log(user.name);
    })
    .leaving((user) => {
        console.log(user.name);
    })
    .error((error) => {
        console.error(error);
    });
```

--------------------------------

### Listen to Multiple Laravel Echo Events with useEcho Hook (JavaScript)

Source: https://laravel.com/docs/12.x/broadcasting

This snippet extends the `useEcho` hook functionality to listen for an array of multiple private events simultaneously on a Laravel Echo channel. This allows for consolidated event management within a single hook call.

```javascript
useEcho(
    `orders.${orderId}`,
    ["OrderShipmentStatusUpdated", "OrderShipped"],
    (e) => {
        console.log(e.order);
    },
);
```

--------------------------------

### Broadcast Basic Anonymous Event (Laravel PHP)

Source: https://laravel.com/docs/12.x/broadcasting

This snippet shows how to broadcast a simple 'anonymous event' to the frontend without needing a dedicated event class. The 'Broadcast' facade's 'on' method targets a channel, and 'send' dispatches the event, defaulting to 'AnonymousEvent' with empty data.

```php
Broadcast::on('orders.'.$order->id)->send();
```

--------------------------------

### Customize Broadcast Event Data Payload in Laravel

Source: https://laravel.com/docs/12.x/broadcasting

This PHP method, `broadcastWith`, allows fine-grained control over the data payload sent with a broadcast event. It returns an associative array of data that will be broadcast instead of the event's public properties.

```php
/**
 * Get the data to broadcast.
 *
 * @return array<string, mixed>
 */
public function broadcastWith(): array
{
    return ['id' => $this->user->id];
}
```

--------------------------------

### Define a Broadcastable Event Class in Laravel

Source: https://laravel.com/docs/12.x/broadcasting

This PHP code defines an `OrderShipmentStatusUpdated` event class that implements the `ShouldBroadcast` interface. This interface instructs Laravel to broadcast the event when it is fired, enabling real-time updates without page refreshes. The event includes a public `order` property representing the associated order instance.

```php
<?php

namespace AppEvents;

use AppModelsOrder;
use IlluminateBroadcastingChannel;
use IlluminateBroadcastingInteractsWithSockets;
use IlluminateBroadcastingPresenceChannel;
use IlluminateContractsBroadcastingShouldBroadcast;
use IlluminateQueueSerializesModels;

class OrderShipmentStatusUpdated implements ShouldBroadcast
{
    /**
     * The order instance.
     *
     * @var \App\Models\Order
     */
    public $order;
}
```

--------------------------------

### Specify Eloquent Events for Telescope Model Watcher in PHP

Source: https://laravel.com/docs/12.x/telescope

This configuration demonstrates how to define which Eloquent model events the Telescope `ModelWatcher` should monitor. The `events` array accepts an array of event patterns, allowing you to track specific model lifecycle changes like creation or updates.

```php
'watchers' => [
    Watchers\ModelWatcher::class => [
        'enabled' => env('TELESCOPE_MODEL_WATCHER', true),
        'events' => ['eloquent.created*', 'eloquent.updated*'],
    ],
    // ...
],
```

--------------------------------

### Customizing Event Stream Names with StreamedEvent (PHP)

Source: https://laravel.com/docs/12.x/responses

This PHP snippet shows how to customize the event name within a Server-Sent Event (SSE) stream generated by `response()->eventStream()`. By yielding an instance of `Illuminate\Http\StreamedEvent`, you can specify a custom `event` name and `data` payload for each streamed event.

```php
use Illuminate\Http\StreamedEvent;

yield new StreamedEvent(
    event: 'update',
    data: $response->choices[0],
);
```

--------------------------------

### Broadcast Anonymous Event to All Except Sender (Laravel PHP)

Source: https://laravel.com/docs/12.x/broadcasting

The 'toOthers' method allows you to broadcast an anonymous event to all subscribers of a channel except for the currently authenticated user who initiated the action, preventing unnecessary self-notifications.

```php
Broadcast::on('orders.'.$order->id)
    ->toOthers()
    ->send();
```

--------------------------------

### Customizing Laravel Queued Listener Methods at Runtime

Source: https://laravel.com/docs/12.x/events

This PHP code demonstrates how to dynamically specify the queue connection, queue name, or processing delay for an event listener at runtime. By defining `viaConnection`, `viaQueue`, or `withDelay` methods, the queue parameters can be determined based on the event's data or other runtime conditions.

```php
/**
 * Get the name of the listener's queue connection.
 */
public function viaConnection(): string
{
    return 'sqs';
}

/**
 * Get the name of the listener's queue.
 */
public function viaQueue(): string
{
    return 'listeners';
}

/**
 * Get the number of seconds before the job should be processed.
 */
public function withDelay(OrderShipped $event): int
{
    return $event->highPriority ? 0 : 60;
}
```

--------------------------------

### Dispatch a Laravel event

Source: https://laravel.com/docs/12.x/broadcasting

Dispatches an `OrderShipmentStatusUpdated` event with an `$order` object as its payload. This is a common way in Laravel to trigger events that can then be broadcast to connected clients via WebSockets, demonstrating the server-side part of event broadcasting.

```php
use App\Events\OrderShipmentStatusUpdated;

OrderShipmentStatusUpdated::dispatch($order);
```

--------------------------------

### Handle Paddle TransactionCompleted Webhook Event (PHP)

Source: https://laravel.com/docs/12.x/cashier-paddle

This PHP snippet defines an event listener, `CompleteOrder`, which is responsible for processing the `TransactionCompleted` event dispatched by Laravel Cashier. It extracts the custom `order_id` from the event payload and updates the corresponding `Order` record in the application's database to a 'completed' status.

```php
namespace App\Listeners;

use App\Models\Order;
use Laravel\Paddle\Cashier;
use Laravel\Paddle\Events\TransactionCompleted;

class CompleteOrder
{
    /**
     * Handle the incoming Cashier webhook event.
     */
    public function handle(TransactionCompleted $event): void
    {
        $orderId = $event->payload['data']['custom_data']['order_id'] ?? null;

        $order = Order::findOrFail($orderId);

        $order->update(['status' => 'completed']);
    }
}
```

--------------------------------

### Listen for Broadcasted Events with Laravel Echo

Source: https://laravel.com/docs/12.x/broadcasting

These JavaScript examples demonstrate how to listen for broadcasted events using Laravel Echo's `useEcho` hook in React and Vue applications. By specifying the channel (`orders.${orderId}`) and event name (`OrderShipmentStatusUpdated`), the callback function receives the event payload, including all public properties of the broadcasted Laravel event. This enables real-time updates in the client-side UI.

```js
import { useEcho } from "@laravel/echo-react";

useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);
```

```vue
<script setup lang="ts">
import { useEcho } from "@laravel/echo-vue";

useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);
</script>
```

--------------------------------

### Create Listener for Laravel Cashier Stripe Webhook Events

Source: https://laravel.com/docs/12.x/billing

This PHP code defines an example listener for Cashier's `WebhookReceived` event, allowing custom handling of specific Stripe webhooks. The listener checks the `type` property within the event payload to identify the webhook event, such as `invoice.payment_succeeded`, and execute application-specific logic.

```php
<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Handle received Stripe webhooks.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'invoice.payment_succeeded') {
            // Handle the incoming event...
        }
    }
}
```

--------------------------------

### Configure Wildcard Directories for Laravel Event Discovery

Source: https://laravel.com/docs/12.x/events

This PHP code snippet demonstrates configuring Laravel's event discovery to scan multiple similar directories using a wildcard character. This is useful for discovering listeners across a structured domain-driven architecture or other modular setups.

```php
->withEvents(discover: [
    __DIR__.'/../app/Domain/*/Listeners',
])
```

--------------------------------

### Conditionally Queueing Laravel Event Listeners

Source: https://laravel.com/docs/12.x/events

This PHP example shows how to conditionally queue an event listener based on specific runtime criteria. By implementing a `shouldQueue` method, the listener can decide whether to be processed asynchronously via the queue or synchronously, depending on the event's data.

```php
<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class RewardGiftCard implements ShouldQueue
{
    /**
     * Reward a gift card to the customer.
     */
    public function handle(OrderCreated $event): void
    {
        // ...
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(OrderCreated $event): bool
    {
        return $event->order->subtotal >= 5000;
    }
}
```

--------------------------------

### Specify Fully-Qualified Event Class Name in Laravel Echo (JavaScript)

Source: https://laravel.com/docs/12.x/broadcasting

This snippet demonstrates an alternative way to handle event namespaces by explicitly specifying a fully-qualified event class name when subscribing. Prefixing the event name with a `.` tells Echo to ignore the configured namespace and use the provided class name directly.

```javascript
Echo.channel('orders')
    .listen('.Namespace\\Event\\Class', (e) => {
        // ...
    });
```

--------------------------------

### Customize Laravel Event Broadcast Connection via 'via' Method (PHP)

Source: https://laravel.com/docs/12.x/broadcasting

This code snippet demonstrates how to specify a broadcast connection for a specific event using the 'via' method on the 'broadcast' helper. This is useful when your application interacts with multiple broadcast connections and you need to push an event to a non-default one.

```php
use App\Events\OrderShipmentStatusUpdated;

broadcast(new OrderShipmentStatusUpdated($update))->via('pusher');
```

--------------------------------

### Handle Queueable Closure Listener Failures (PHP)

Source: https://laravel.com/docs/12.x/events

Provides a mechanism to handle failures that occur during the execution of a queueable anonymous event listener. The `catch` method allows you to define a closure that receives the event instance and the `Throwable` exception that caused the failure, enabling custom error handling.

```php
use App\Events\PodcastProcessed;
use function Illuminate\Events\queueable;
use Illuminate\Support\Facades\Event;
use Throwable;

Event::listen(queueable(function (PodcastProcessed $event) {
    // ...
})->catch(function (PodcastProcessed $event, Throwable $e) {
    // The queued listener failed...
}));
```

--------------------------------

### Define Laravel Event Subscriber using array return for event listeners (PHP)

Source: https://laravel.com/docs/12.x/events

This example shows an alternative, more concise way to define a Laravel event subscriber. The `subscribe` method returns an associative array where keys are event classes and values are the subscriber's handler method names. Laravel automatically registers these listeners, simplifying the setup.

```php
<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Events\Dispatcher;

class UserEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function handleUserLogin(Login $event): void {}

    /**
     * Handle user logout events.
     */
    public function handleUserLogout(Logout $event): void {}

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleUserLogin',
            Logout::class => 'handleUserLogout',
        ];
    }
}
```

--------------------------------

### Set Max Exceptions for Queued Listener with `maxExceptions` in Laravel

Source: https://laravel.com/docs/12.x/events

This code specifies the maximum number of unhandled exceptions a queued listener can throw before it is considered to have failed, even if the `tries` limit has not been reached. This provides a mechanism to fail fast for consistently erroneous listeners.

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the queued listener may be attempted.
     *
     * @var int
     */
    public $tries = 25;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 3;

    /**
     * Handle the event.
     */
    public function handle(OrderShipped $event): void
    {
        // Process the event...
    }
}
```

--------------------------------

### Broadcast Anonymous Events to Private or Presence Channels (Laravel PHP)

Source: https://laravel.com/docs/12.x/broadcasting

These snippets illustrate how to broadcast anonymous events to private or presence channels. Instead of 'on', use 'private' or 'presence' methods to specify the channel type, providing enhanced security or user awareness.

```php
Broadcast::private('orders.'.$order->id)->send();
```

```php
Broadcast::presence('channels.'.$channel->id)->send();
```

--------------------------------

### Mute Laravel Eloquent Model Events Temporarily

Source: https://laravel.com/docs/12.x/eloquent

This code demonstrates using the `withoutEvents` method to temporarily disable all event dispatching for a model within a given closure. Any model operations performed inside the closure will not trigger their associated Eloquent events, useful for bulk operations or specific scenarios where event processing is undesirable.

```php
use App\Models\User;

$user = User::withoutEvents(function () {
    User::findOrFail(1)->delete();

    return User::find(2);
});
```

--------------------------------

### Customize Laravel Model Broadcasting Event Instance

Source: https://laravel.com/docs/12.x/broadcasting

To customize the underlying `BroadcastableModelEventOccurred` instance created by Laravel during broadcasting, define a `newBroadcastableEvent` method on your model. This method allows you to modify the event before it's dispatched, for example, to prevent broadcasting the event back to the user who initiated the action.

```php
use Illuminate\Database\Eloquent\BroadcastableModelEventOccurred;

/**
 * Create a new broadcastable model event for the model.
 */
protected function newBroadcastableEvent(string $event): BroadcastableModelEventOccurred
{
    return (new BroadcastableModelEventOccurred(
        $this, $event
    ))->dontBroadcastToCurrentUser();
}
```

--------------------------------

### Broadcast an event in Laravel PHP

Source: https://laravel.com/docs/12.x/helpers

The `broadcast` function dispatches a given event to its listeners. It can also be chained with `toOthers()` to exclude the current user from receiving the broadcast, useful for UI updates originating from the current user's action.

```php
broadcast(new UserRegistered($user));

broadcast(new UserRegistered($user))->toOthers();
```

--------------------------------

### Configure Specific Directories for Laravel Event Discovery

Source: https://laravel.com/docs/12.x/events

This PHP code snippet shows how to configure Laravel's event discovery process in `bootstrap/app.php`. It allows specifying exact directories, such as `app/Domain/Orders/Listeners`, for scanning and automatically registering event listeners.

```php
->withEvents(discover: [
    __DIR__.'/../app/Domain/Orders/Listeners',
])
```

--------------------------------

### Handling Mail Sending Events in Laravel

Source: https://laravel.com/docs/12.x/mail

This PHP code defines an event listener class, `LogMessage`, for the `MessageSending` event, which Laravel dispatches just before a mail message is sent. Event listeners like this can be used to perform custom logic, such as logging mail details, modifying the mail message, or even preventing it from being sent. Laravel also dispatches a `MessageSent` event after a message has been successfully sent.

```php
use Illuminate\Mail\Events\MessageSending;
// use Illuminate\Mail\Events\MessageSent;

class LogMessage
{
    /**
     * Handle the event.
     */
    public function handle(MessageSending $event): void
    {
        // ...
    }
}
```

--------------------------------

### Define broadcastOn Method for Multiple Private Channels

Source: https://laravel.com/docs/12.x/broadcasting

This PHP example demonstrates how to configure the `broadcastOn` method to broadcast an event on multiple private channels. By returning an array of `Channel` instances, the event can reach different audiences or segments simultaneously. This allows for more flexible broadcasting scenarios where an update might be relevant to several distinct groups or interfaces.

```php
use IlluminateBroadcastingPrivateChannel;

/**
 * Get the channels the event should broadcast on.
 *
 * @return array<int, \Illuminate\Broadcasting\Channel>
 */
public function broadcastOn(): array
{
    return [
        new PrivateChannel('orders.'.$this->order->id),
        // ...
    ];
}
```

--------------------------------

### GET /chat - Event Streams (SSE)

Source: https://laravel.com/docs/12.x/responses

This endpoint provides a Server-Sent Events (SSE) stream, delivering real-time updates to connected clients. It uses the `text/event-stream` content type and allows for custom event names.

```APIDOC
## GET /chat

### Description
This endpoint establishes a Server-Sent Events (SSE) connection, allowing the server to push real-time updates or events to the client. It uses the `text/event-stream` content type and can yield individual data chunks or custom `StreamedEvent` instances.

### Method
GET

### Endpoint
/chat

### Parameters
#### Path Parameters
_None_

#### Query Parameters
_None_

#### Request Body
_None_

### Request Example
```
GET /chat
```

### Response
#### Success Response (200)
A continuous stream of Server-Sent Events (SSE). Each event can contain data or a custom event name with associated data.
- **data** (object) - The payload of the event, typically JSON.
- **event** (string) - (Optional) A custom event name if specified using `StreamedEvent`.

#### Response Example
```
data: {"id": "chatcmpl-123", "object": "chat.completion.chunk", "created": 1700000000, "model": "gpt-4", "choices": [{"index": 0, "delta": {"content": "Hello"}}]}

event: update
data: {"id": "chatcmpl-456", "object": "chat.completion.chunk", "created": 1700000000, "model": "gpt-4", "choices": [{"index": 0, "delta": {"content": " world!"}}]}
```
```

--------------------------------

### Define Laravel Event Subscriber with explicit dispatcher listener registration (PHP)

Source: https://laravel.com/docs/12.x/events

This code defines a `UserEventSubscriber` class in Laravel. It includes `handleUserLogin` and `handleUserLogout` methods, and a `subscribe` method that explicitly registers these handlers for `Login` and `Logout` events using the provided `Dispatcher` instance. This approach centralizes event handling logic.

```php
<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Events\Dispatcher;

class UserEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function handleUserLogin(Login $event): void {}

    /**
     * Handle user logout events.
     */
    public function handleUserLogout(Logout $event): void {}

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            Login::class,
            [UserEventSubscriber::class, 'handleUserLogin']
        );

        $events->listen(
            Logout::class,
            [UserEventSubscriber::class, 'handleUserLogout']
        );
    }
}
```

--------------------------------

### Customize Queueable Closure Listener (PHP)

Source: https://laravel.com/docs/12.x/events

Customizes the execution of a queueable anonymous event listener by specifying the connection, queue name, and delay. This allows fine-grained control over how the queued listener is processed by the queue worker.

```php
Event::listen(queueable(function (PodcastProcessed $event) {
    // ...
})->onConnection('redis')->onQueue('podcasts')->delay(now()->addSeconds(10)));
```

--------------------------------

### Handle Laravel NotificationSent Event in PHP

Source: https://laravel.com/docs/12.x/notifications

This PHP class demonstrates how to create an event listener for the `Illuminate\Notifications\Events\NotificationSent` event in Laravel. It shows the basic structure for handling the event when a notification is dispatched by the system, allowing for custom logic upon notification delivery.

```php
use Illuminate\Notifications\Events\NotificationSent;

class LogNotification
{
    /**
     * Handle the event.
     */
    public function handle(NotificationSent $event): void
    {
        // ...
    }
}
```

--------------------------------

### Set Max Listener Attempts with `tries` Property in Laravel

Source: https://laravel.com/docs/12.x/events

This code snippet demonstrates how to define the maximum number of times a queued listener will be attempted before it is considered to have failed. By setting the `tries` property, Laravel's queue worker will respect this limit during retry operations.

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the queued listener may be attempted.
     *
     * @var int
     */
    public $tries = 5;
}
```

--------------------------------

### Laravel Broadcasting: Send Event to All Except Current User

Source: https://laravel.com/docs/12.x/broadcasting

Explains how to use the `broadcast` helper with the `toOthers` method to send an event to all subscribers on a given channel, excluding the user who triggered the event. This prevents data duplication on the client-side when the client also receives data via an HTTP response.

```php
use App\Events\OrderShipmentStatusUpdated;

broadcast(new OrderShipmentStatusUpdated($update))->toOthers();
```