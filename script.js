// === 1. NAVBAR: Mostrar/Ocultar en Scroll ===
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    let prevScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        navbar.style.top = prevScroll > currentScroll ? "0" : "-60px";
        prevScroll = currentScroll;
    });

    
    if (
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
) {
  document.body.classList.add('safari');
}

    // === 2. SUBMENU con animación GSAP ===
    const submenu = document.getElementById("submenu");
    const closeBtn = document.querySelector(".close-btn");

    window.toggleMenu = function (open) {
        const tl = gsap.timeline();

        if (open) {
            submenu.style.display = "flex";
            document.body.style.overflow = "hidden";

            tl.fromTo(submenu, {
                    opacity: 0,
                    y: -50
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                })
                .fromTo(closeBtn, {
                    rotation: 0
                }, {
                    rotation: 180,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0);
        } else {
            gsap.to(submenu, {
                opacity: 0,
                y: -50,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    submenu.style.display = "none";
                    document.body.style.overflow = "auto";
                }
            });

            gsap.to(closeBtn, {
                rotation: 0,
                duration: 0.5,
                ease: "power2.in"
            });
        }
    };

    // === 3. Clase reutilizable para elementos arrastrables ===
    class DraggableElement {
        constructor(selector) {
            this.selector = selector;
            this.elements = document.querySelectorAll(selector);
            this.initDraggable();
        }

        initDraggable() {
            if (this.elements.length === 0) {
                console.error(`No elements found for selector: ${this.selector}`);
                return;
            }

            gsap.registerPlugin(Draggable);

            this.elements.forEach(el => {
                Draggable.create(el, {
                    type: "x,y",
                    edgeResistance: 0.65,
                    bounds: window,
                    throwProps: true,
                    onDragStart: () => this.onDragStart(el),
                    onDragEnd: () => this.onDragEnd(el)
                });
            });
        }

        onDragStart(el) {
            console.log(`Dragging started on`, el);
        }

        onDragEnd(el) {
            console.log(`Dragging ended on`, el);
        }

        resetDraggable() {
            this.elements.forEach(el => {
                Draggable.get(el)?.kill();
            });
            this.initDraggable();
        }
    }

    new DraggableElement(".arrastrable");

    // === 4. Animaciones de Flotación ===
    const floatConfigs = [
        {
            selector: ".flotar1",
            y: -16,
            x: 0,
            duration: 3
        },
        {
            selector: ".flotar2",
            y: -12,
            x: 0,
            duration: 1.4
        },
        {
            selector: ".flotar3",
            y: -11,
            x: -2,
            duration: 2
        },
        {
            selector: ".flotar4",
            y: -6,
            x: 0,
            duration: 1
        },
        {
            selector: ".flotar5",
            y: -8,
            x: 0,
            duration: 1.5
        },
        {
            selector: ".flotar6",
            y: 2,
            x: 2,
            duration: 2
        }
  ];

    floatConfigs.forEach(({
        selector,
        y,
        x,
        duration
    }) => {
        gsap.to(selector, {
            y,
            x,
            duration,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    });

    // También se hacen arrastrables los elementos flotantes
    new DraggableElement(".flotar, .flotar1, .flotar2, .flotar3, .flotar4, .flotar5, .flotar6");

    // === 5. Rotación suave según posición del mouse ===
            
    document.addEventListener("mousemove", (event) => {
        const elements = document.querySelectorAll(".rotar");
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const normX = (mouseX / screenWidth) * 4 - 1;
        const normY = (mouseY / screenHeight) * 4 - 2;

        const maxRot = 8;
        const rotationY = normX * maxRot;
        const rotationX = -normY * maxRot;

        elements.forEach(el => {
            el.style.transformStyle = "preserve-3d";
            el.style.willChange = "transform";

            // Aplica perspectiva al contenedor, si existe
            if (el.parentElement) {
                el.parentElement.style.perspective = "1000px";
            }

            gsap.to(el, {
                rotationY,
                rotationX,
                duration: 0.5,
                ease: "power3.out"
            });
        });
    });

    // === 6. PODCAST OVERLAY ===
    const podcastOverlay = document.getElementById("podcast-overlay");
    const podcastPlayer = document.getElementById("podcast-player");
    const closeOverlayBtn = document.getElementById("podcast-overlay");

    window.togglePodcastOverlay = function (open, audioSrc = "") {
        const tl = gsap.timeline();

        if (open) {
            podcastOverlay.style.display = "flex";
            podcastPlayer.src = audioSrc;

            tl.fromTo(podcastOverlay, {
                    opacity: 0
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.25,
                    ease: "power2.out"
                })
                .fromTo(podcastOverlay, {}, {
                    duration: 0.25,
                    ease: "power2.out"
                }, 0);
        } else {
            gsap.to(podcastOverlay, {
                opacity: 0,
                y: 0,
                duration: 0.25,
                ease: "power2.in",
                onComplete: () => {
                    podcastOverlay.style.display = "none";
                    podcastPlayer.pause();
                    podcastPlayer.src = "";
                }
            });

            gsap.to(podcastOverlay, {
                duration: 0.25,
                ease: "power2.in"
            });
        }
    };

    // Listeners
    document.querySelectorAll(".podcast-audio").forEach(podcast => {
        podcast.addEventListener("click", () => {
            const audioSrc = podcast.getAttribute("data-audio");
            if (audioSrc) {
                togglePodcastOverlay(true, audioSrc);
            }
        });
    });

    closeOverlayBtn.addEventListener("click", () => {
        togglePodcastOverlay(false);
    });

    podcastOverlay.addEventListener("click", (e) => {
        if (e.target === podcastOverlay) {
            togglePodcastOverlay(false);
        }
    });
});

