FROM php:8.4.15RC1-fpm-bookworm

RUN apt-get update && apt-get install -y libmcrypt-dev default-mysql-client libc-client-dev --no-install-recommends \
    && docker-php-ext-install bcmath pdo_mysql

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode = debug, profile, coverage" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.start_with_request = trigger" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.discover_client_host = true" >> /usr/local/etc/php/conf.d/xdebug.ini

ADD php.ini /usr/local/etc/php/conf.d/20-system.ini
