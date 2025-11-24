<?php

namespace Tests\Unit;

use App\Rules\CaptchaValid;
use App\Services\CaptchaService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CaptchaValidRuleTest extends TestCase
{
    /**
     * Test that validation passes with valid captcha.
     */
    public function test_validation_passes_with_valid_captcha(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => true]),
        ]);

        $rule = new CaptchaValid;
        $failCalled = false;

        $rule->validate('captcha_token', 'valid-token', function () use (&$failCalled) {
            $failCalled = true;
        });

        $this->assertFalse($failCalled);
    }

    /**
     * Test that validation fails with invalid captcha.
     */
    public function test_validation_fails_with_invalid_captcha(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => false]),
        ]);

        $rule = new CaptchaValid;
        $failCalled = false;
        $failMessage = null;

        $rule->validate('captcha_token', 'invalid-token', function ($message) use (&$failCalled, &$failMessage) {
            $failCalled = true;
            $failMessage = $message;
        });

        $this->assertTrue($failCalled);
        $this->assertStringContainsString('CAPTCHA verification failed', $failMessage);
    }

    /**
     * Test that validation fails when API returns error.
     */
    public function test_validation_fails_when_api_returns_error(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response([], 500),
        ]);

        $rule = new CaptchaValid;
        $failCalled = false;

        $rule->validate('captcha_token', 'any-token', function () use (&$failCalled) {
            $failCalled = true;
        });

        $this->assertTrue($failCalled);
    }

    /**
     * Test that validation sends request IP to service.
     */
    public function test_validation_sends_request_ip_to_service(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => true]),
        ]);

        $this->app->instance('request', request()->create('/', 'POST', [], [], [], [
            'REMOTE_ADDR' => '192.168.1.100',
        ]));

        $rule = new CaptchaValid;
        $rule->validate('captcha_token', 'test-token', function () {});

        Http::assertSent(function ($request) {
            return $request['remoteip'] === '192.168.1.100';
        });
    }

    /**
     * Test that validation works with empty token.
     */
    public function test_validation_fails_with_empty_token(): void
    {
        Http::fake([
            'hcaptcha.com/*' => Http::response(['success' => false]),
        ]);

        $rule = new CaptchaValid;
        $failCalled = false;

        $rule->validate('captcha_token', '', function () use (&$failCalled) {
            $failCalled = true;
        });

        $this->assertTrue($failCalled);
    }

    /**
     * Test that validation integrates with CaptchaService.
     */
    public function test_validation_uses_captcha_service(): void
    {
        $mockService = $this->createMock(CaptchaService::class);
        $mockService->expects($this->once())
            ->method('verify')
            ->with('test-token', $this->anything())
            ->willReturn(true);

        $this->app->instance(CaptchaService::class, $mockService);

        $rule = new CaptchaValid;
        $failCalled = false;

        $rule->validate('captcha_token', 'test-token', function () use (&$failCalled) {
            $failCalled = true;
        });

        $this->assertFalse($failCalled);
    }
}
