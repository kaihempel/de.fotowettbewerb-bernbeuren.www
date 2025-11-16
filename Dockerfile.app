FROM php:8.4.15RC1-fpm-bookworm

RUN apt-get update && apt-get install -y libmcrypt-dev default-mysql-client libc-client-dev libgd-dev libpng-dev libjpeg62-turbo libjpeg-dev --no-install-recommends
RUN docker-php-ext-configure gd --with-jpeg

RUN NUMPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) \
&& docker-php-ext-install -j${NUMPROC} gd

RUN docker-php-ext-install bcmath
RUN docker-php-ext-install pdo_mysql

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.mode = debug, profile, coverage" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.start_with_request = trigger" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.discover_client_host = true" >> /usr/local/etc/php/conf.d/xdebug.ini

ADD php.ini /usr/local/etc/php/conf.d/20-system.ini
