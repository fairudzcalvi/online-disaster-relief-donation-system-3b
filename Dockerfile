FROM php:8.2-apache

# Disable all MPM modules to avoid "More than one MPM loaded" conflict,
# then enable only mpm_prefork (required for mod_php).
RUN a2dismod mpm_event  || true && \
    a2dismod mpm_worker || true && \
    a2dismod mpm_itk    || true && \
    a2enmod  mpm_prefork

# Enable mod_rewrite for clean URLs
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy application source into the Apache document root
COPY . /var/www/html/

# Ensure Apache can read the files
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
