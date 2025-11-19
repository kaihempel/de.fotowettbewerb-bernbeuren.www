<?php

namespace App\Http\Requests;

use App\Models\PhotoSubmission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PhotoSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,heic',
                'max:15360', // 15MB in kilobytes
            ],
        ];
    }

    /**
     * Get the custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo.required' => 'Please select a photo to upload.',
            'photo.file' => 'The uploaded file is invalid. Please try again with a different file.',
            'photo.mimes' => 'Only JPG, PNG, and HEIC images are accepted. Please upload an image in one of these formats.',
            'photo.max' => 'The photo must be smaller than 15MB. Please reduce the file size and try again.',
            'photo.uploaded' => 'The upload failed. This usually happens when the file is too large. Please try with a smaller file (maximum 15MB) or a different format (JPG, PNG, or HEIC).',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $user = $this->user();

            if ($user) {
                $activeSubmissionsCount = PhotoSubmission::query()
                    ->active()
                    ->forUser($user->id)
                    ->count();

                if ($activeSubmissionsCount >= 3) {
                    $validator->errors()->add(
                        'photo',
                        'You have reached the maximum of 3 submissions.'
                    );
                }
            }
        });
    }
}
