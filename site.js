// PERSONALIZATE - hardening compartido para paginas estaticas
(function(){
  var quoteContext = null;
  var QUOTE_STORAGE_KEY = 'personalizateQuoteContext';

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function cleanQuoteValue(value, max){
    return String(value || '')
      .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max || 80);
  }

  function getScopedNodes(link, selector){
    if(!selector || !link) return [];
    var scope = link.closest('.modal-content, .modal, .product-card, section, main') || document;
    var nodes = Array.prototype.slice.call(scope.querySelectorAll(selector));
    if(nodes.length) return nodes;
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function readNodeValue(node){
    if(!node) return '';
    if(node.matches && node.matches('input, select, textarea')) return cleanQuoteValue(node.value, 80);
    return cleanQuoteValue(node.getAttribute('data-value') || node.getAttribute('title') || node.textContent, 80);
  }

  function resolveSelectionValue(link, selector){
    var values = [];
    getScopedNodes(link, selector).forEach(function(node){
      var value = readNodeValue(node);
      if(value && values.indexOf(value) === -1) values.push(value);
    });
    return values.join(' / ');
  }

  function buildQuoteUrl(context){
    var params = new URLSearchParams();
    var category = cleanQuoteValue(context && context.category, 60);
    var product = cleanQuoteValue(context && context.product, 90);
    var size = cleanQuoteValue(context && context.size, 90);
    var color = cleanQuoteValue(context && context.color, 90);
    if(category) params.set('categoria', category);
    if(product) params.set('modelo', product);
    if(size) params.set('talle', size);
    if(color) params.set('color', color);
    return 'index.html' + (params.toString() ? ('?' + params.toString()) : '') + '#contacto';
  }

  function saveQuoteContext(context){
    try{
      if(!window.sessionStorage) return;
      var cleanContext = {
        category: cleanQuoteValue(context && context.category, 60),
        product: cleanQuoteValue(context && context.product, 90),
        size: cleanQuoteValue(context && context.size, 90),
        color: cleanQuoteValue(context && context.color, 90)
      };
      window.sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(cleanContext));
    }catch(_error){}
  }

  function readStoredQuoteContext(){
    try{
      if(!window.sessionStorage) return null;
      var raw = window.sessionStorage.getItem(QUOTE_STORAGE_KEY);
      if(!raw) return null;
      var parsed = JSON.parse(raw);
      return {
        category: cleanQuoteValue(parsed && parsed.category, 60),
        product: cleanQuoteValue(parsed && parsed.product, 90),
        size: cleanQuoteValue(parsed && parsed.size, 90),
        color: cleanQuoteValue(parsed && parsed.color, 90)
      };
    }catch(_error){
      return null;
    }
  }

  function clearStoredQuoteContext(){
    try{
      if(window.sessionStorage) window.sessionStorage.removeItem(QUOTE_STORAGE_KEY);
    }catch(_error){}
  }

  var modalQuoteConfigs = {
    'remeras.html': {
      r1: { category: 'Remeras', product: 'Remera DTF Full Color', sizeSelector: '.talle-btn.active', colorSelector: '#r1-color-name' },
      r2: { category: 'Remeras', product: 'Remera Sublimacion 360', sizeSelector: '.talle-btn.active', colorSelector: '#r2-color-name' },
      r3: { category: 'Remeras', product: 'Remera Vinilo Textil', sizeSelector: '.talle-btn.active', colorSelector: '#r3-color-name' },
      r4: { category: 'Remeras', product: 'Pack Remeras x10', sizeSelector: '.talle-btn.active', colorSelector: '#r4-color-name' },
      'mr-lisa': { category: 'Remeras', product: 'Remera Lisa', sizeSelector: '.talle-btn.active', colorSelector: '#color-label-lisa' }
    },
    'gorras.html': {
      g1: { category: 'Gorras', product: 'Trucker Vinilo', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' },
      g2: { category: 'Gorras', product: 'Snapback Transfer DTF', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' },
      g3: { category: 'Gorras', product: 'Bucket Hat', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' },
      g4: { category: 'Gorras', product: 'Trucker DTF', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' },
      g5: { category: 'Gorras', product: '5 Paneles', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' },
      g6: { category: 'Gorras', product: 'Pack Equipos / Eventos', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' }
    },
    'pullovers.html': {
      p1: { category: 'Pullovers', product: 'Pullover con Capucha', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' },
      p2: { category: 'Pullovers', product: 'Pullover Solo Frente', sizeSelector: '.size-btn.sel', colorSelector: '.modal-color-dot.sel' },
      p3: { category: 'Pullovers', product: 'Pack Equipos', sizeSelector: '.size-btn.sel' }
    }
  };

  function getModalQuoteContext(link){
    if(!link) return null;
    var modal = link.closest('.modal-overlay');
    if(!modal || !modal.id) return null;
    var pageName = ((window.location.pathname || '').split('/').pop() || 'index.html').toLowerCase();
    var pageConfig = modalQuoteConfigs[pageName];
    var modalConfig = pageConfig && pageConfig[modal.id];
    if(!modalConfig) return null;
    return {
      category: cleanQuoteValue(modalConfig.category, 60),
      product: cleanQuoteValue(modalConfig.product, 90),
      size: resolveSelectionValue(link, modalConfig.sizeSelector),
      color: resolveSelectionValue(link, modalConfig.colorSelector)
    };
  }

  function getCardQuoteContext(link){
    if(!link) return null;
    var card = link.closest('.product-card');
    if(!card) return null;
    var pageName = ((window.location.pathname || '').split('/').pop() || 'index.html').toLowerCase();
    if(pageName !== 'pullovers.html') return null;
    var title = card.querySelector('h3');
    var colorLabel = card.querySelector('.color-name');
    return {
      category: 'Pullovers',
      product: cleanQuoteValue(title && title.textContent, 90),
      color: cleanQuoteValue(colorLabel && colorLabel.textContent, 90)
    };
  }

  function getQuoteContextFromLink(link){
    if(!link) return null;
    return {
      category: cleanQuoteValue(link.getAttribute('data-quote-category'), 60),
      product: cleanQuoteValue(link.getAttribute('data-quote-product'), 90),
      size: resolveSelectionValue(link, link.getAttribute('data-quote-size-target')),
      color: resolveSelectionValue(link, link.getAttribute('data-quote-color-target'))
    };
  }

  function applyQuoteContextFromUrl(){
    try{
      var params = new URLSearchParams(window.location.search);
      var category = cleanQuoteValue(params.get('categoria'), 60);
      var product = cleanQuoteValue(params.get('modelo'), 90);
      var size = cleanQuoteValue(params.get('talle'), 90);
      var color = cleanQuoteValue(params.get('color'), 90);
      var storedContext = (!category && !product && !size && !color) ? readStoredQuoteContext() : null;
      quoteContext = {
        category: category || cleanQuoteValue(storedContext && storedContext.category, 60),
        product: product || cleanQuoteValue(storedContext && storedContext.product, 90),
        size: size || cleanQuoteValue(storedContext && storedContext.size, 90),
        color: color || cleanQuoteValue(storedContext && storedContext.color, 90)
      };
      if(storedContext) clearStoredQuoteContext();

      var productSelect = document.getElementById('f_producto');
      if(productSelect && quoteContext.category){
        var optionMatch = Array.prototype.find.call(productSelect.options, function(option){
          return option.value === quoteContext.category;
        });
        if(optionMatch) productSelect.value = quoteContext.category;
      }
    }catch(_error){
      quoteContext = null;
    }
  }

  ready(function(){
    applyQuoteContextFromUrl();

    document.querySelectorAll('a[target="_blank"]').forEach(function(link){
      var rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', Array.from(rel).join(' '));
    });

    document.querySelectorAll('img').forEach(function(img){
      if(!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if(!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });

    document.addEventListener('click', function(event){
      var closeButton = event.target.closest && event.target.closest('.modal-close');
      if(!closeButton) return;
      var modal = closeButton.closest('.modal-overlay');
      if(modal){
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('click', function(event){
      var quoteLink = event.target.closest && event.target.closest('a[data-quote-category], a.modal-btn[href*="index.html#contacto"], a.cta-btn[href*="index.html#contacto"], a.overlay-btn-secondary[href*="index.html#contacto"]');
      if(!quoteLink) return;
      var context = quoteLink.hasAttribute('data-quote-category') ? getQuoteContextFromLink(quoteLink) : (getModalQuoteContext(quoteLink) || getCardQuoteContext(quoteLink));
      if(context && (context.category || context.product)){
        saveQuoteContext(context);
        quoteLink.setAttribute('href', buildQuoteUrl(context));
      }
    }, true);
  });

  window.closeModalById = function(id){
    var modal = document.getElementById(id);
    if(modal){
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.toggleMascot = function(){
    var bubble = document.getElementById('mascotBubble');
    var hint = document.getElementById('mascotHint');
    if(!bubble) return;
    var open = !bubble.classList.contains('open');
    bubble.classList.toggle('open', open);
    if(hint) hint.style.display = open ? 'none' : 'block';
  };

  window.selectTalle = function(button){
    if(!button) return;
    var group = button.parentElement;
    if(group){
      group.querySelectorAll('.talle-btn').forEach(function(btn){
        btn.classList.remove('active');
      });
    }
    button.classList.add('active');
  };

  window.PersonalizateQuote = {
    buildUrl: buildQuoteUrl,
    getContextFromLink: getQuoteContextFromLink,
    getContext: function(){
      return quoteContext ? {
        category: quoteContext.category,
        product: quoteContext.product,
        size: quoteContext.size,
        color: quoteContext.color
      } : null;
    }
  };
})();
