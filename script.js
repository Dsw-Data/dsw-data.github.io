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
   7. Formulário de Contato
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
        count: 80,              // Quantidade de partículas
        maxRadius: 3,           // Raio máximo da partícula
        minRadius: 1,           // Raio mínimo da partícula
        maxSpeed: 0.5,          // Velocidade máxima de movimento
        connectionDistance: 150, // Distância para conectar partículas
        mouseRadius: 150,       // Raio de influência do mouse
        colors: {
            particle: 'rgba(102, 126, 234, 0.6)',  // Cor das partículas
            line: 'rgba(102, 126, 234, 0.15)'      // Cor das linhas de conexão
        }
    },
    
    // Configurações de scroll
    scroll: {
        headerOffset: 50,       // Pixels para ativar header scrolled
        backToTopOffset: 500    // Pixels para mostrar botão back to top
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
    }
};

// ============================================
// 2. SISTEMA DE PARTÍCULAS INTERATIVAS
// Cria o background animado com partículas
// que reagem ao movimento do mouse
// ============================================

/**
 * Classe Particle
 * Representa uma única partícula no canvas
 * Cada partícula tem posição, velocidade e tamanho
 */
class Particle {
    /**
     * Construtor da partícula
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {number} canvasWidth - Largura do canvas
     * @param {number} canvasHeight - Altura do canvas
     */
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Posição inicial aleatória
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        
        // Velocidade aleatória (positiva ou negativa)
        this.vx = (Math.random() - 0.5) * CONFIG.particles.maxSpeed;
        this.vy = (Math.random() - 0.5) * CONFIG.particles.maxSpeed;
        
        // Tamanho aleatório
        this.radius = Math.random() * (CONFIG.particles.maxRadius - CONFIG.particles.minRadius) + CONFIG.particles.minRadius;
        
        // Opacidade base
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    /**
     * Atualiza a posição da partícula
     * Aplica movimento e verifica bordas do canvas
     */
    update() {
        // Move a partícula
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce nas bordas (rebate quando atinge a borda)
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx = -this.vx;
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy = -this.vy;
        }
    }
    
    /**
     * Desenha a partícula no canvas
     * Cria um círculo com a cor e opacidade definidas
     */
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = CONFIG.particles.colors.particle.replace('0.6', this.opacity.toString());
        this.ctx.fill();
    }
    
    /**
     * Atualiza dimensões do canvas (para resize)
     * @param {number} width - Nova largura
     * @param {number} height - Nova altura
     */
    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        
        // Se a partícula ficou fora da tela, reposiciona
        if (this.x > width) this.x = width;
        if (this.y > height) this.y = height;
    }
}

/**
 * Classe ParticleSystem
 * Gerencia todas as partículas e suas interações
 */
class ParticleSystem {
    /**
     * Inicializa o sistema de partículas
     * @param {string} canvasSelector - Seletor CSS do canvas
     */
    constructor(canvasSelector) {
        // Obtém referência do canvas
        this.canvas = document.querySelector(canvasSelector);
        
        // Verifica se o canvas existe
        if (!this.canvas) {
            console.warn('Canvas não encontrado:', canvasSelector);
            return;
        }
        
        // Obtém contexto 2D para desenhar
        this.ctx = this.canvas.getContext('2d');
        
        // Array para armazenar as partículas
        this.particles = [];
        
        // Posição do mouse (iniciado fora da tela)
        this.mouse = {
            x: null,
            y: null
        };
        
        // Flag para verificar se o sistema está ativo
        this.isRunning = true;
        
        // Inicializa o sistema
        this.init();
    }
    
    /**
     * Inicializa o canvas e os event listeners
     */
    init() {
        // Configura tamanho do canvas
        this.resize();
        
        // Cria as partículas
        this.createParticles();
        
        // Adiciona event listeners
        this.addEventListeners();
        
        // Inicia o loop de animação
        this.animate();
    }
    
    /**
     * Ajusta o tamanho do canvas para preencher a tela
     */
    resize() {
        // Define dimensões baseadas na janela
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Atualiza partículas existentes
        this.particles.forEach(particle => {
            particle.resize(this.canvas.width, this.canvas.height);
        });
    }
    
    /**
     * Cria as partículas baseado na configuração
     */
    createParticles() {
        // Limpa array existente
        this.particles = [];
        
        // Cria novas partículas
        for (let i = 0; i < CONFIG.particles.count; i++) {
            this.particles.push(
                new Particle(this.ctx, this.canvas.width, this.canvas.height)
            );
        }
    }
    
