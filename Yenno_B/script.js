/**
 * yenno_B Portfolio — Interactive JavaScript
 * Lightweight, zero-dependencies, responsive enhancements & clipboard interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification & Copy to Clipboard
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Audio click feedback via Web Audio API (lightweight, zero external files)
  let audioCtx = null;
  function playSubtleClick() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio not supported or blocked, fail silently
    }
  }

  function setupClipboardButtons() {
    const copyButtons = document.querySelectorAll('[data-clipboard]');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-clipboard');
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          playSubtleClick();
          showToast(`Discord "@${textToCopy}" copiado!`);
        }).catch(() => {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          playSubtleClick();
          showToast(`Discord "@${textToCopy}" copiado!`);
        });
      });
    });
  }

  setupClipboardButtons();

  // 2. Smooth internal anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          playSubtleClick();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 3. Interactive Terminal simulation easter egg
  const terminalWindow = document.querySelector('.terminal-window');
  if (terminalWindow) {
    const dots = terminalWindow.querySelectorAll('.dot-btn');
    dots.forEach((dot, index) => {
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        playSubtleClick();
        if (index === 0) { // Red - minimize/collapse
          terminalWindow.style.opacity = terminalWindow.style.opacity === '0.3' ? '1' : '0.3';
        } else if (index === 1) { // Yellow - clear responses
          const responses = terminalWindow.querySelectorAll('.terminal-response');
          responses.forEach(r => {
            r.style.display = r.style.display === 'none' ? 'block' : 'none';
          });
        } else if (index === 2) { // Green - full view toast
          showToast('Terminal status: Connected to yenno-desktop');
        }
      });
    });
  }

  // 4. Subtle 3D card tilt effect on mouse movement for desktop
  const profileCard = document.querySelector('.profile-card');
  if (profileCard && window.innerWidth > 992) {
    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      
      profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCard.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      profileCard.style.transition = 'transform 0.5s ease';
    });

    profileCard.addEventListener('mouseenter', () => {
      profileCard.style.transition = 'none';
    });
  }

  console.log('%c yenno_B %c Portfolio loaded successfully ', 'background: #00ff9d; color: #0b0d14; font-weight: bold; border-radius: 3px 0 0 3px;', 'background: #1e293b; color: #f8fafc; border-radius: 0 3px 3px 0;');
});
