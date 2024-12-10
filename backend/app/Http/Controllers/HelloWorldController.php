<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class HelloWorldController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $files = Storage::files('files');

            $fileNames = array_map(function($file) {
                return basename($file);
            }, $files);

            return response()->json([
                'mensaje' => 'Listado de ficheros',
                'contenido' => $fileNames
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'mensaje' => 'Error al obtener los archivos: ' . $e->getMessage(),
                'contenido' => []
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $filename = $request->input('filename');
        $content = $request->input('content');

        if (!$filename || !$content) {
            return response()->json([
                'mensaje' => 'Parámetros incorrectos. El nombre del archivo y contenido son obligatorios.'
            ], 422);
        }

        if (Storage::exists("files/$filename")) {
            return response()->json([
                'mensaje' => 'El archivo ya existe'
            ], 409);
        }

        try {
            Storage::put("files/$filename", $content);
            return response()->json([
                'mensaje' => 'Guardado con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'mensaje' => 'Error al guardar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(string $filename): JsonResponse
    {
        if (!Storage::exists("files/$filename")) {
            return response()->json([
                'mensaje' => 'Archivo no encontrado',
                'contenido' => null
            ], 404);
        }

        try {
            $content = Storage::get("files/$filename");
            return response()->json([
                'mensaje' => 'Archivo leído con éxito',
                'contenido' => $content
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'mensaje' => 'Error al leer el archivo: ' . $e->getMessage(),
                'contenido' => null
            ], 500);
        }
    }

    public function update(Request $request, string $filename): JsonResponse
    {
        $content = $request->input('content');

        if (!$content) {
            return response()->json([
                'mensaje' => 'El contenido del archivo es obligatorio'
            ], 422);
        }

        if (!Storage::exists("files/$filename")) {
            return response()->json([
                'mensaje' => 'El archivo no existe'
            ], 404);
        }

        try {
            Storage::put("files/$filename", $content);
            return response()->json([
                'mensaje' => 'Actualizado con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'mensaje' => 'Error al actualizar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $filename): JsonResponse
    {
        if (!Storage::exists("files/$filename")) {
            return response()->json([
                'mensaje' => 'El archivo no existe'
            ], 404);
        }

        try {
            Storage::delete("files/$filename");
            return response()->json([
                'mensaje' => 'Eliminado con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'mensaje' => 'Error al eliminar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }
}
