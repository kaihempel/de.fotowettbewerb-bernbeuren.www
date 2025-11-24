<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StorageQuotaMonitor
{
    // Maximum storage: 50GB for public uploads
    private const MAX_STORAGE_GB = 50;

    public function checkQuota(): array
    {
        $disk = Storage::disk('local');
        $totalSize = $this->calculateDirectorySize('photo-submissions');
        $totalSizeGB = round($totalSize / 1024 / 1024 / 1024, 2);

        $percentUsed = ($totalSizeGB / self::MAX_STORAGE_GB) * 100;

        $status = [
            'total_size_gb' => $totalSizeGB,
            'max_size_gb' => self::MAX_STORAGE_GB,
            'percent_used' => round($percentUsed, 2),
            'is_critical' => $percentUsed >= 90,
            'is_warning' => $percentUsed >= 75,
        ];

        if ($status['is_critical']) {
            Log::channel('security')->critical('Storage quota critical', $status);
        } elseif ($status['is_warning']) {
            Log::channel('security')->warning('Storage quota warning', $status);
        }

        return $status;
    }

    private function calculateDirectorySize(string $path): int
    {
        $size = 0;
        $disk = Storage::disk('local');

        if (! $disk->exists($path)) {
            return 0;
        }

        $files = $disk->allFiles($path);

        foreach ($files as $file) {
            $size += $disk->size($file);
        }

        return $size;
    }

    public function isQuotaAvailable(int $fileSize): bool
    {
        $status = $this->checkQuota();

        // Block uploads if over 95% capacity
        return $status['percent_used'] < 95;
    }
}
