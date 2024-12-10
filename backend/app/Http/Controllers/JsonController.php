<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class JsonController extends Controller
{
    private function isValidJson($string): bool
    {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    public function index(): JsonResponse
    {
        $files = Storage::allFiles('files');
        $validJsonFiles = [];

        foreach ($files as $file) {
            if ($this->isValidJson(Storage::get($file))) {
                $validJsonFiles[] = basename($file);
            }
        }

        return response()->json([
            'mensaje' => 'Operación exitosa',
            'contenido' => $validJsonFiles,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $filename = $request->input('filename');
        $content = $request->input('content');

        if (!$filename || !$content) {
            return response()->json(['mensaje' => 'Parámetros inválidos'], 422);
        }

        if (Storage::exists("files/$filename")) {
            return response()->json(['mensaje' => 'El fichero ya existe'], 409);
        }

        if (!$this->isValidJson($content)) {
            return response()->json(['mensaje' => 'Contenido no es un JSON válido'], 415);
        }

        Storage::put("files/$filename", $content);

        return response()->json(['mensaje' => 'Fichero guardado exitosamente'], 200);
    }

    public function show(string $id): JsonResponse
    {
        if (!Storage::exists("files/$id")) {
            return response()->json(['mensaje' => 'El fichero no existe'], 404);
        }

        $content = json_decode(Storage::get("files/$id"), true);

        return response()->json([
            'mensaje' => 'Operación exitosa',
            'contenido' => $content,
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

        if (!$this->isValidJson($content)) {
            return response()->json(['mensaje' => 'Contenido no es un JSON válido'], 415);
        }

        Storage::put("files/$id", $content);

        return response()->json(['mensaje' => 'Fichero actualizado exitosamente'], 200);
    }

    public function destroy(string $id = null): JsonResponse
    {
        if (!$id) {
            return response()->json(['mensaje' => 'Parámetro filename es requerido'], 422);
        }

        if (!Storage::exists("files/$id")) {
            return response()->json(['mensaje' => 'El fichero no existe'], 404);
        }

        Storage::delete("files/$id");

        return response()->json(['mensaje' => 'Fichero eliminado exitosamente'], 200);
    }
}