// === 7. Filtro de Categorías de Podcast ===
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const filter = item.dataset.filter;

        // Cambia el subrayado
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('underline'));
        item.classList.add('underline');

        // Muestra/Oculta audios
        document.querySelectorAll('.audio-wrap').forEach(audio => {
            const category = audio.dataset.category;

            if (filter === 'todos' || category === filter) {
                audio.style.display = 'block';
            } else {
                audio.style.display = 'none';
            }
        });
    });
});

window.addEventListener('DOMContentLoaded', () => {
    // Simula clic en el botón "Todos" al cargar la página
    document.querySelector('.nav-item[data-filter="todos"]').click();
});

// === 8. Desplazamiento horizontal con el ratón ===
const navSection = document.querySelector('.navegation-secction');
let isDown = false;
let startX;
let scrollLeft;

// --- MOUSE EVENTS ---
navSection.addEventListener('mousedown', (e) => {
    if (window.innerWidth > 768) return;
    isDown = true;
    startX = e.pageX - navSection.offsetLeft;
    scrollLeft = navSection.scrollLeft;
    navSection.classList.add('grabbing');
});

navSection.addEventListener('mouseleave', () => {
    isDown = false;
    navSection.classList.remove('grabbing');
});

navSection.addEventListener('mouseup', () => {
    isDown = false;
    navSection.classList.remove('grabbing');
});

navSection.addEventListener('mousemove', (e) => {
    if (!isDown || window.innerWidth > 768) return;
    e.preventDefault();
    const x = e.pageX - navSection.offsetLeft;
    const walk = (x - startX) * 2;
    navSection.scrollLeft = scrollLeft - walk;
});

// --- TOUCH EVENTS ---
navSection.addEventListener('touchstart', (e) => {
    if (window.innerWidth > 768) return;
    isDown = true;
    startX = e.touches[0].pageX - navSection.offsetLeft;
    scrollLeft = navSection.scrollLeft;
});

navSection.addEventListener('touchend', () => {
    isDown = false;
});

navSection.addEventListener('touchmove', (e) => {
    if (!isDown || window.innerWidth > 768) return;
    const x = e.touches[0].pageX - navSection.offsetLeft;
    const walk = (x - startX) * 2;
    navSection.scrollLeft = scrollLeft - walk;
});

// === 9. Cambio de color aleatorio al pasar el ratón sobre los elementos ===
const colores = ['#83A7FF', '#FED440', '#F47A49', '#C58FFE', '#FFD0E2'];


const audioWraps = document.querySelectorAll('.audio-wrap');

audioWraps.forEach(element => {
    element.addEventListener('mouseenter', function () {
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        element.style.color = colorAleatorio;
    });

    element.addEventListener('mouseleave', function () {
        element.style.color = ''; // Restablecer el color original
    });
});

// === 10. Mostrar/Ocultar respuesta ===
function toggleText() {
    const texto = document.getElementById("respuesta");
    texto.classList.toggle("show");
    texto.classList.toggle("hidden");
}

// === 11. Animación de pantalla de carga ===
window.onload = function () {
    document.body.classList.add("locked");

    const tl = gsap.timeline();
    const splitMainText = new SplitText(".main-text .text", {
        type: "chars"
    });
    const splitSubText = new SplitText(".sub-text .text", {
        type: "chars"
    });

    tl.from(splitMainText.chars, {
            opacity: 0,
            y: 100,
            duration: 1,
            stagger: .1,
            filter: "blur(2px)",
            ease: "back.out(1.4)"
        })
        .to(".sub-text", {
            opacity: 1,
            delay: .5,
            filter: "blur(0px)",
            y: 20,
            duration: 1,
            ease: "back.out(1.7)"
        });

    tl.to(".loading-screen", {
        y: "-100%",
        duration: 0.5,
        delay: 0.5,
        ease: "slow(0.7, 0.7, true)",
        onComplete: () => {
            document.body.classList.remove("locked");
        }
    });
};


