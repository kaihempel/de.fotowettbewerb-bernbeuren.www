<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_switch_locale(): void
    {
        $response = $this->post(route('locale.update'), [
            'locale' => 'en',
        ]);

        $response->assertRedirect();
        $this->assertEquals('en', session('locale'));
    }

    public function test_guest_locale_persists_in_session(): void
    {
        $this->post(route('locale.update'), ['locale' => 'en']);

        // Make another request and verify session locale is still set
        $response = $this->get(route('home'));
        $response->assertOk();
        $this->assertEquals('en', session('locale'));
    }

    public function test_authenticated_user_can_switch_locale(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('locale.update'), [
                'locale' => 'en',
            ]);

        $response->assertRedirect();
        $this->assertEquals('en', session('locale'));

        // Verify locale is saved to database
        $user->refresh();
        $this->assertEquals('en', $user->locale);
    }

    public function test_authenticated_user_locale_is_persisted_to_database(): void
    {
        $user = User::factory()->create(['locale' => null]);

        $this->actingAs($user)
            ->post(route('locale.update'), ['locale' => 'de']);

        $user->refresh();
        $this->assertEquals('de', $user->locale);
    }

    public function test_invalid_locale_is_rejected(): void
    {
        $response = $this->post(route('locale.update'), [
            'locale' => 'fr', // Not in available locales
        ]);

        $response->assertSessionHasErrors('locale');
    }

    public function test_missing_locale_is_rejected(): void
    {
        $response = $this->post(route('locale.update'), []);

        $response->assertSessionHasErrors('locale');
    }

    public function test_locale_is_shared_via_inertia(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('locale')
            ->has('locales')
            ->where('locales', ['de', 'en'])
        );
    }

    public function test_locale_defaults_to_german(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('locale', 'de')
        );
    }

    public function test_authenticated_user_locale_preference_is_loaded(): void
    {
        $user = User::factory()->create(['locale' => 'en']);

        $response = $this->actingAs($user)->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('locale', 'en')
        );
    }

    public function test_session_locale_takes_priority_over_user_preference(): void
    {
        $user = User::factory()->create(['locale' => 'de']);

        // First, set session locale to English
        $this->actingAs($user)
            ->post(route('locale.update'), ['locale' => 'en']);

        // Session should now have 'en', even though user default was 'de'
        $response = $this->actingAs($user)->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('locale', 'en')
        );
    }

    public function test_locale_switch_redirects_back(): void
    {
        $response = $this->from(route('gallery'))
            ->post(route('locale.update'), ['locale' => 'en']);

        $response->assertRedirect(route('gallery'));
    }

    public function test_all_available_locales_can_be_set(): void
    {
        foreach (['de', 'en'] as $locale) {
            $response = $this->post(route('locale.update'), [
                'locale' => $locale,
            ]);

            $response->assertRedirect();
            $this->assertEquals($locale, session('locale'));
        }
    }
}
