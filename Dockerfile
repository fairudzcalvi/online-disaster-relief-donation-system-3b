FROM php:8.2-apache

# Fix MPM conflict — disable all MPMs then enable only prefork
RUN a2dismod mpm_event mpm_worker mpm_prefork 2>/dev/null || true && a2enmod mpm_prefork

# Enable mod_rewrite
RUN a2enmod rewrite

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Copy project files
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Apache config to allow .htaccess
RUN echo '<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/override.conf \
    && a2enconf override

EXPOSE 80
