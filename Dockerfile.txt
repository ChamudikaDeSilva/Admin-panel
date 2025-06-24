FROM php:8.2-apache

# Install system dependencies and PHP extensions including bcmath
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip bcmath

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# ✅ Copy app code first
COPY . .

# ✅ Copy Composer AFTER app code
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ✅ Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# ✅ Serve Laravel from public/
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf \
    && sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s|AllowOverride None|AllowOverride All|' /etc/apache2/apache2.conf

# Optional: Silence Apache FQDN warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

EXPOSE 80