//////


// === ARRAY D'EPISODIS ===
const episodis = [
    {
        titol: "IA: i grans corporacions: entre la innovació i el control",
        participants: "Karen, Sofia, Aleix",
        data: "Fecha pendiente",
        arxiu: "gráfica-interactiva/Karen-Sofia-Aleix.mp3",
        categoria: "g-interactiva"
  },
    {
        titol: "Realitat Virtual: Eina de futur o risc per a la societat?",
        participants: "Laura, Jin, Noa",
        data: "Fecha pendiente",
        arxiu: "gráfica-interactiva/Laura-Jin-Noa.mp3",
        categoria: "g-interactiva"
  },
    {
        titol: "Intel·ligència Artificial: Progrés, perill o nova dependència?",
        participants: "Dariel, Aitana, Rocío",
        data: "Fecha pendiente",
        arxiu: "gráfica-interactiva/Dariel-Aitana-Rocío.mp3",
        categoria: "g-interactiva"
  },
    {
        titol: "IA i Art: Revolució creativa o amenaça?",
        participants: "Ariadna, David, Juanita",
        data: "Fecha pendiente",
        arxiu: "gráfica-interactiva/Ariadna-David-Juanita.mp3",
        categoria: "g-interactiva"
  },
    {
        titol: "Disseny Digital vs. Disseny Artesanal: Conflictes i Convivència",
        participants: "Guio, Eva, Clara",
        data: "Fecha pendiente",
        arxiu: "gráfica-interactiva/Guio-Eva-Clara.mp3",
        categoria: "g-interactiva"
  },
    {
        titol: "Publi-1",
        participants: "Andrea, Sara, Roger",
        data: "Fecha pendiente",
        arxiu: "publicitaria/1_Andrea Sara Roger_(Vocals).mp3",
        categoria: "g-publicitaria"
  },
    {
        titol: "Publi-2",
        participants: "Carol, Evelyn, Ariadna",
        data: "Fecha pendiente",
        arxiu: "publicitaria/1_Carol Evelyn Ariadna_(Vocals).mp3",
        categoria: "g-publicitaria"
  },
    {
        titol: "Publi-3",
        participants: "Núria, Ainoha, Cata",
        data: "Fecha pendiente",
        arxiu: "publicitaria/1_Núria Ainoha Cata_(Vocals).mp3",
        categoria: "g-publicitaria"
  },
    {
        titol: "Publi-4",
        participants: "Enzo, Anàs, Rachid, Alba",
        data: "Fecha pendiente",
        arxiu: "publicitaria/Enzo-Anàs-Rachid-Alba.mp3",
        categoria: "g-publicitaria"
  },
    {
        titol: "Publi-5",
        participants: "Laura, Katherine, Ruby",
        data: "Fecha pendiente",
        arxiu: "publicitaria/Laura-Katherine-Ruby.mp3",
        categoria: "g-publicitaria"
  },
    {
        titol: "Animació-1",
        participants: "Arnau, Lorena, Hugo, Carla",
        data: "Fecha pendiente",
        arxiu: "animacion/Arnau-Lorena-Hugo-Carla.mp3",
        categoria: "animacion"
  },
    {
        titol: "Animació-2",
        participants: "Genís, Vhal, Cristina",
        data: "Fecha pendiente",
        arxiu: "animacion/Genís-Vhal-Cristina.mp3",
        categoria: "animacion"
  },
    {
        titol: "Animació-3",
        participants: "Glòria, Mia, Laia",
        data: "Fecha pendiente",
        arxiu: "animacion/Glòria-Mia-Laia.mp3",
        categoria: "animacion"
  },
    {
        titol: "Animació-4",
        participants: "Janet, Marcos, Anna, Ari",
        data: "Fecha pendiente",
        arxiu: "animacion/Janet-Marcos-Anna-Ari.mp3",
        categoria: "animacion"
  },
    {
        titol: "Animació-5",
        participants: "Desconeguts",
        data: "Fecha pendiente",
        arxiu: "animacion/Podcast-animació-bonus-track.mp3",
        categoria: "animacion"
  },
    {
        titol: "Il·lustració-1",
        participants: "Alma, Sara, Clara",
        data: "Fecha pendiente",
        arxiu: "ilustracion/Alma-Sara-Clara.mp3",
        categoria: "ilustracion"
  },
    {
        titol: "Il·lustració-2",
        participants: "Bruna, Charly, Leyre",
        data: "Fecha pendiente",
        arxiu: "ilustracion/Bruna-Charly-Leyre.mp3",
        categoria: "ilustracion"
  },
    {
        titol: "Il·lustració-3",
        participants: "Edgar, Arlet, Lucía",
        data: "Fecha pendiente",
        arxiu: "ilustracion/Edgar-Arlet-Lucía.mp3",
        categoria: "ilustracion"
  },
    {
        titol: "Il·lustració-4",
        participants: "Paula, Ester, Andrea",
        data: "Fecha pendiente",
        arxiu: "ilustracion/Paula-Ester-Andrea.mp3",
        categoria: "ilustracion"
  },
    {
        titol: "Il·lustració-5",
        participants: "Zoie, Mónica, David",
        data: "Fecha pendiente",
        arxiu: "ilustracion/Zoie-Mónica-David.mp3",
        categoria: "ilustracion"
  },
    {
        titol: "Arts del mur-1",
        participants: "Abril, Lucía C., Judith",
        data: "Fecha pendiente",
        arxiu: "arts-del-mur/Abril-Lucía-C.-Judith.mp3",
        categoria: "arts-del-mur"
  },
    {
        titol: "Arts del mur-2",
        participants: "Abril, Lucía C., Judith",
        data: "Fecha pendiente",
        arxiu: "arts-del-mur/Abril-Lucía-C.-Judith.mp3",
        categoria: "arts-del-mur"
  },
    {
        titol: "Arts del mur-3",
        participants: "Lucía V., Carme, Valeri, Erica",
        data: "Fecha pendiente",
        arxiu: "arts-del-mur/Lucia-V.-Carme-Valeri-Erica.mp3",
        categoria: "arts-del-mur"
  },
    {
        titol: "Arts del mur-4",
        participants: "Rocío, Marina, Lluïsa",
        data: "Fecha pendiente",
        arxiu: "arts-del-mur/Rocío-Marina-Lluïsa.mp3",
        categoria: "arts-del-mur"
  }
];

