<?php

namespace Tests\Unit;

use App\Services\CaptchaService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CaptchaServiceTest extends TestCase
{
    /**
     * Test that verify returns true for valid token.
     */
    public function test_verify_returns_true_for_valid_token(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => true]),
        ]);

        $service = new CaptchaService;
        $result = $service->verify('valid-token', '127.0.0.1');

        $this->assertTrue($result);
    }

    /**
     * Test that verify returns false for invalid token.
     */
    public function test_verify_returns_false_for_invalid_token(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => false]),
        ]);

        $service = new CaptchaService;
        $result = $service->verify('invalid-token', '127.0.0.1');

        $this->assertFalse($result);
    }

    /**
     * Test that verify handles HTTP errors gracefully.
     */
    public function test_verify_handles_http_errors(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response([], 500),
        ]);

        $service = new CaptchaService;
        $result = $service->verify('any-token', '127.0.0.1');

        $this->assertFalse($result);
    }

    /**
     * Test that verify sends correct data to hCaptcha API.
     */
    public function test_verify_sends_correct_data_to_api(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => true]),
        ]);

        config(['services.hcaptcha.secret_key' => 'test-secret-key']);

        $service = new CaptchaService;
        $service->verify('test-token', '192.168.1.1');

        Http::assertSent(function ($request) {
            return $request->url() === config('services.hcaptcha.verify_url')
                && $request['secret'] === 'test-secret-key'
                && $request['response'] === 'test-token'
                && $request['remoteip'] === '192.168.1.1';
        });
    }

    /**
     * Test that verify works without IP address.
     */
    public function test_verify_works_without_ip_address(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => true]),
        ]);

        $service = new CaptchaService;
        $result = $service->verify('valid-token');

        $this->assertTrue($result);
    }

    /**
     * Test that verify handles malformed JSON response.
     */
    public function test_verify_handles_malformed_json_response(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response('invalid json'),
        ]);

        $service = new CaptchaService;
        $result = $service->verify('any-token', '127.0.0.1');

        $this->assertFalse($result);
    }

    /**
     * Test that verify handles response without success key.
     */
    public function test_verify_handles_response_without_success_key(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['error' => 'some error']),
        ]);

        $service = new CaptchaService;
        $result = $service->verify('any-token', '127.0.0.1');

        $this->assertFalse($result);
    }
}
