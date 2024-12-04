# Usar una imagen base con OpenJDK (recomendado para Spring Boot)
FROM openjdk:17-jdk-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el código fuente de Spring Boot al contenedor
COPY . .

# Asegúrate de que mvnw tenga permisos de ejecución
RUN chmod +x mvnw

# Ejecutar Maven para construir el proyecto (si usas Maven)
RUN ./mvnw clean install

# Exponer el puerto donde el backend de Spring Boot escucha (por defecto 8080)
EXPOSE 8080

# Ejecutar la aplicación Spring Boot
CMD ["java", "-jar", "target/PracticaU2-0.0.1-SNAPSHOT.jar"]