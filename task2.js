(() => {
  const AB_ELEMENT_ID = 'data-ab-element-id';
  const STICKY_CONTAINER_ATTR_NAME = 'sticky-container';
  const STICKY_HEADER_ATTR_NAME = 'sticky-header';
  const STICKY_BODY_ATTR_NAME = 'sticky-body';
  const SLIDER_WRAPPER_ATTR_NAME = 'slider-wrapper';

  // API constants
  const POKEMON_COUNT = 10;
  const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`;
  // media width
  const BREAKPOINTS = {
    MOBILE: 0,
    TABLET: 768,
    DESKTOP: 1024,
  };

  const overlay = document.createElement('div');
  const stickyDrawerContainer = document.createElement('div');
  const stickyDrawerHeader = document.createElement('div');
  const stickyDrawerBody = document.createElement('div');
  const sliderWrapper = document.createElement('div');

  overlay.setAttribute('data-ab-element-id', 'injected-overlay');
  stickyDrawerContainer.setAttribute(AB_ELEMENT_ID, STICKY_CONTAINER_ATTR_NAME);
  stickyDrawerHeader.setAttribute(AB_ELEMENT_ID, STICKY_HEADER_ATTR_NAME);
  stickyDrawerBody.setAttribute(AB_ELEMENT_ID, STICKY_BODY_ATTR_NAME);
  sliderWrapper.setAttribute(AB_ELEMENT_ID, SLIDER_WRAPPER_ATTR_NAME);

  stickyDrawerHeader.innerHTML = `
    <div class="drawer-title">Explore Our Sticky Drawer</div>
    <div class="controls-container">
      <div class="pagination-controls">
          <button class="nav-arrow left">&lt;</button>
          <span class="page-counter">1/1</span>
          <button class="nav-arrow right">&gt;</button>
      </div>
      <span class="chevron-icon">&#9650</span>
    </div>
  `;

  // disable transition and hide container for initial drawer setup
  stickyDrawerContainer.style.transition = 'none';
  stickyDrawerContainer.style.visibility = 'hidden';

  let currentPage = 1;
  let totalPages = 1;
  let cardsPerPage = 1;
  let pokemonData = [];
  let isLoading = true;

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const closeDrawer = () => {
    if (stickyDrawerContainer.classList.contains('is-open')) {
      stickyDrawerContainer.classList.remove('is-open');
      overlay.remove();
      document.body.style.overflow = '';
    }
  };
  const openDrawer = () => {
    if (!stickyDrawerContainer.classList.contains('is-open')) {
      stickyDrawerContainer.classList.add('is-open');
      document.body.appendChild(overlay);
      updatePaginationUI();
    }
  };

  const updatePaginationUI = () => {
    cardsPerPage = getCardsPerPage();
    totalPages = Math.ceil(POKEMON_COUNT / cardsPerPage);

    currentPage = Math.min(currentPage, totalPages);
    currentPage = Math.max(currentPage, 1);

    const pageCounter = stickyDrawerHeader.querySelector('.page-counter');
    const prevArrow = stickyDrawerHeader.querySelector('.nav-arrow.left');
    const nextArrow = stickyDrawerHeader.querySelector('.nav-arrow.right');

    if (pageCounter) {
      pageCounter.textContent = `${currentPage}/${totalPages}`;
    }
    if (prevArrow) {
      prevArrow.classList.toggle('is-disabled', currentPage === 1);
    }
    if (nextArrow) {
      nextArrow.classList.toggle('is-disabled', currentPage === totalPages);
    }

    const targetCardIndex = (currentPage - 1) * cardsPerPage;
    const targetCard = sliderWrapper.children[targetCardIndex];

    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
      });
    } else {
      sliderWrapper.scrollLeft = 0;
    }
  };

  // determines how many cards should be visible per page in sliderWrapper based on the current viewport width
  const getCardsPerPage = () => {
    const width = window.innerWidth;
    if (width >= BREAKPOINTS.DESKTOP) return 4;
    if (width >= BREAKPOINTS.TABLET) return 2;
    return 1;
  };

  const paginateAction = (direction) => {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      updatePaginationUI();
    }
  };

  const createCard = (data = null) => {
    const card = document.createElement('div');
    const contentWrapper = document.createElement('div');
    const header = document.createElement('div');
    const slideTitle = document.createElement('h6');
    const toolTip = document.createElement('div');
    const toolTipContent = document.createElement('span');
    const imageContainer = document.createElement('div');
    const description = document.createElement('p');
    const button = document.createElement('button');

    card.className = 'info-card';
    contentWrapper.className = 'card-content-wrapper';
    header.className = 'card-header';
    slideTitle.className = 'slide-title';
    toolTip.className = 'slide-tooltip';
    imageContainer.className = 'image-container';
    description.className = 'slide-description';
    button.className = 'slide-button';
    toolTipContent.className = 'tooltip-content';

    if (data) {
      // --- Data Injected ---
      const types = data.types.map((t) => t.type.name).join(', ');
      slideTitle.textContent = data.name.toUpperCase();
      imageContainer.innerHTML = `<img 
        src="${data.sprites.front_default}" 
        alt="${data.name}" 
        onerror="this.src='https://placehold.co/64x64/CCCCCC/333333?text=IMG'"
        style="height:64px; width:64px; margin: 0 auto;"
      >`;
      description.textContent = `ID: ${data.id}. Type: ${types}`;
      button.textContent = 'View Details';
      toolTipContent.textContent = 'Data from PokeAPI';
    } else {
      // --- Loading/Placeholder ---
      slideTitle.textContent = 'Loading...';
      description.textContent = 'Fetching data from API...';
      imageContainer.textContent = 'Image Slot';
      button.textContent = '...';
      toolTipContent.textContent = 'Loading...';
    }

    toolTip.textContent = 'ⓘ';
    toolTip.appendChild(toolTipContent);
    header.append(slideTitle, toolTip);
    contentWrapper.append(header, imageContainer, description, button);
    card.appendChild(contentWrapper);

    return card;
  };

  const handleScrollToClose = () => {
    const isDrawerOpen = stickyDrawerContainer.classList.contains('is-open');
    if (!isDrawerOpen) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition + clientHeight >= scrollHeight - 1) {
      closeDrawer();
    }
  };

  // forces the positioning of the sticker header (instantaneous because no transitions), then re-enable transitions, and make visible
  const setupInitialPosition = () => {
    const bodyHeight = Math.ceil(stickyDrawerBody.offsetHeight);

    stickyDrawerContainer.style.transform = `translateY(${bodyHeight}px)`;
    stickyDrawerContainer.offsetHeight;

    stickyDrawerContainer.style.transition =
      'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    stickyDrawerContainer.style.visibility = 'visible';
  };

  const fetchPokemonData = async () => {
    isLoading = true;
    try {
      const response = await fetch(POKEMON_URL);
      if (!response.ok) throw new Error('Failed to fetch Pokémon list');
      const data = await response.json();

      const detailedData = data.results.map((p) =>
        fetch(p.url).then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch details for ${p.name}`);
          return res.json();
        })
      );

      pokemonData = await Promise.all(detailedData);
    } catch (error) {
      console.error('API Error: Could not load Pokémon data.', error);
    } finally {
      isLoading = false;
      populateSlider();
      updatePaginationUI();
    }
  };

  const populateSlider = () => {
    // clear previous content
    sliderWrapper.innerHTML = '';

    if (isLoading) {
      for (let i = 0; i < POKEMON_COUNT; i++) {
        sliderWrapper.appendChild(createCard(null));
      }
    } else if (pokemonData.length > 0) {
      pokemonData.forEach((data) => {
        sliderWrapper.appendChild(createCard(data));
      });
    } else {
      // Show a single error card if fetch failed completely
      const errorCard = createCard({
        name: 'Error',
        id: 'N/A',
        sprites: { front_default: '' },
        types: [{ type: { name: 'Fetch Failed' } }],
      });
      errorCard.querySelector('.slide-description').textContent =
        'Failed to load Pokémon data from API.';
      errorCard.style.backgroundColor = 'lightcoral';
      sliderWrapper.appendChild(errorCard);
    }
  };

  const initListeners = () => {
    stickyDrawerHeader.addEventListener('click', () => {
      const isOpen = stickyDrawerContainer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener('click', closeDrawer);

    // Pagination
    stickyDrawerHeader
      .querySelector('.nav-arrow.left')
      .addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent drawer toggle
        paginateAction(-1);
      });
    stickyDrawerHeader
      .querySelector('.nav-arrow.right')
      .addEventListener('click', (e) => {
        e.stopPropagation();
        paginateAction(1);
      });

    window.addEventListener('scroll', debounce(handleScrollToClose, 100));

    // update pagination/position on resize
    window.addEventListener(
      'resize',
      debounce(() => {
        if (!stickyDrawerContainer.classList.contains('is-open')) {
          setupInitialPosition();
        }
        updatePaginationUI();
      }, 100)
    );
  };

  populateSlider();

  stickyDrawerBody.appendChild(sliderWrapper);
  stickyDrawerContainer.append(stickyDrawerHeader, stickyDrawerBody);
  document.body.appendChild(stickyDrawerContainer);

  window.requestAnimationFrame(() => {
    setupInitialPosition();
    initListeners();
    fetchPokemonData();
  });
})();
