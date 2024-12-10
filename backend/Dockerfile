FROM php:8.2-cli

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Copia los archivos de Laravel al contenedor
COPY . .

# Instala las dependencias de Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Genera la clave de la aplicación
RUN php artisan key:generate

# Configura permisos
RUN chmod -R 775 storage bootstrap/cache

# Exponer el puerto 8080
EXPOSE 8080

# Iniciar el servidor de Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