    /**
     * Adiciona os event listeners necessários
     */
    addEventListeners() {
        // Evento de resize da janela
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // Evento de movimento do mouse
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Remove posição do mouse quando sai da tela
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Pausa animação quando a aba não está visível (performance)
        document.addEventListener('visibilitychange', () => {
            this.isRunning = !document.hidden;
            if (this.isRunning) {
                this.animate();
            }
        });
    }
    
    /**
     * Desenha linhas conectando partículas próximas
     */
    drawConnections() {
        const distance = CONFIG.particles.connectionDistance;
        
        // Itera sobre cada par de partículas
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                // Calcula distância entre partículas
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Se estiverem próximas, desenha linha
                if (dist < distance) {
                    // Opacidade baseada na distância (mais perto = mais opaco)
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
    
    /**
     * Aplica interação do mouse com as partículas
     * Partículas próximas ao mouse se afastam
     */
    handleMouseInteraction() {
        // Só aplica se o mouse estiver na tela
        if (this.mouse.x === null || this.mouse.y === null) return;
        
        const mouseRadius = CONFIG.particles.mouseRadius;
        
        this.particles.forEach(particle => {
            // Calcula distância do mouse
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Se estiver dentro do raio de influência
            if (dist < mouseRadius) {
                // Calcula força de repulsão (mais forte quando mais perto)
                const force = (mouseRadius - dist) / mouseRadius;
                
                // Direção da repulsão (normalizada)
                const dirX = dx / dist || 0;
                const dirY = dy / dist || 0;
                
                // Aplica força de repulsão
                particle.x += dirX * force * 2;
                particle.y += dirY * force * 2;
            }
        });
        
        // Desenha linha do mouse para partículas próximas
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
    
    /**
     * Loop principal de animação
     * Usa requestAnimationFrame para performance
     */
    animate() {
        // Para se não estiver rodando
        if (!this.isRunning) return;
        
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualiza e desenha cada partícula
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Desenha conexões entre partículas
        this.drawConnections();
        
        // Aplica interação do mouse
        this.handleMouseInteraction();
        
        // Solicita próximo frame
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// 3. NAVEGAÇÃO E MENU MOBILE
// Controla o comportamento do menu
// ============================================

/**
 * Classe Navigation
 * Gerencia a navegação e menu mobile
 */
class Navigation {
    constructor() {
        // Obtém elementos do DOM
        this.header = document.querySelector(CONFIG.selectors.header);
        this.navToggle = document.querySelector(CONFIG.selectors.navToggle);
        this.navMenu = document.querySelector(CONFIG.selectors.navMenu);
        this.navLinks = document.querySelectorAll(CONFIG.selectors.navLinks);
        
        // Inicializa se os elementos existirem
        if (this.navToggle && this.navMenu) {
            this.init();
        }
    }
    
    init() {
        // Event listener para o botão hamburguer
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Fecha menu ao clicar em um link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.setActiveLink(link);
            });
        });
        
        // Fecha menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Fecha menu com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }
    
    /**
     * Alterna estado do menu mobile
     */
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Previne scroll do body quando menu está aberto
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    /**
     * Fecha o menu mobile
     */
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    /**
     * Define o link ativo na navegação
     * @param {HTMLElement} activeLink - Link clicado
     */
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    /**
     * Atualiza link ativo baseado na seção visível
     * Chamado durante o scroll
     */
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
// Efeitos baseados em scroll
// ============================================

/**
 * Classe ScrollEffects
 * Gerencia efeitos de scroll (header, back to top)
 */
class ScrollEffects {
    constructor() {
        this.header = document.querySelector(CONFIG.selectors.header);
        this.backToTop = document.querySelector(CONFIG.selectors.backToTop);
        this.navigation = null; // Será definido depois
        
        this.init();
    }
    
    /**
     * Define a instância de Navigation para updates
     * @param {Navigation} nav - Instância da navegação
     */
    setNavigation(nav) {
        this.navigation = nav;
    }
    
    init() {
        // Verifica estado inicial
        this.handleScroll();
        
        // Event listener para scroll
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Event listener para botão back to top
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => this.scrollToTop());
        }
    }
    
    /**
     * Manipula eventos de scroll
     */
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Header scrolled state
        if (this.header) {
            if (scrollY > CONFIG.scroll.headerOffset) {
                this.header.classList.add('header--scrolled');
            } else {
                this.header.classList.remove('header--scrolled');
            }
        }
        
        // Back to top visibility
        if (this.backToTop) {
            if (scrollY > CONFIG.scroll.backToTopOffset) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        }
        
        // Atualiza link ativo na navegação
        if (this.navigation) {
            this.navigation.updateActiveOnScroll();
        }
    }
    
