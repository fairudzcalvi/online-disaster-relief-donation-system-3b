FROM php:8.2-apache

# Install PHP extensions required for MySQL/PDO
RUN docker-php-ext-install pdo pdo_mysql mysqli

# ---------------------------------------------------------------
# MPM conflict fix
# The php:8.2-apache base image ships with mpm_event enabled by
# default, which conflicts with mod_php (which requires mpm_prefork).
# Disable ALL MPM modules first, then enable only mpm_prefork so
# Apache never sees more than one MPM loaded at the same time.
# ---------------------------------------------------------------
RUN a2dismod mpm_event  || true \
 && a2dismod mpm_worker || true \
 && a2dismod mpm_itk    || true \
 && a2enmod  mpm_prefork \
 && a2enmod  rewrite

# Copy application source into the Apache document root
COPY . /var/www/html/

# Set correct ownership and permissions
RUN chown -R www-data:www-data /var/www/html \
 && find /var/www/html -type d -exec chmod 755 {} \; \
 && find /var/www/html -type f -exec chmod 644 {} \;

# Allow .htaccess overrides for mod_rewrite
RUN sed -i 's/AllowOverride None/AllowOverride All/g' \
        /etc/apache2/apache2.conf

EXPOSE 80

CMD ["apache2-foreground"]
