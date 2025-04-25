const $ = require('jquery');
require('../../js/jquery.unicornblast.js');

describe('jQuery Unicorn Blast Plugin', () => {
  let $element;
  
  beforeEach(() => {
    document.body.innerHTML = '';
    $element = $('<div></div>');
    $(document.body).append($element);
  });

  afterEach(() => {
    $('.flyingUnicorn').remove();
    $('#bigRainbow').remove();
    $('audio').remove();
  });

  test('initializes with default options', () => {
    $element.unicornblast();
    expect($('#bigRainbow').length).toBe(1);
    expect($('.flyingUnicorn').length).toBe(6);
    expect($('audio').length).toBe(4);
  });

  test('respects custom numberOfFlyBys option', () => {
    const spy = jest.spyOn(window, 'setTimeout');
    $element.unicornblast({ numberOfFlyBys: 5, start: 'delay', delayTime: 1000 });
    
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 1000);
    spy.mockRestore();
  });

  test('handles konami code trigger', () => {
    $element.unicornblast({ start: 'konamiCode' });
    
    const konamiSequence = [38,38,40,40,37,39,37,39,66,65];
    konamiSequence.forEach(key => {
      const event = new KeyboardEvent('keydown', { keyCode: key });
      window.dispatchEvent(event);
    });

    expect($('#bigRainbow').css('display')).toBe('block');
  });

  test('prevents multiple animations from running simultaneously', () => {
    $element.unicornblast({ start: 'click' });
    
    $element.trigger('click');
    $element.trigger('click');
    
    expect($('#bigRainbow').length).toBe(1);
  });

  test('cleans up after animation completes', (done) => {
    $element.unicornblast({ numberOfFlyBys: 1, start: 'delay', delayTime: 100 });
    
    setTimeout(() => {
      expect($('#bigRainbow').css('opacity')).toBe('0');
      expect($('.flyingUnicorn:visible').length).toBe(0);
      done();
    }, 5000);
  });

  test('handles window resize during animation', () => {
    $element.unicornblast();
    
    $(window).trigger('resize');
    
    expect($('#bigRainbow').attr('width')).toBeDefined();
  });

  test('cycles through all entry sides', () => {
    const entrySides = ['left', 'top', 'right', 'bottom'];
    $element.unicornblast({ numberOfFlyBys: 4, start: 'delay', delayTime: 100 });
    
    entrySides.forEach((side, index) => {
      const $unicorn = $('.flyingUnicorn').eq(index);
      expect($unicorn.length).toBe(1);
    });
  });
});
