(function($) {
    'use strict';
    // Значения по умолчанию
    var defaults = {
        position: 'left',
        speed: 500,
        defaultClass: 'ag_rotator',
        angles: {}
    };

    var defaultsLeft = {
        currentIndexAngle: 0,
        nextIndexAngle: 6,
        previousIndexAngle: -10,
        hiddenIndexAngle: 180
    };

    var defaultsRight = {
        currentIndexAngle: 0,
        nextIndexAngle: 10,
        previousIndexAngle: -6,
        hiddenIndexAngle: 180
    };

    var defaultsTop = {
        currentIndexAngle: 270,
        nextIndexAngle: 290,
        previousIndexAngle: 250,
        hiddenIndexAngle: 90
    };

    var defaultsBottom = {
        currentIndexAngle: 90,
        nextIndexAngle: 110,
        previousIndexAngle: 70,
        hiddenIndexAngle: 270
    };


    // Функция расчета смещения угла относительно текущего угла
    function getCorrectAngleOffset (angle,toangle) {
        var retangle=360-(angle % 360)+toangle;
        if (retangle>=360) retangle=retangle%360;
        return retangle;
    }

    // Функция очистки классов
    function clearClasses (element) {
        $(element).removeClass('ag_rotator_image-current')
            .removeClass('ag_rotator_image-next')
            .removeClass('ag_rotator_image-prev')
            .removeClass('ag_rotator_image-hidden');
    }

    // Методы передаваемые как аргументы
    var methods = {
        // Инициализация
        init : function(options,callback) {
            // Настройки по умолчанию
            this.settings = $.extend( {}, defaults, options );
            if (callback) this.callback=callback;
            switch (this.settings.position) {
                case 'left':
                    this.settings.angles = $.extend({}, this.settings.angles, defaultsLeft);
                    break;
                case 'right':
                    this.settings.angles = $.extend({}, this.settings.angles, defaultsRight);
                    break;
                case 'top':
                    this.settings.angles = $.extend({}, this.settings.angles, defaultsTop);
                    break;
                case 'bottom':
                    this.settings.angles = $.extend({}, this.settings.angles, defaultsBottom);
                    break;
                default:
                    this.settings.angles = $.extend({}, this.settings.angles, defaultsLeft);
            }

            // Признак таймаута эвентов
            console.log(this.settings);
            this.isEvent=true;
            // Массив элементов
            this.elements=[];
            // Массив уголов
            this.elementsAngle=[];
            // Ссылка на себя
            var _this=this;
            // Добавляем CSS класс на контейнер
            this.addClass(this.settings.defaultClass+'-'+this.settings.position);
            // Инициализация изображений
            this.find('img').each(function(element,index){
                // Добавляем класс для изображения
                $(this).addClass(_this.settings.defaultClass+'_image');
                // Добавляем добавляем изображение во внутреннее хранилище
                _this.elements.push(this);
                // Добавляем добавляем угол текущего изображения во внутреннее хранилище
                _this.elementsAngle.push(_this.settings.angles.hiddenIndexAngle);
                // Вращаем изображение (скрываем)
                $(this).css('transform','rotate('+_this.settings.angles.hiddenIndexAngle+'deg)');
            });
            // Инициализация кнопок след/пред
            this.append('<div class="prev_button"></div><div class="next_button"></div>');
            this.prepend('<a href="#" class="link"></a>');
            // Определяем текущее активное изображение (среднее)
            this.currentIndex=0;
            // Определяем следующее активное изображение
            this.nextIndex=this.currentIndex+1;
            // Определяем предыдущее активное изображение
            this.previousIndex=this.elements.length-1;
            // Устанавливаем начальные свойства следующего изображения
            this.elementsAngle[this.nextIndex]=this.settings.angles.nextIndexAngle;
            // Устанавливаем начальные свойства предыдущего изображения
            this.elementsAngle[this.previousIndex]=this.settings.angles.previousIndexAngle;
            // Устанавливаем начальные свойства текущего изображения
            this.elementsAngle[this.currentIndex]=this.settings.angles.currentIndexAngle;
            // Применяем параметры
            this.imagesApplyPosition();
            // Вешаем события на контейнер
            this.bindEvents();
            // Возвращаем себя
            return this;
        },
        // Обновляем себя
        update : function() {
            // ТОДО рефреш себя
        }
    };
    // Объявляем функцию - класс
    var AGRotator = function(method) {
        var _this=this;
        // Метод обновления параметров
        this.imagesApplyPosition=function(direction) {
            this.elements.forEach(function(element,index){
                if (index===_this.currentIndex) {
                    // Устанавливаем свойства текущего изображения
                    clearClasses(element);
                    $(element).css('transform','rotate('+_this.elementsAngle[index]+'deg)')
                        .addClass('ag_rotator_image-current');

//                    $(element).css('z-index','100');
//                    $(element).css('margin-left','-1px');
//                    $(element).css('margin-top','0');
                } else if (index===_this.previousIndex) {
                    // Устанавливаем свойства предыдущего изображения
                    clearClasses(element);
                    $(element).css('transform','rotate('+_this.elementsAngle[index]+'deg)')
                        .addClass('ag_rotator_image-prev');
//                    $(element).css('z-index','10');
//                    $(element).css('margin-left','-75px');
//                    $(element).css('margin-top','-24px');
                } else if (index===_this.nextIndex) {
                    // Устанавливаем свойства следующего изображения
                    clearClasses(element);
                    $(element).css('transform','rotate('+_this.elementsAngle[index]+'deg)')
                        .addClass('ag_rotator_image-next');
//                    $(element).css('z-index','10');
//                    $(element).css('margin-left','-36px');
//                    $(element).css('margin-top','16px');
                } else {
                    // Устанавливаем свойства для скрытого изображения
                    if (direction==='Up') {
                        if (getCorrectAngleOffset(_this.elementsAngle[index],_this.settings.angles.hiddenIndexAngle)!==0) {
                            _this.elementsAngle[index] += -360 + getCorrectAngleOffset(_this.elementsAngle[index], _this.settings.angles.hiddenIndexAngle);
                        }
                    } else {
                        _this.elementsAngle[index]+=getCorrectAngleOffset(_this.elementsAngle[index],_this.settings.angles.hiddenIndexAngle);
                    }
                    clearClasses(element);
                    $(element).css('transform','rotate('+_this.elementsAngle[index]+'deg)')
                        .addClass('ag_rotator_image-hidden');
//                    $(element).css('z-index','10');
//                    $(element).css('margin-left','0');
//                    $(element).css('margin-top','0');
                }
            });
        };
        // Прокрутить вперед
        this.goNext=function () {
            if (_this.callback) $(_this.find('.link').hide());
            // Прересчитываем текущие индексы
            _this.currentIndex=_this.currentIndex--?_this.currentIndex--:_this.elements.length-1;
            _this.nextIndex=(_this.currentIndex+1)>_this.elements.length-1?0:_this.currentIndex+1;
            _this.previousIndex=(_this.currentIndex-1)>=0?_this.currentIndex-1:_this.elements.length-1;
            // пересчитываем углы для текущих индексов
            _this.elementsAngle[_this.nextIndex]+=getCorrectAngleOffset(_this.elementsAngle[_this.nextIndex],_this.settings.angles.nextIndexAngle);
            _this.elementsAngle[_this.previousIndex]+=getCorrectAngleOffset(_this.elementsAngle[_this.previousIndex],_this.settings.angles.previousIndexAngle);
            _this.elementsAngle[_this.currentIndex]=_this.elementsAngle[_this.currentIndex]+getCorrectAngleOffset(_this.elementsAngle[_this.currentIndex],_this.settings.angles.currentIndexAngle);
            // Применяем параметры
            _this.imagesApplyPosition();
            _this.isEvent=false;
            window.setTimeout(function(){
                _this.isEvent=true;
                $(_this.find('.link').fadeIn('slow'));
            }, 500);
        };
        // Прокрутить назад
        this.goPrev=function () {
            if (_this.callback) $(_this.find('.link').hide());
            // Прересчитываем текущие индексы
            _this.currentIndex=_this.currentIndex+1>_this.elements.length-1?0:_this.currentIndex+1;
            _this.nextIndex=(_this.currentIndex+1)>_this.elements.length-1?0:_this.currentIndex+1;
            _this.previousIndex=(_this.currentIndex-1)>=0?_this.currentIndex-1:_this.elements.length-1;
            // пересчитываем углы для текущих индексов
            _this.elementsAngle[_this.currentIndex]+=-360+getCorrectAngleOffset(_this.elementsAngle[_this.currentIndex],_this.settings.angles.currentIndexAngle);
            if (_this.elements.length>2) _this.elementsAngle[_this.nextIndex]+=-360+getCorrectAngleOffset(_this.elementsAngle[_this.nextIndex],_this.settings.angles.nextIndexAngle);
            if (_this.elements.length>1) _this.elementsAngle[_this.previousIndex]+=-360+getCorrectAngleOffset(_this.elementsAngle[_this.previousIndex],_this.settings.angles.previousIndexAngle);
            // Применяем параметры
            _this.imagesApplyPosition('Up');
            _this.isEvent=false;
            window.setTimeout(function() {
                _this.isEvent=true;
                if (_this.callback) $(_this.find('.link').fadeIn('slow'));
            }, 500);
        };
        // Функция объявления событий
        this.bindEvents=function () {
            // Кнопка вперед
            this.on('click','.next_button',function() {
                if (_this.isEvent) _this.goNext();
                return false;
            });
            // Кнопка назад
            this.on('click','.prev_button',function() {
                if (_this.isEvent) _this.goPrev();
                return false;
            });
            // События на скролл
            this.on('DOMMouseScroll mousewheel', function (event) {
                if (_this.isEvent) {
                    if( event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0 ) {
                        // scroll down
                        if (_this.settings.position==='left' || _this.settings.position==='bottom') {
                            _this.goNext();
                        } else {
                            _this.goPrev();
                        }
                    } else {
                        // scroll up
                        if (_this.settings.position==='left' || _this.settings.position==='bottom') {
                            _this.goPrev();

                        } else {
                            _this.goNext();
                        }

                    }
                }
                // Отменяем скролл на странице
                return false;
            });
            // Клик
            if (this.callback) {
                $(this).on('click','.link',function(event){
                    event.preventDefault();
                    _this.callback(_this.currentIndex);
                });
            }
        };
        // Логика вызова метода
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем '+method+' не существует для jQuery.ag_rotator');
        }
    };

    // Добавляем плагин в jQuery
    $.fn.ag_rotator = AGRotator;

})(jQuery);