    /**
     * Scroll suave para o topo
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ============================================
// 5. FILTROS DO PORTFÓLIO
// Sistema de filtro para os projetos
// ============================================

/**
 * Classe PortfolioFilter
 * Gerencia os filtros do portfólio
 */
class PortfolioFilter {
    constructor() {
        this.filters = document.querySelectorAll(CONFIG.selectors.portfolioFilters);
        this.cards = document.querySelectorAll(CONFIG.selectors.portfolioCards);
        
        if (this.filters.length && this.cards.length) {
            this.init();
        }
    }
    
    init() {
        // Adiciona event listeners aos filtros
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Obtém categoria do filtro clicado
                const category = filter.dataset.filter;
                
                // Atualiza filtro ativo
                this.setActiveFilter(filter);
                
                // Filtra os cards
                this.filterCards(category);
            });
        });
    }
    
    /**
     * Define o filtro ativo
     * @param {HTMLElement} activeFilter - Filtro clicado
     */
    setActiveFilter(activeFilter) {
        this.filters.forEach(filter => filter.classList.remove('active'));
        activeFilter.classList.add('active');
    }
    
    /**
     * Filtra os cards baseado na categoria
     * @param {string} category - Categoria para filtrar ('all' para todos)
     */
    filterCards(category) {
        this.cards.forEach(card => {
            // Obtém categoria do card
            const cardCategory = card.dataset.category;
            
            // Mostra/esconde com animação
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                // Adiciona animação de entrada
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
// Anima elementos quando entram na viewport
// ============================================

/**
 * Classe ScrollAnimations
 * Usa Intersection Observer para animar elementos
 */
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll(CONFIG.selectors.animatedElements);
        
        // Só inicializa se houver elementos e suporte a IntersectionObserver
        if (this.elements.length && 'IntersectionObserver' in window) {
            this.init();
        }
    }
    
    init() {
        /**
         * IntersectionObserver - API moderna para detectar visibilidade
         * Mais performático que scroll events
         */
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Quando o elemento entra na viewport
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Para de observar após animar (opcional)
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                // Trigger quando 20% do elemento está visível
                threshold: 0.2,
                // Margem para triggerar um pouco antes
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observa cada elemento
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ============================================
// 7. FORMULÁRIO DE CONTATO
// Validação e envio do formulário
// ============================================

/**
 * Classe ContactForm
 * Gerencia validação e envio do formulário
 */
class ContactForm {
    constructor() {
        this.form = document.querySelector(CONFIG.selectors.contactForm);
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validação em tempo real nos campos
        const inputs = this.form.querySelectorAll('.form__input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    /**
     * Manipula o envio do formulário
     * @param {Event} e - Evento de submit
     */
    handleSubmit(e) {
        e.preventDefault();
        
        // Valida todos os campos
        const isValid = this.validateForm();
        
        if (isValid) {
            // Coleta dados do formulário
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Aqui você pode implementar o envio real
            // Por exemplo, via fetch para uma API
            console.log('Dados do formulário:', data);
            
            // Mostra mensagem de sucesso
            this.showSuccess();
            
            // Limpa o formulário
            this.form.reset();
            
            // Alternativa: redirecionar para WhatsApp com a mensagem
            // this.redirectToWhatsApp(data);
        }
    }
    
    /**
     * Valida todos os campos do formulário
     * @returns {boolean} - True se válido
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
     * @param {HTMLElement} input - Campo a validar
     * @returns {boolean} - True se válido
     */
    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Verifica se está vazio
        if (!value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        // Validação específica para email
        else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Digite um email válido';
            }
        }
        
        // Exibe ou remove erro
        if (!isValid) {
            this.showError(input, errorMessage);
        } else {
            this.clearError(input);
        }
        
        return isValid;
    }
    
    /**
     * Mostra erro em um campo
     * @param {HTMLElement} input - Campo com erro
     * @param {string} message - Mensagem de erro
     */
    showError(input, message) {
        // Remove erro anterior se existir
        this.clearError(input);
        
        // Adiciona classe de erro
        input.classList.add('form__input--error');
        
        // Cria elemento de mensagem
        const errorEl = document.createElement('span');
        errorEl.className = 'form__error';
        errorEl.textContent = message;
        errorEl.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
        
        // Insere após o input
        input.parentNode.appendChild(errorEl);
    }
    
    /**
     * Remove erro de um campo
     * @param {HTMLElement} input - Campo para limpar
     */
    clearError(input) {
        input.classList.remove('form__input--error');
        
        const errorEl = input.parentNode.querySelector('.form__error');
        if (errorEl) {
            errorEl.remove();
        }
    }
    
    /**
     * Mostra mensagem de sucesso
     */
    showSuccess() {
        // Cria elemento de sucesso
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
        
        // Remove após 5 segundos
        setTimeout(() => {
            successEl.style.opacity = '0';
            successEl.style.transform = 'translateY(-10px)';
            successEl.style.transition = 'all 0.3s ease';
            
            setTimeout(() => successEl.remove(), 300);
        }, 5000);
    }
    
    /**
     * Redireciona para WhatsApp com mensagem pré-preenchida
     * @param {Object} data - Dados do formulário
     */
    redirectToWhatsApp(data) {
        const message = `
Olá! Vim pelo site e gostaria de mais informações.

*Nome:* ${data.name}
*Email:* ${data.email}
*Serviço:* ${data.service}
*Mensagem:* ${data.message}
        `.trim();
        
        const phone = '5511915572828';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        
        window.open(url, '_blank');
    }
}

// ============================================
// 8. UTILITÁRIOS
// Funções auxiliares
// ============================================

/**
 * Atualiza o ano no footer automaticamente
 */
function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Smooth scroll para links internos
 * Adiciona comportamento suave para todos os links com #
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset do header fixo
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

/**
 * Adiciona efeitos de hover nos service cards
 * Cria efeito de brilho seguindo o mouse
 */
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .portfolio-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Obtém posição relativa do mouse no card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Aplica variáveis CSS para o efeito
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Lazy loading para imagens
 * Carrega imagens apenas quando estão próximas da viewport
 */
function setupLazyLoading() {
    // Verifica suporte a lazy loading nativo
    if ('loading' in HTMLImageElement.prototype) {
        // Usa lazy loading nativo
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
        });
    } else {
        // Fallback com IntersectionObserver
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

// ============================================
// 9. INICIALIZAÇÃO
// Ponto de entrada principal
// ============================================

/**
 * Inicializa todos os módulos quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    // Log de inicialização (pode ser removido em produção)
    console.log('🚀 DSW Data - Inicializando...');
    
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
    
    // Inicializa formulário de contato
    const contactForm = new ContactForm();
    
    // Utilitários
    updateYear();
    setupSmoothScroll();
    setupCardHoverEffects();
    setupLazyLoading();
    
    console.log('✅ DSW Data - Inicialização completa!');
});

/**
 * Tratamento de erros global
 * Captura erros não tratados
 */
window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.error);
});

