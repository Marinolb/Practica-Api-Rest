<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class CsvController extends Controller
{
    private function isValidCsv(string $content): bool
    {
        $lines = explode("\n", trim($content));
        return count($lines) > 0 && strpos($lines[0], ',') !== false;
    }

    public function index(): JsonResponse
    {
        $files = collect(Storage::files('files'))
            ->filter(fn($file) => pathinfo($file, PATHINFO_EXTENSION) === 'csv')
            ->map(fn($file) => basename($file))
            ->values();

        return response()->json([
            'mensaje' => 'Operación exitosa',
            'contenido' => $files,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $filename = $request->input('filename');
        $content = $request->input('content');

        if (!$filename || !$content) {
            return response()->json(['mensaje' => 'Parámetros incompletos'], 422);
        }

        if (Storage::exists("files/$filename")) {
            return response()->json(['mensaje' => 'El fichero ya existe'], 409);
        }

        if (!$this->isValidCsv($content)) {
            return response()->json(['mensaje' => 'Contenido no es un CSV válido'], 415);
        }

        Storage::put("files/$filename", $content);

        return response()->json(['mensaje' => 'Fichero guardado exitosamente'], 201);
    }

    public function show(string $id): JsonResponse
    {
        if (!Storage::exists("files/$id")) {
            return response()->json(['mensaje' => 'El fichero no existe'], 404);
        }
    
        $content = Storage::get("files/$id");
        $rows = explode("\n", trim($content)); // Dividir por líneas
        $data = array_map(fn($row) => str_getcsv($row), $rows); // Procesar cada línea como CSV sin encabezados
    
        return response()->json([
            'mensaje' => 'Fichero leído con éxito',
            'contenido' => $data, // Devolver filas como array de arrays
        ], 200);
    }
    

    public function update(Request $request, string $id): JsonResponse
    {
        $content = $request->input('content');

        if (!$content) {
            return response()->json(['mensaje' => 'Parámetro contenido es requerido'], 422);
        }

        if (!Storage::exists("files/$id")) {
            return response()->json(['mensaje' => 'El fichero no existe'], 404);
        }

        if (!$this->isValidCsv($content)) {
            return response()->json(['mensaje' => 'Contenido no es un CSV válido'], 415);
        }

        // Sobrescribir el contenido existente
        Storage::put("files/$id", trim($content));

        return response()->json(['mensaje' => 'Fichero actualizado exitosamente'], 200);
    }

    public function destroy(string $id): JsonResponse
    {
        if (!Storage::exists("files/$id")) {
            return response()->json(['mensaje' => 'El fichero no existe'], 404);
        }

        Storage::delete("files/$id");

        return response()->json(['mensaje' => 'Fichero eliminado exitosamente'], 200);
    }
}
