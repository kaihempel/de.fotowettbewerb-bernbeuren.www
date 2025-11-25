<?php

namespace Tests\Feature;

use App\Models\PhotoSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the landing page returns 200 status code.
     */
    public function test_landing_page_returns_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test that only approved photos are displayed on the landing page.
     */
    public function test_landing_page_displays_only_approved_photos(): void
    {
        // Create test photos with different statuses
        $approvedPhoto = PhotoSubmission::factory()->approved()->create();
        $newPhoto = PhotoSubmission::factory()->pending()->create();
        $declinedPhoto = PhotoSubmission::factory()->declined()->create();

        // Visit the landing page
        $response = $this->get('/');

        // Should render the landing page with only approved photos
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('landing')
            ->has('photos', 1)
            ->where('photos.0.id', $approvedPhoto->id)
        );
    }

    /**
     * Test that the landing page handles empty state when no approved photos exist.
     */
    public function test_landing_page_handles_empty_state_when_no_approved_photos(): void
    {
        // Create only non-approved photos
        PhotoSubmission::factory()->pending()->count(3)->create();
        PhotoSubmission::factory()->declined()->count(2)->create();

        // Visit the landing page
        $response = $this->get('/');

        // Should render the landing page with empty photos array
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('landing')
            ->has('photos', 0)
        );
    }

    /**
     * Test that approved photos have required fields for display.
     */
    public function test_approved_photos_have_required_fields_for_display(): void
    {
        // Create an approved photo with thumbnail
        $photo = PhotoSubmission::factory()->approved()->withThumbnail()->create();

        // Visit the photo show page
        $response = $this->get(route('gallery.show', $photo));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('gallery')
            ->has('photo.id')
            ->has('photo.file_path')
            ->has('photo.thumbnail_path')
            ->has('photo.thumbnail_url')
            ->has('photo.full_image_url')
            ->has('photo.status')
            ->where('photo.status', 'approved')
        );
    }

    /**
     * Test that the landing page displays approved photos in chronological order.
     */
    public function test_landing_page_displays_photos_in_chronological_order(): void
    {
        // Create multiple approved photos in specific order
        $firstPhoto = PhotoSubmission::factory()->approved()->create(['created_at' => now()->subDays(3)]);
        $secondPhoto = PhotoSubmission::factory()->approved()->create(['created_at' => now()->subDays(2)]);
        $thirdPhoto = PhotoSubmission::factory()->approved()->create(['created_at' => now()->subDay()]);

        // Visit the landing page
        $response = $this->get('/');

        // Should display photos in chronological order (oldest first)
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('landing')
            ->has('photos', 3)
            ->where('photos.0.id', $firstPhoto->id)
            ->where('photos.1.id', $secondPhoto->id)
            ->where('photos.2.id', $thirdPhoto->id)
        );
    }

    /**
     * Test that approved photos must have both file_path and thumbnail_path for API listing.
     */
    public function test_gallery_api_only_returns_photos_with_file_and_thumbnail_paths(): void
    {
        // Create approved photos with and without required paths
        $completePhoto = PhotoSubmission::factory()->approved()->withThumbnail()->create();

        // Create photo without thumbnail by manually updating after creation
        $photoWithoutThumbnail = PhotoSubmission::factory()->approved()->create();
        $photoWithoutThumbnail->update(['thumbnail_path' => null]);

        // Visit the gallery API endpoint
        $response = $this->get(route('gallery.index'));

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'photos');
        $response->assertJsonFragment(['id' => $completePhoto->id]);
    }

    /**
     * Test that gallery API returns paginated results.
     */
    public function test_gallery_api_returns_paginated_results(): void
    {
        // Create more than 20 approved photos to test pagination
        PhotoSubmission::factory()->approved()->withThumbnail()->count(25)->create();

        // Visit the gallery API endpoint
        $response = $this->get(route('gallery.index'));

        $response->assertStatus(200);
        $response->assertJsonCount(20, 'photos');
        $response->assertJsonStructure([
            'photos',
            'next_cursor',
            'has_more',
        ]);
        $response->assertJson(['has_more' => true]);
    }
}
