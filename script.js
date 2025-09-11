class Portfolio{
    constructor(){
        this.currentPage = 'home';
        this.init();
    }

    init(){
        this.bindEvents();
        this.initTheme();
        this.initScrollReveal();
        this.loadingAnimations();
    }

    bindEvents() {
        document.querySelectorAll('.nav-icon[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPage(e.target.closest('.nav-icon').dataset.page));
        });

        document.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());

        document.getElementById('downloadCV').addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadCV();
        });

        document.querySelectorAll('.project-card[data-url]').forEach(card => {
            card.addEventListener('click', () => this.openProject(card.dataset.url));
        });

        document.querySelectorAll('.certificate-item[data-cert]').forEach(cert => {
            cert.addEventListener('click', () => this.openCertificate(cert.dataset.cert));
        });

        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('certificateModal').addEventListener('click', (e) => {
            if(e.target.id === 'certificateModal') this.closeModal();
        });

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }


    switchPage(pageId){
        if (pageId === this.currentPage) return;

        document.querySelectorAll('.nav-icon').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.remove('active');
        });

        if (pageId === 'about'){
            this.showPage('about');
            setTimeout(() => {
                this.showPage('skills');

                setTimeout(() => {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior:'smooth', block:'start'});
                    }
                }, 100);
            }, 300);
        } else{
            window.scrollTo({top:0, behavior:'smooth'});
            setTimeout(() => this.showPage(pageId), 100);
        }

        this.currentPage = pageId;
        this.announcePageChange(pageId);
    }

    showPage(pageId) {
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
            this.triggerScrollReveal(page);
        }
    }

    toggleTheme(){
        const body = document.body;
        const themeIcon = document.querySelector('.theme-toggle i');

        if (body.hasAttribute('data-theme')){
            body.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark')
        } else{
            body.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        }
    }

    initTheme(){
        const savedTheme = localStorage.getItem('theme');
        const themeIcon = document.querySelector('.theme-toggle i');

        if (savedTheme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-sun';
        }
    }

    downloadCV(){
        const link = document.createElement('a');
        const cvContent = this.generateCVContent();
        const blob = new Blob([cvContent], {type:'text/plain'});
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = 'Kartik_Mishra_CV.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showNotification('CV downloaded successfully!');
    }

    generateCVContent(){
        return `
        KARTIK MISHRA
        Full Stack Developer
        
        Contact:
        Email: kartik.cg15@gmail.com
        Phone: +91 9202177344
        Location: Madhya Pradesh, India
        
        EXPERIENCE:
        • Fresher gaining experience in Full Stack Development
        • Specialized in MERN Stack (MongoDB, Express.js, React, Node.js)
        • Strong foundation in C++ and Data Structures & Algorithms
        
        TECHNICAL SKILLS:
        • Frontend: React.js, HTML5, CSS3, JavaScript
        • Backend: Node.js, Express.js, RESTful APIs
        • Database: MongoDB, MySQL
        • Programming: C++, Data Structures & Algorithms
        • Tools: Git, VS code, npm, webpack
        
        PROJECTS:
        • Password Manager - Secure credentail storage with encryption
        • Task Management App - Real-time collaboration features
        • Portfolio Website - Responsive design with animations
        
        CERTIFICATIONS:
        • Full Stack Web Development - FreeCodeCamp
        • MERN Stack - ApnaCollege
        
        ABOUT: 
        Passionate developer focused on creating efficient, scalable, solutions.
        Strong problem-solving skills with attention to detail and clean code practices.
        Always eager to learn new technologies and contribute to meaningful projects
        `.trim();
    }

    openProject(url) {
        if(url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            this.showNotification('Project demo coming soon!');
        }
    }

    openCertificate(certData) {
        const modal = document.getElementById('certificateModal');
        const modalImage = document.getElementById('modalImage');

        modalImage.src = certData;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            modal.style.opacity = '1';
            modalImage.style.transform = 'scale(1)';
        }, 10);
    }

    closeModal() {
        const modal = document.getElementById('certificateModal');
        const modalImage = document.getElementById('modalImage');

        modal.style.opacity = '0';
        modalImage.style.transform = 'scale(0.8)';

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    initScrollReveal(){
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry =>{
                if(entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.loading, .skill-card, .project-card, .certificate-item').forEach(el => {
            observer.observe(el);
        });
    }

    triggerScrollReveal(container){
        container.querySelectorAll('.loading, .skill-card, .project-card, .certificate-item').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('reveal', 'active');
            }, index * 100);
        });
    }


    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeModal();
        }

        if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.altKey) {
            const pages = ['home', 'about', 'projects', 'certificates', 'contact'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex]) {
                this.switchPage(pages[pageIndex]);
            }
        }
        
        if (e.key.toLowerCase() === 't' && !e.ctrlKey &&!e.altKey) {
            this.toggleTheme();
        }
    }



    announcePageChange(pageName) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = 'position:absolute; left:-10000px; width:1px; height:1px; overflow:hidden';

        const pageNames = {
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            certificates: 'Certificates',
            contact: 'Contact'
        };


        announcement.textContent = `Navigated to ${pageNames[pageName] || pageName} page`;
        document.body.appendChild(announcement);

        setTimeout(() => document.body.removeChild(announcement), 1000);
    }


    showNotification(message)  {
        const notification = document.createElement('div');
        notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        `;

        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => notification.style.transform = 'translateX(100%)', 3000);
        setTimeout(() => document.body.removeChild(notification), 3500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

document.addEventListener('visibilitychange', () => {
    if(document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});



