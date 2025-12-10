/* ============================================
   DSW DATA WEB SOLUTIONS - LANDING PAGE
   Arquivo JavaScript Principal
   
   ÍNDICE:
   1. Configurações e Variáveis Globais
   2. Sistema de Partículas Interativas
   3. Navegação e Menu Mobile
   4. Scroll Effects (Header, Back to Top)
   5. Filtros do Portfólio
   6. Animações on Scroll
   7. Formulário de Contato com EmailJS
   8. Utilitários
   9. Inicialização
============================================ */

// ============================================
// 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// Centraliza todas as configurações do site
// ============================================

/**
 * Objeto de configuração principal
 * Facilita ajustes sem procurar no código
 */
const CONFIG = {
    // Configurações das partículas
    particles: {
        count: 80,
        maxRadius: 3,
        minRadius: 1,
        maxSpeed: 0.5,
        connectionDistance: 150,
        mouseRadius: 150,
        colors: {
            particle: 'rgba(102, 126, 234, 0.6)',
            line: 'rgba(102, 126, 234, 0.15)'
        }
    },
    
    // Configurações de scroll
    scroll: {
        headerOffset: 50,
        backToTopOffset: 500
    },
    
    // Seletores DOM
    selectors: {
        canvas: '#particles-canvas',
        header: '#header',
        navToggle: '#nav-toggle',
        navMenu: '#nav-menu',
        navLinks: '.nav__link',
        backToTop: '#back-to-top',
        portfolioFilters: '.portfolio__filter',
        portfolioCards: '.portfolio-card',
        contactForm: '#contact-form',
        animatedElements: '.animate-on-scroll'
    },
    
    // ============================================
    // CONFIGURAÇÃO DO EMAILJS
    // Substitua pelos seus IDs do painel EmailJS
    // ============================================
    emailjs: {
        publicKey: 'vBH7wkuSP3OO2riWW',
        serviceId: 'service_56133hz',
        templateId: 'template_qa3zl06'
    }
};

// ============================================
// 2. SISTEMA DE PARTÍCULAS INTERATIVAS
// ============================================

class Particle {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * CONFIG.particles.maxSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.particles.maxSpeed;
        this.radius = Math.random() * (CONFIG.particles.maxRadius - CONFIG.particles.minRadius) + CONFIG.particles.minRadius;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx = -this.vx;
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy = -this.vy;
        }
    }
    
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = CONFIG.particles.colors.particle.replace('0.6', this.opacity.toString());
        this.ctx.fill();
    }
    
    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        if (this.x > width) this.x = width;
        if (this.y > height) this.y = height;
    }
}

