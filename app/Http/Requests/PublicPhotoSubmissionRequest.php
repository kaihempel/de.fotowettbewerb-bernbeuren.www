<?php

namespace App\Http\Requests;

use App\Models\PhotoSubmission;
use App\Rules\CaptchaValid;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PublicPhotoSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public endpoint, no authentication required
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'photo' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,heic',
                'max:15360', // 15MB
            ],
            'captcha_token' => [
                'required',
                'string',
                new CaptchaValid,
            ],
            'photographer_name' => [
                'required',
                'string',
                'max:255',
            ],
            'photographer_email' => [
                'required',
                'email:filter',
                'max:255',
            ],
            'disclaimer_accepted' => [
                'required',
                'accepted',
            ],
            'website' => [
                'nullable',
                'max:0', // Honeypot field - must be empty
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo.required' => 'Please select a photo to upload.',
            'photo.file' => 'The uploaded file is invalid.',
            'photo.mimes' => 'Only JPG, PNG, and HEIC images are accepted.',
            'photo.max' => 'The photo must be smaller than 15MB.',
            'captcha_token.required' => 'CAPTCHA verification is required.',
            'photographer_name.required' => 'Please enter the photographer\'s name.',
            'photographer_name.max' => 'Name must not exceed 255 characters.',
            'photographer_email.required' => 'Please enter the photographer\'s email.',
            'photographer_email.email' => 'Please enter a valid email address.',
            'photographer_email.max' => 'Email must not exceed 255 characters.',
            'disclaimer_accepted.required' => 'You must accept the upload conditions to continue.',
            'disclaimer_accepted.accepted' => 'You must accept the upload conditions to continue.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $fwbId = $this->cookie('fwb_id');

            if (! $fwbId) {
                $validator->errors()->add('general', 'Session cookie not found. Please enable cookies.');

                return;
            }

            // Check 3-photo limit for this visitor
            $activeSubmissionsCount = PhotoSubmission::query()
                ->where('visitor_fwb_id', $fwbId)
                ->active()
                ->count();

            if ($activeSubmissionsCount >= 3) {
                $validator->errors()->add(
                    'photo',
                    'You have reached the maximum of 3 submissions.'
                );
            }
        });
    }
}