/**
 * Log quando a página está totalmente carregada
 */
window.addEventListener('load', () => {
    console.log('📄 Página totalmente carregada');
});

/* ============================================
   INTEGRAÇÃO COM EMAILJS
   Envia emails diretamente do navegador
   
   Documentação: https://www.emailjs.com/docs/
============================================ */

/**
 * Configuração do EmailJS
 * Substitua pelos seus IDs do painel EmailJS
 */
const EMAILJS_CONFIG = {
    publicKey: 'vBH7wkuSP3OO2riWW',      // Encontre em: Account → API Keys
    serviceId: 'service_56133hz',       // Encontre em: Email Services
    templateId: 'template_qa3zl06'      // Encontre em: Email Templates
};

/**
 * Inicializa o EmailJS quando a página carrega
 */
function initEmailJS() {
    // Carrega o SDK do EmailJS dinamicamente
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
        // Inicializa com sua Public Key
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('📧 EmailJS inicializado');
    };
    document.head.appendChild(script);
}

/**
 * Classe ContactForm atualizada para usar EmailJS
 */
class ContactFormEmailJS {
    constructor() {
        this.form = document.querySelector('#contact-form');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.originalBtnText = this.submitBtn?.innerHTML;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validação em tempo real
        const inputs = this.form.querySelectorAll('.form__input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    /**
     * Manipula o envio do formulário
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Valida o formulário
        if (!this.validateForm()) return;
        
        // Mostra loading no botão
        this.setLoading(true);
        
        try {
            // Coleta os dados do formulário
            const formData = {
                name: this.form.querySelector('#name').value,
                email: this.form.querySelector('#email').value,
                service: this.form.querySelector('#service').value,
                message: this.form.querySelector('#message').value
            };
            
            // Envia via EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                formData
            );
            
            console.log('✅ Email enviado:', response);
            
            // Mostra sucesso
            this.showSuccess();
            
            // Limpa o formulário
            this.form.reset();
            
        } catch (error) {
            console.error('❌ Erro ao enviar:', error);
            this.showError('Erro ao enviar mensagem. Tente novamente ou use o WhatsApp.');
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
            setTimeout(() => successEl.remove(), 300);
        }, 5000);
    }
    
    /**
     * Mostra mensagem de erro
     */
    showError(message) {
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
            setTimeout(() => errorEl.remove(), 300);
        }, 5000);
    }
}

// Adiciona CSS para animação de loading
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

// Inicializa EmailJS e o formulário
document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();
    
    // Aguarda SDK carregar e inicializa o formulário
    setTimeout(() => {
        new ContactFormEmailJS();
    }, 1000);
});