class ParticleSystem {
    constructor(canvasSelector) {
        this.canvas = document.querySelector(canvasSelector);
        
        if (!this.canvas) {
            console.warn('Canvas não encontrado:', canvasSelector);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.isRunning = true;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.particles.forEach(particle => {
            particle.resize(this.canvas.width, this.canvas.height);
        });
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.particles.count; i++) {
            this.particles.push(
                new Particle(this.ctx, this.canvas.width, this.canvas.height)
            );
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        document.addEventListener('visibilitychange', () => {
            this.isRunning = !document.hidden;
            if (this.isRunning) {
                this.animate();
            }
        });
    }
    
    drawConnections() {
        const distance = CONFIG.particles.connectionDistance;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < distance) {
                    const opacity = 1 - (dist / distance);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = CONFIG.particles.colors.line.replace('0.15', (opacity * 0.15).toString());
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    handleMouseInteraction() {
        if (this.mouse.x === null || this.mouse.y === null) return;
        
        const mouseRadius = CONFIG.particles.mouseRadius;
        
        this.particles.forEach(particle => {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseRadius) {
                const force = (mouseRadius - dist) / mouseRadius;
                const dirX = dx / dist || 0;
                const dirY = dy / dist || 0;
                
                particle.x += dirX * force * 2;
                particle.y += dirY * force * 2;
            }
        });
        
        this.particles.forEach(particle => {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseRadius) {
                const opacity = 1 - (dist / mouseRadius);
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        this.drawConnections();
        this.handleMouseInteraction();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// 3. NAVEGAÇÃO E MENU MOBILE
// ============================================

class Navigation {
    constructor() {
        this.header = document.querySelector(CONFIG.selectors.header);
        this.navToggle = document.querySelector(CONFIG.selectors.navToggle);
        this.navMenu = document.querySelector(CONFIG.selectors.navMenu);
        this.navLinks = document.querySelectorAll(CONFIG.selectors.navLinks);
        
        if (this.navToggle && this.navMenu) {
            this.init();
        }
    }
    
    init() {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.setActiveLink(link);
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ============================================
// 4. SCROLL EFFECTS
// ============================================

class ScrollEffects {
    constructor() {
        this.header = document.querySelector(CONFIG.selectors.header);
        this.backToTop = document.querySelector(CONFIG.selectors.backToTop);
        this.navigation = null;
        
        this.init();
    }
    
    setNavigation(nav) {
        this.navigation = nav;
    }
    
    init() {
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => this.scrollToTop());
        }
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        if (this.header) {
            if (scrollY > CONFIG.scroll.headerOffset) {
                this.header.classList.add('header--scrolled');
            } else {
                this.header.classList.remove('header--scrolled');
            }
        }
        
        if (this.backToTop) {
            if (scrollY > CONFIG.scroll.backToTopOffset) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        }
        
        if (this.navigation) {
            this.navigation.updateActiveOnScroll();
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ============================================
// 5. FILTROS DO PORTFÓLIO
// ============================================

class PortfolioFilter {
    constructor() {
        this.filters = document.querySelectorAll(CONFIG.selectors.portfolioFilters);
        this.cards = document.querySelectorAll(CONFIG.selectors.portfolioCards);
        
        if (this.filters.length && this.cards.length) {
            this.init();
        }
    }
    
    init() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.dataset.filter;
                this.setActiveFilter(filter);
                this.filterCards(category);
            });
        });
    }
    
    setActiveFilter(activeFilter) {
        this.filters.forEach(filter => filter.classList.remove('active'));
        activeFilter.classList.add('active');
    }
    
    filterCards(category) {
        this.cards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

// ============================================
// 6. ANIMAÇÕES ON SCROLL
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll(CONFIG.selectors.animatedElements);
        
        if (this.elements.length && 'IntersectionObserver' in window) {
            this.init();
        }
    }
    
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ============================================
// 7. FORMULÁRIO DE CONTATO COM EMAILJS
// ============================================

/**
 * Classe ContactForm - VERSÃO ÚNICA COM EMAILJS
 * Gerencia validação e envio do formulário via EmailJS
 */
class ContactForm {
    constructor() {
        this.form = document.querySelector(CONFIG.selectors.contactForm);
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.originalBtnText = this.submitBtn?.innerHTML;
        this.emailjsLoaded = false;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Carrega o SDK do EmailJS
        this.loadEmailJS();
        
        // Event listener para submit do formulário
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validação em tempo real
        const inputs = this.form.querySelectorAll('.form__input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    /**
     * Carrega o SDK do EmailJS dinamicamente
     */
    loadEmailJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            // Inicializa com a Public Key
            emailjs.init(CONFIG.emailjs.publicKey);
            this.emailjsLoaded = true;
            console.log('📧 EmailJS inicializado com sucesso!');
        };
        script.onerror = () => {
            console.error('❌ Erro ao carregar EmailJS SDK');
        };
        document.head.appendChild(script);
    }
    
    /**
     * Manipula o envio do formulário
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        console.log('🔄 Iniciando envio do formulário...');
        
        // Valida o formulário
        if (!this.validateForm()) {
            console.log('❌ Formulário inválido');
            return;
        }
        
        // Verifica se EmailJS está carregado
        if (!this.emailjsLoaded) {
            console.error('❌ EmailJS ainda não foi carregado');
            this.showError('Aguarde alguns segundos e tente novamente.');
            return;
        }
        
        // Mostra loading no botão
        this.setLoading(true);
        
        try {
            // Coleta os dados do formulário
            // IMPORTANTE: Os nomes aqui devem corresponder às variáveis do template no EmailJS
            const formData = {
                name: this.form.querySelector('#name').value,
                email: this.form.querySelector('#email').value,
                service: this.form.querySelector('#service').value,
                message: this.form.querySelector('#message').value,
                // Campos extras que podem ser úteis no template
                to_name: 'DSW Data',
                from_name: this.form.querySelector('#name').value,
                reply_to: this.form.querySelector('#email').value
            };
            
            console.log('📤 Enviando dados:', formData);
            console.log('📧 Service ID:', CONFIG.emailjs.serviceId);
            console.log('📧 Template ID:', CONFIG.emailjs.templateId);
            
            // Envia via EmailJS
            const response = await emailjs.send(
                CONFIG.emailjs.serviceId,
                CONFIG.emailjs.templateId,
                formData
            );
            
            console.log('✅ Email enviado com sucesso!', response);
            
            // Mostra sucesso
            this.showSuccess();
            
            // Limpa o formulário
            this.form.reset();
            
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            
            // Mostra mensagem de erro detalhada
            let errorMessage = 'Erro ao enviar mensagem. ';
            
            if (error.text) {
                errorMessage += error.text;
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Tente novamente ou use o WhatsApp.';
            }
            
            this.showError(errorMessage);
        } finally {
            this.setLoading(false);
        }
    }
    
    /**
     * Altera estado do botão para loading
     */
    setLoading(isLoading) {
        if (!this.submitBtn) return;
        
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <span>Enviando...</span>
                <svg class="btn__icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
                </svg>
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalBtnText;
        }
    }
    
    /**
     * Valida todos os campos
     */
    validateForm() {
        const inputs = this.form.querySelectorAll('.form__input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Valida um campo específico
     */
    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (!value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Digite um email válido';
            }
        }
        
        if (!isValid) {
            this.showFieldError(input, errorMessage);
        } else {
            this.clearError(input);
        }
        
        return isValid;
    }
    
    /**
     * Mostra erro em um campo
     */
    showFieldError(input, message) {
        this.clearError(input);
        input.classList.add('form__input--error');
        
        const errorEl = document.createElement('span');
        errorEl.className = 'form__error';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
        
        input.parentNode.appendChild(errorEl);
    }
    
    /**
     * Remove erro de um campo
     */
    clearError(input) {
        input.classList.remove('form__input--error');
        const errorEl = input.parentNode.querySelector('.form__error');
        if (errorEl) errorEl.remove();
    }
    
    /**
     * Mostra mensagem de sucesso
     */
    showSuccess() {
        // Remove mensagens anteriores
        this.removeMessages();
        
        const successEl = document.createElement('div');
        successEl.className = 'form__success';
        successEl.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Mensagem enviada com sucesso! Entrarei em contato em breve.</span>
        `;
        successEl.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 0.5rem;
            color: #16a34a;
            margin-top: 1rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        this.form.appendChild(successEl);
        
        setTimeout(() => {
            successEl.style.opacity = '0';
            successEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => successEl.remove(), 300);
        }, 5000);
    }
    
    /**
     * Mostra mensagem de erro
     */
    showError(message) {
        // Remove mensagens anteriores
        this.removeMessages();
        
        const errorEl = document.createElement('div');
        errorEl.className = 'form__error-global';
        errorEl.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>${message}</span>
        `;
        errorEl.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 0.5rem;
            color: #dc2626;
            margin-top: 1rem;
        `;
        
        this.form.appendChild(errorEl);
        
        setTimeout(() => {
            errorEl.style.opacity = '0';
            errorEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => errorEl.remove(), 300);
        }, 5000);
    }
    
    /**
     * Remove mensagens de sucesso/erro anteriores
     */
    removeMessages() {
        const messages = this.form.querySelectorAll('.form__success, .form__error-global');
        messages.forEach(msg => msg.remove());
    }
}

// ============================================
// 8. UTILITÁRIOS
// ============================================

function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector(CONFIG.selectors.header)?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .portfolio-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
        });
    } else {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Adiciona CSS para animação de loading
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
        .form__input--error {
            border-color: #ef4444 !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 9. INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DSW Data - Inicializando...');
    
    // Adiciona estilos customizados
    addCustomStyles();
    
    // Inicializa sistema de partículas
    const particleSystem = new ParticleSystem(CONFIG.selectors.canvas);
    
    // Inicializa navegação
    const navigation = new Navigation();
    
    // Inicializa efeitos de scroll
    const scrollEffects = new ScrollEffects();
    scrollEffects.setNavigation(navigation);
    
    // Inicializa filtros do portfólio
    const portfolioFilter = new PortfolioFilter();
    
    // Inicializa animações de scroll
    const scrollAnimations = new ScrollAnimations();
    
    // Inicializa formulário de contato COM EmailJS
    const contactForm = new ContactForm();
    
    // Utilitários
    updateYear();
    setupSmoothScroll();
    setupCardHoverEffects();
    setupLazyLoading();
    
    console.log('✅ DSW Data - Inicialização completa!');
});

window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.error);
});

window.addEventListener('load', () => {
    console.log('📄 Página totalmente carregada');
});
