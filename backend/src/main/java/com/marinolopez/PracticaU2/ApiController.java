package com.marinolopez.PracticaU2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final String FILES_DIRECTORY = "/app/storage/files/";

    private String readFileContent(File file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
            return content.toString();
        }
    }

    private void writeFileContent(File file, String content) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(content);
        }
    }

    private List<String> listFiles(String extension) {
        File directory = new File(FILES_DIRECTORY);
        File[] files = directory.listFiles((dir, name) -> name.endsWith("." + extension));
        List<String> fileNames = new ArrayList<>();
        if (files != null) {
            for (File file : files) {
                fileNames.add(file.getName());
            }
        }
        return fileNames;
    }

    private ResponseEntity<String> createFile(String extension, Map<String, String> request) {
        String filename = request.get("filename");
        if (filename == null || filename.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El nombre del archivo no puede estar vacío.");
        }
        if (!filename.endsWith("." + extension)) {
            filename += "." + extension;
        }
        filename = filename.replaceAll("[^a-zA-Z0-9.-]", "_");

        File newFile = new File(FILES_DIRECTORY + filename);
        if (!newFile.exists()) {
            try {
                newFile.createNewFile();
                writeFileContent(newFile, ""); // Escribir contenido vacío `""`
                return ResponseEntity.ok("Archivo " + extension.toUpperCase() + " creado con éxito: " + filename);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al crear el archivo " + extension.toUpperCase() + ": " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El archivo " + extension.toUpperCase() + " ya existe: " + filename);
        }
    }

    private ResponseEntity<String> updateFile(String extension, String filename, Map<String, String> request) {
        String content = request.get("content");
        File file = new File(FILES_DIRECTORY + filename);
        if (file.exists()) {
            try {
                writeFileContent(file, content);
                return ResponseEntity.ok("Archivo " + extension.toUpperCase() + " actualizado correctamente");
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al actualizar el archivo: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Archivo " + extension.toUpperCase() + " no encontrado");
        }
    }

    private ResponseEntity<String> deleteFile(String extension, String filename) {
        File file = new File(FILES_DIRECTORY + filename);
        if (file.exists()) {
            if (file.delete()) {
                return ResponseEntity.ok("Archivo " + extension.toUpperCase() + " eliminado correctamente");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al eliminar el archivo");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Archivo " + extension.toUpperCase() + " no encontrado");
        }
    }

    // Rutas para JSON
    @GetMapping("/json")
    public ResponseEntity<List<String>> getJsonFiles() {
        return ResponseEntity.ok(listFiles("json"));
    }

    @GetMapping("/json/{filename}")
    public ResponseEntity<Object> getJsonFile(@PathVariable String filename) {
        File file = new File(FILES_DIRECTORY + filename);
        if (file.exists() && file.isFile()) {
            try {
                String content = readFileContent(file);
                ObjectMapper objectMapper = new ObjectMapper();
                Object jsonContent = objectMapper.readValue(content, Object.class);
                return ResponseEntity.ok(jsonContent);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al leer el archivo JSON: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Archivo JSON no encontrado");
        }
    }

    @PostMapping("/json")
    public ResponseEntity<String> createJson(@RequestBody Map<String, String> request) {
        return createFile("json", request);
    }

    @PutMapping("/json/{filename}")
    public ResponseEntity<String> updateJson(@PathVariable String filename, @RequestBody Map<String, String> request) {
        return updateFile("json", filename, request);
    }

    @DeleteMapping("/json/{filename}")
    public ResponseEntity<String> deleteJson(@PathVariable String filename) {
        return deleteFile("json", filename);
    }

    // Rutas para CSV
    @GetMapping("/csv")
    public ResponseEntity<List<String>> getCsvFiles() {
        return ResponseEntity.ok(listFiles("csv"));
    }

    @GetMapping("/csv/{filename}")
    public ResponseEntity<String> getCsvFile(@PathVariable String filename) {
        File file = new File(FILES_DIRECTORY + filename);
        if (file.exists() && file.isFile()) {
            try {
                return ResponseEntity.ok(readFileContent(file));
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al leer el archivo CSV: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Archivo CSV no encontrado");
        }
    }

    @PostMapping("/csv")
    public ResponseEntity<String> createCsv(@RequestBody Map<String, String> request) {
        return createFile("csv", request);
    }

    @PutMapping("/csv/{filename}")
    public ResponseEntity<String> updateCsv(@PathVariable String filename, @RequestBody Map<String, String> request) {
        return updateFile("csv", filename, request);
    }

    @DeleteMapping("/csv/{filename}")
    public ResponseEntity<String> deleteCsv(@PathVariable String filename) {
        return deleteFile("csv", filename);
    }

    // Rutas para TXT
    @GetMapping("/txt")
    public ResponseEntity<List<String>> getTxtFiles() {
        return ResponseEntity.ok(listFiles("txt"));
    }

    @GetMapping("/txt/{filename}")
    public ResponseEntity<String> getTxtFile(@PathVariable String filename) {
        File file = new File(FILES_DIRECTORY + filename);
        if (file.exists() && file.isFile()) {
            try {
                return ResponseEntity.ok(readFileContent(file));
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al leer el archivo TXT: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Archivo TXT no encontrado");
        }
    }

    @PostMapping("/txt")
    public ResponseEntity<String> createTxt(@RequestBody Map<String, String> request) {
        return createFile("txt", request);
    }

    @PutMapping("/txt/{filename}")
    public ResponseEntity<String> updateTxt(@PathVariable String filename, @RequestBody Map<String, String> request) {
        return updateFile("txt", filename, request);
    }

    @DeleteMapping("/txt/{filename}")
    public ResponseEntity<String> deleteTxt(@PathVariable String filename) {
        return deleteFile("txt", filename);
    }
}