// === REFERENCIA AL CONTENEDOR ===
const llista = document.getElementById("llista-episodis");
let audioActiu = null;

function renderEpisodis(filtre = "todos") {
    llista.innerHTML = ""; // Neteja la llista abans de mostrar

    const episodisFiltrats = filtre === "todos" ?
        episodis :
        episodis.filter(e => e.categoria === filtre);

    episodisFiltrats.forEach(epi => {
        const div = document.createElement("div");
        div.className = "audio-wrap dani-code";
        div.setAttribute("data-category", epi.categoria);

        div.innerHTML = `
      <div class="episodi-grid">
        <div class="info">
          <h2>${epi.titol}</h2>

<div class="episode-grid-interno">
          <p><strong>Participants:</strong> ${epi.participants}</p>
          <p><strong>Data:</strong> ${epi.data}</p>
</div>
        </div>
        <div class="player">
          <audio controls src="${epi.arxiu}"></audio>
        </div>
      </div>
    `;

        const audio = div.querySelector("audio");

        audio.addEventListener("play", () => {
            if (audioActiu && audioActiu !== audio) {
                audioActiu.pause();
            }
            audioActiu = audio;

            document.querySelectorAll(".audio-wrap .dani-code").forEach(el => el.classList.remove("actiu"));
            div.classList.add("actiu");
        });

        audio.addEventListener("pause", () => {
            if (audio === audioActiu) {
                div.classList.remove("actiu");
                audioActiu = null;
            }
        });

        llista.appendChild(div);
    });

    addHoverListeners(); // <--- MUY IMPORTANTE
}

// === RENDER INICIAL ===
renderEpisodis();

function addHoverListeners() {
    const colores = ['#83A7FF', '#FED440', '#F47A49', '#C58FFE', '#FFD0E2'];
    document.querySelectorAll('.audio-wrap').forEach(element => {
        element.addEventListener('mouseenter', function () {
            const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
            element.style.color = colorAleatorio;
        });

        element.addEventListener('mouseleave', function () {
            element.style.color = '';
        });
    });
}

// === FILTRAT PER CATEGORIA ===
document.querySelectorAll('.nav-item').forEach(boto => {
    boto.addEventListener('click', () => {
        const filtre = boto.getAttribute('data-filter');

        // Subratllat actiu
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('underline'));
        boto.classList.add('underline');

        renderEpisodis(filtre);
    });
});

// === CLIC AUTOMÀTIC A "TOTS" AL CARREGAR ===
window.addEventListener('DOMContentLoaded', () => {
    const botoTots = document.querySelector('.nav-item[data-filter="todos"]');
    if (botoTots) botoTots.click();
});
