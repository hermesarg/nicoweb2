// PERSONALIZATE - hardening compartido para paginas estaticas
(function(){
  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function(){
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
})();
